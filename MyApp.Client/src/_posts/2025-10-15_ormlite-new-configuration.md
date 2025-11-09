---
title: OrmLite new Configuration Model and Defaults
summary: Learn about OrmLite's new fluent Configuration Model, new defaults & features
tags: [db,ormlite]
author: Lucy Bates
image: https://servicestack.net/img/posts/ormlite-new-configuration/bg.webp
---

## New Configuration Model and Defaults

In continuing with ServiceStack's [seamless integration with the ASP.NET Framework](https://docs.servicestack.net/releases/v8_01),
providing a familiar development experience that follows .NET configuration model and Entity Framework conventions
has become a priority.

Implementing a new configuration model also gives us the freedom to change OrmLite's defaults which wasn't possible before 
given the paramount importance of maintaining backwards compatibility in a data access library that accesses existing
Customer data.

#### JSON used for Complex Types

The biggest change that applies to all RDBMS providers is replacing the JSV serialization used for serializing Complex Types 
with JSON now that most RDBMS have native support for JSON.

#### PostgreSQL uses default Naming Strategy

The biggest change to PostgreSQL is using the same default naming strategy as other RDBMS which matches EF's convention
that's used for ASP .NET's Identity Auth tables.

#### SQL Server uses latest 2022 Dialect

SQL Server now defaults to the latest SqlServer 2022 dialect which is also compatible with SQL Server 2016 and up.

## New Configuration Model

OrmLite new modern, fluent configuration API aligns with ASP.NET Core's familiar `services.Add*()` pattern.
This new approach provides a more intuitive and discoverable way to configure your database connections, with strongly-typed
options for each RDBMS provider.

The new configuration model starts with the `AddOrmLite()` extension method to configure its `IDbConnectionFactory` dependency
by combining it with RDBMS provider-specific methods for the RDBMS you wish to use:

 - `UseSqlite()` in **ServiceStack.OrmLite.Sqlite.Data** 
 - `UsePostgres()` in **ServiceStack.OrmLite.PostgreSQL**
 - `UseSqlServer()` in **ServiceStack.OrmLite.SqlServer.Data**
 - `UseMySql()`  in **ServiceStack.OrmLite.MySql**
 - `UseMySqlConnector()`  in **ServiceStack.OrmLite.MySqlConnector**
 - `UseOracle()`  in **ServiceStack.OrmLite.Oracle** (community supported)
 - `UseFirebird()`  in **ServiceStack.OrmLite.Firebird** (community supported)

Each provider method accepts a connection string and an optional configuration callback that lets you customize the dialect's 
behavior with IntelliSense support.

It's an alternative approach to manually instantiating `OrmLiteConnectionFactory` with specific dialect providers,
offering better discoverability and a more consistent experience across different database providers.

### SQLite

```csharp
services.AddOrmLite(options => options.UseSqlite(connectionString));
```

Each RDBMS provider can be further customized to change its defaults with:

```csharp
services.AddOrmLite(options => options.UseSqlite(connectionString, dialect => {
        // Default SQLite Configuration:
        dialect.UseJson = true;
        dialect.UseUtc = true;
        dialect.EnableWal = true;
        dialect.EnableForeignKeys = true;
        dialect.BusyTimeout = TimeSpan.FromSeconds(30);
    })
);
```

### PostgreSQL

```csharp
services.AddOrmLite(options => options.UsePostgres(connectionString));
```

With Dialect Configuration:

```csharp
services.AddOrmLite(options => options.UsePostgres(connString, dialect => {
        // Default PostgreSQL Configuration:
        dialect.UseJson = true;
        dialect.NamingStrategy = new OrmLiteNamingStrategyBase();
    })
);
```

### Removed snake_case naming strategy

<div class="float-right -mt-24 -mr-32 max-w-xs pl-4">

![](https://servicestack.net/img/posts/ormlite-new-configuration/postgres-naming-strategy.webp)

</div>

PostgreSQL now defaults to using the same naming strategy as other RDBMS, i.e. no naming strategy, and uses the 
PascalCase naming of C# classes as-is.

With this change OrmLite's table and columns now follow EF's convention which is used for ASP.NET's Identity Auth tables.

This is more fragile in PostgreSQL as it forces needing to use quoted table and column names for all queries, e.g.

```sql
SELECT "MyColumn" FROM "MyTable"
```

This is required as PostgreSQL isn't case-insensitive and lowercases all unquoted symbols, e.g:

```sql
SELECT MyColumn FROM MyTable
-- Translates to:
SELECT mycolumn FROM mytable
```

This is already done by OrmLite, but any custom queries also need to use quoted symbols.

### SQL Server

```csharp
services.AddOrmLite(options => options.UseSqlServer(connectionString));
```

With Dialect Configuration:

```csharp
services.AddOrmLite(options => options.UseSqlServer(connString, dialect => {
        // Default SQL Server Configuration:
        dialect.UseJson = true;
    })
);
```

### Uses Latest SQL Server at each .NET LTS Release

To keep it modern and predictable, this will use the latest SQL Server Dialect that was released at the time of each 
major .NET LTS versions, currently `SqlServer2022OrmLiteDialectProvider`, which we'll keep until the next .NET LTS release.
Although the **2022** dialect is also compatible with every SQL Server version from **2016+**.

To use an explicit version of SQL Server you can use the generic overload that best matches your SQL Server version:

```csharp
services.AddOrmLite(options => 
    options.UseSqlServer<SqlServer2014OrmLiteDialectProvider>(connString));
```

### MySQL

```csharp
services.AddOrmLite(options => options.UseMySql(connectionString));
```

With Dialect Configuration:

```csharp
services.AddOrmLite(options => options.UseMySql(connectionString, dialect => {
        // Default MySql Configuration:
        dialect.UseJson = true;
    })
);
```

For MySqlConnector use:

```csharp
services.AddOrmLite(options => options.AddMySqlConnector(connectionString));
```

### Named Connections

The new OrmLite configuration model also streamlines support for named connections, allowing you to register 
multiple database connections with unique identifiers in a single fluent configuration chain, e.g:

```csharp
services.AddOrmLite(options => {
        options.UseSqlite(":memory:")
            .ConfigureJson(json => {
                json.DefaultSerializer = JsonSerializerType.ServiceStackJson;
            });
    })
    .AddSqlite("db1", "db1.sqlite")
    .AddSqlite("db2", "db2.sqlite")
    .AddPostgres("reporting", PostgreSqlDb.Connection)
    .AddSqlServer("analytics", SqlServerDb.Connection)
    .AddSqlServer<SqlServer2014OrmLiteDialectProvider>(
        "legacy-analytics", SqlServerDb.Connection)
    .AddMySql("wordpress", MySqlDb.Connection)
    .AddMySqlConnector("drupal", MySqlDb.Connection)
    .AddOracle("enterprise", OracleDb.Connection)
    .AddFirebird("firebird", FirebirdDb.Connection);
```

### Complex Type JSON Serialization

Previously OrmLite only supported serializing Complex Types with a [single Complex Type Serializer](https://docs.servicestack.net/ormlite/complex-type-serializers)
but the new configuration model now uses a more configurable `JsonComplexTypeSerializer` where you can change the default 
JSON Serializer OrmLite should use for serializing Complex Types as well as fine-grain control over which types should
be serialized with which serializer by using the `.ConfigureJson()` extension method for each provider.

```csharp
services.AddOrmLite(options => {
        options.UsePostgres(connectionString)
            .ConfigureJson(json => {
                // Default JSON Complex Type Serializer Configuration
                json.DefaultSerializer = JsonSerializerType.ServiceStackJson;
                json.JsonObjectTypes = [
                    typeof(object),
                    typeof(List<object>),
                    typeof(Dictionary<string, object?>),
                ];
                json.SystemJsonTypes = [];
                json.ServiceStackJsonTypes = [];
            });
    })
```

By default OrmLite uses ServiceStack.Text JSON Serializer which is less strict and more resilient than System.Text.Json
for handling versioning of Types that change over time, e.g. an `int` Property that's later changed to a `string`.

In addition to configuring a default you can also configure which types should be serialized with which serializer.
So we could change OrmLite to use System.Text.Json for all types except for `ChatCompletion` which we want to use 
ServiceStack.Text JSON for:

```csharp
services.AddOrmLite(options => {
        options.UsePostgres(connectionString)
            .ConfigureJson(json => {
                json.DefaultSerializer = JsonSerializerType.SystemJson;
                json.ServiceStackJsonTypes = [
                    typeof(ChatCompletion)
                ];
            });
    })
```

#### Unstructured JSON with JSON Object

The default Exception to this is for serialization of `object`, `List<object>` and `Dictionary<string,object>` types which is
better handled by [#Script's JSON Parser](https://docs.servicestack.net/js-utils) 
which is able to parse any valid adhoc JSON into untyped .NET generic collections, which is both mutable and able to 
[utilize C# pattern matching](https://docs.servicestack.net/js-utils#getting-the-client_id-in-a-comfyui-output) 
for easy introspection. 

The new `TryGetValue<T>` extension method on `Dictionary<string,object?>` makes it even more convenient for parsing
adhoc JSON which can use the `out` Type parameter to reduce unnecessary type checking, e.g. here's a simple example 
of parsing a ComfyUI Output for the client_id used in a generation:

```csharp
var comfyOutput = JSON.ParseObject(json);
var prompt = (Dictionary<string, object?>)result.Values.First()!;
if (prompt.TryGetValue("prompt", out List<object> tuple) && tuple.Count > 3)
{
    if (tuple[3] is Dictionary<string, object?> extraData
        && extraData.TryGetValue("client_id", out string clientId))
    {
        Console.WriteLine(clientId);
    }
}
```

Where as an Equivalent implementation using System.Text.Json `JsonDocument` would look like:

```csharp
using System.Text.Json;

var jsonDocument = JsonDocument.Parse(json);
var root = jsonDocument.RootElement;

// Get the first property value (equivalent to result.Values.First())
var firstProperty = root.EnumerateObject().FirstOrDefault();
if (firstProperty.Value.ValueKind == JsonValueKind.Object)
{
    var prompt = firstProperty.Value;

    if (prompt.TryGetProperty("prompt", out var promptElement)
        && promptElement.ValueKind == JsonValueKind.Array)
    {
        var promptArray = promptElement.EnumerateArray().ToArray();
        if (promptArray.Length > 3)
        {
            var extraDataElement = promptArray[3];
            if (extraDataElement.ValueKind == JsonValueKind.Object
                && extraDataElement.TryGetProperty("client_id", out var clientIdElement)
                && clientIdElement.ValueKind == JsonValueKind.String)
            {
                var clientId = clientIdElement.GetString();
                Console.WriteLine(clientId);
            }
        }
    }
}
```

### Table Aliases

One potential breaking change is that table aliases are used verbatim and no longer uses a naming strategy for transforming
its name which potentially affects PostgreSQL when an Alias is used that doesn't match the name of the table, e.g:

```csharp
[Alias("MyTable")] //= "MyTable" 
public class NewMyTable { ... }

[Alias("MyTable")] //= my_table 
public class OldMyTable { ... }
```

Aliases should either be changed to the Table name you want to use or you can use the Naming Strategy Alias dictionaries
for finer-grain control over what Schema, Table, Column Names and Aliases should be used: 

```csharp
services.AddOrmLite(options => options.UsePostgres(connString, dialect => {
    dialect.NamingStrategy.TableAliases["MyTable"] = "my_table";
    dialect.NamingStrategy.SchemaAliases["MySchema"] = "my_schema";
    dialect.NamingStrategy.ColumnAliases["MyColumn"] = "my_columnt";
}));
```

### Table Refs

A significant internal refactor of OrmLite was done to encapsulate different ways of referring to a table in a single
`TableRef` struct, which is now used in all APIs that need a table reference.

The new `TableRef` struct allows for unified APIs that encapsulates different ways of referencing a table:

- Type `new TableRef(typeof(MyTable))`
- Model Definition `new TableRef(ModelDefinition<MyTable>.Definition)`
- Table Name `new TableRef("MySchema")`
- Schema and Table Name `new TableRef("MySchema", "MyTable"))`
- Quoted Name (use verbatim) `TableRef.Literal("\"MyTable\"")`
- Implicitly casts to a string as `new TableRef("MySchema")`.

OrmLite handles differences between different RDBMS Providers via its `IOrmLiteDialectProvider` interface.
Previously OrmLite used to maintain multiple overloads for handling some of these differences in referencing a
table but they've now all been consolidated into use a single `TableRef` parameter:

```csharp
public interface IOrmLiteDialectProvider
{
    bool DoesTableExist(IDbConnection db, TableRef tableRef);
    string GetTableNameOnly(TableRef tableRef);
    string UnquotedTable(TableRef tableRef);
    string GetSchemaName(TableRef tableRef);
    string QuoteTable(TableRef tableRef);
    bool DoesTableExist(IDbConnection db, TableRef tableRef);
    bool DoesColumnExist(IDbConnection db, string columnName, TableRef tableRef);
    string ToAddColumnStatement(TableRef tableRef, FieldDefinition fieldDef);
    string ToAlterColumnStatement(TableRef tableRef, FieldDefinition fieldDef);
    string ToChangeColumnNameStatement(TableRef tableRef, FieldDefinition fieldDef, string oldColumn);
    string ToRenameColumnStatement(TableRef tableRef, string oldColumn, string newColumn);
    string ToDropColumnStatement(TableRef tableRef, string column);
    string ToDropConstraintStatement(TableRef tableRef, string constraint);
    string ToDropForeignKeyStatement(TableRef tableRef, string foreignKeyName);
}
```

For example the `QuoteTable(TableRef)` method can be used to quote a table. Assuming our dialect was configured 
with the `my_table` Table Aliases, these are the results for the different ways of referencing `MyTable`:

```csharp
dialect.QuoteTable("MyTable")                       //= "my_table" (implicit)
dialect.QuoteTable(new("MyTable"))                  //= "my_table"
dialect.QuoteTable(new("MySchema","MyTable"))       //= "my_schema"."my_table"
dialect.QuoteTable(TableRef.Literal("\"MyTable\"")) //= "MyTable" (verbatim)
dialect.QuoteTable(new(typeof(MyTable)))            //= "my_table"
dialect.QuoteTable(new(ModelDefinition<MyTable>.Definition)) //= "my_table"
```

### Improved Observability

Significant effort was put into improving OrmLite's Observability where OrmLite's DB Connections can now be tagged
to make them easier to track in hooks, logs and traces.

To achieve this a new `Action<IDbConnection>` configuration callbacks were added to OrmLite Open Connection APIs
which is invoked before a DB Connection is opened, e.g:

```csharp
using var db = dbFactory.Open(configure: db => db.WithTag("MyTag"));
using var db = dbFactory.Open(namedConnection, 
    configure: db => db.WithTag("MyTag"));

using var db = HostContext.AppHost.GetDbConnection(req, 
    configure: db => db.WithTag("MyTag"));
```

Which ServiceStack uses internally to tag DB Connections with the feature executing it, or for `Db` connections used in 
Services it will tag it with the Request DTO Name.

<div class="wideshot">

![](https://servicestack.net/img/posts/ormlite-new-configuration/ormlite-tags.webp)

</div>

If a tag is configured, it's also included in OrmLite's Debug Logging output, e.g:

```txt
dbug: ServiceStack.OrmLiteLog[0]
      [PostgresDbJobsProvider] SQL: SELECT "Id", "ParentId", "RefId", "Worker", "Tag", "BatchId", "Callback", "DependsOn", "RunAfter", "CreatedDate", "CreatedBy", "RequestId", "RequestType", "Command", "Request", "RequestBody", "UserId", "Response", "ResponseBody", "State", "StartedDate", "CompletedDate", "NotifiedDate", "RetryLimit", "Attempts", "DurationMs", "TimeoutSecs", "Progress", "Status", "Logs", "LastActivityDate", "ReplyTo", "ErrorCode", "Error", "Args", "Meta" 
      FROM "BackgroundJob"
      WHERE ("State" = :0)
      PARAMS: :0=Cancelled
dbug: ServiceStack.OrmLiteLog[0]
      TIME: 1.818m
```

#### DB Command Execution Timing

OrmLite's debug logging now also includes the elapsed time it took to execute the command which is also available on the 
`IDbCommand` `GetTag()` and `GetElapsedTime()` APIs, e.g:

```csharp
OrmLiteConfig.AfterExecFilter = cmd =>
{
    Console.WriteLine($"[{cmd.GetTag()}] {cmd.GetElapsedTime()}");
};
```

### ExistsById APIs

New `ExistsById` APIs for checking if a row exists for a given Id:

```csharp
db.ExistsById<Person>(1);
await db.ExistsByIdAsync<Person>(1);

// Alternative to:
db.Exists<Person>(x => x.Id == 1);
await db.ExistsAsync<Person>(x => x.Id == 1);
```

### ResetSequence for PostgreSQL

The `ResetSequence` API is available to reset a Table's Id sequence in Postgres:

```csharp
db.ResetSequence<MyTable>(x => x.Id);
```

#### Data Import example using BulkInsert

This is useful to reset a PostgreSQL Table's auto-incrementing sequence when re-importing a dataset from a 
different database, e.g:

```csharp
db.DeleteAll<Tag>();
db.ResetSequence<Tag>(x => x.Id);
db.DeleteAll<Category>();
db.ResetSequence<Category>(x => x.Id);
        
var config = new BulkInsertConfig { Mode = BulkInsertMode.Sql };
db.BulkInsert(dbSqlite.Select<Tag>().OrderBy(x => x.Id), config);
db.BulkInsert(dbSqlite.Select<Category>().OrderBy(x => x.Id), config);
```

### New SqlDateFormat and SqlChar Dialect APIs

The SQL Dialect functions provide an RDBMS agnostic way to call SQL functions that differs among different RDBMS's.

The `DateFormat` accepts [SQLite strftime() function](https://www.w3resource.com/sqlite/sqlite-strftime.php) date and 
time modifiers in its format string whilst the `Char` accepts a character code, e.g:

```csharp
var q = db.From<MyTable>();
var createdDate = q.Column<MyTable>(c => c.CreatedDate);
var months = db.SqlList<(string month, string log)>(q
    .Select(x => new {
        Month = q.sql.DateFormat(createdDate, "%Y-%m"),
        Log = q.sql.Concat(new[]{ "'Prefix'", q.sql.Char(10), createdDate })
    }));
```

When executed in PostgreSQL it would generate:

```sql
SELECT TO_CHAR("CreatedDate", 'YYYY-MM'), 'Prefix' || CHR(10) || "CreatedDate" 
FROM "CompletedJob"
```

--- 

<div class="float-right">

[OrmLite's Async Task Builder](/posts/ormlite-async-task-builder) 👉

</div>