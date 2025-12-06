---
title: RDBMS Async Tasks Builder
summary: Effortlessly run multiple async DB Requests in parallel with OrmLite's new Async Tasks Builder 
tags: [db,ormlite]
author: Lucy Bates
image: https://servicestack.net/img/posts/ormlite-async-task-builder/bg.webp
---

### Sequential Async DB Access

Async improves I/O thread utilization in multi-threaded apps like Web Servers. However, it doesn't improve the performance 
of individual API Requests that need to execute multiple independent DB Requests. These are often written to run async 
db access sequentially like this:

```csharp
var rockstars = await Db.SelectAsync<Rockstar>();
var albums = await Db.SelectAsync<Album>();
var departments = await Db.SelectAsync<Department>();
var employees = await Db.SelectAsync<Employee>();
```

The issue being that it's not running them in parallel as each DB Request is executed sequentially with the Request for
Albums not starting until the Request for Rockstars has completed.

To run them in parallel you would need to open multiple scoped DB Connections, await them concurrently then do the 
syntax boilerplate gymnastics required to extract the generic typed results, e.g:

```csharp
var connections = await Task.WhenAll(
    DbFactory.OpenDbConnectionAsync(),
    DbFactory.OpenDbConnectionAsync(),
    DbFactory.OpenDbConnectionAsync(),
    DbFactory.OpenDbConnectionAsync()
);

using var dbRockstars = connections[0];
using var dbAlbums = connections[1];
using var dbDepartments = connections[2];
using var dbEmployees = connections[3];

var tasks = new List<Task>
{
    dbRockstars.SelectAsync<Rockstar>(),
    dbAlbums.SelectAsync<Album>(),
    dbDepartments.SelectAsync<Department>(),
    dbEmployees.SelectAsync<Employee>()
};
await Task.WhenAll(tasks);

var rockstars = ((Task<List<Rockstar>>)tasks[0]).Result;
var albums = ((Task<List<Album>>)tasks[1]).Result;
var departments = ((Task<List<Department>>)tasks[2]).Result;
var employees = ((Task<List<Employee>>)tasks[3]).Result;
```

Even without Error handling, writing coding like this can quickly become tedious, less readable and error prone that
as a result is rarely done.

### Parallel DB Requests in TypeScript

This is easier to achieve in languages like TypeScript where typed ORMs like [litdb.dev](https://litdb.dev)
can run multiple DB Requests in parallel with just:

```csharp
const [rockstars, albums, departments, employees] = await Promise.all([
    db.all<Rockstar>($.from(Rockstar)),     //= Rockstar[]
    db.all<Album>($.from(Album)),           //= Album[]
    db.all<Department>($.from(Department)), //= Department[]
    db.all<Employee>($.from(Employee)),     //= Employee[]
])
```

Which benefits from TypeScript's powerful type system that allows destructuring arrays whilst preserving their positional types, 
whilst its single threaded event loop lets you reuse the same DB Connection to run DB Requests in parallel without 
multi-threading issues.

## OrmLite's new Async Tasks Builder

OrmLite's new `AsyncDbTasksBuilder` provides a similar benefit of making it effortless to run multiple async DB Requests 
in parallel, which looks like:

```csharp
var results = await DbFactory.AsyncDbTasksBuilder()
    .Add(db => db.SelectAsync<Album>())
    .Add(db => db.SelectAsync<Rockstar>())
    .Add(db => db.SelectAsync<Employee>())
    .Add(db => db.SelectAsync<Department>())
    .RunAsync();
var (albums, rockstars, employees, departments) = results;
```

Which just like TypeScript's destructuring returns a positionally typed tuple of the results which can be destructured back 
into their typed variables, e.g:

```csharp
(List<Album> albums,
 List<Rockstar> rockstars, 
 List<Employee> employees,
 List<Department> departments) = results;
```

### Supports up to 8 Tasks

It allows chaining up to **8 async Tasks in parallel** as C#'s Type System doesn't allow for preserving different 
positional generic types in an unbounded collection. Instead each Task returns a new Generic Type builder which preserves
the positional types before it.

### Supports both Async `Task<T>` and `Task` APIs

Where `Task<T>` and `Task` APIs can be mixed and matched interchangeably: 

```csharp
var builder = DbFactory.AsyncDbTasksBuilder()
    .Add(db => db.InsertAsync(rockstars[0],rockstars[1]))
    .Add(db => db.SelectAsync<Rockstar>())
    .Add(db => db.InsertAsync(albums[2],albums[3]))
    .Add(db => db.SelectAsync<Album>())
    .Add(db => db.InsertAsync([department]))
    .Add(db => db.SelectAsync<Department>())
    .Add(db => db.InsertAsync([employee]))
    .Add(db => db.SelectAsync<Employee>());
```

Where to preserve the results chain, `Task` APIs return `bool` results, e.g:

```csharp
(bool r1, 
 List<Rockstar> r2, 
 bool r3, 
 List<RockstarAlbum> r4, 
 bool r5, 
 List<Department> r6, 
 bool r7, 
 List<Employee> r8) = await builder.RunAsync();
```

### Error Handling

Whilst tasks are executed in parallel when they're added, any Exceptions are only thrown when the task is awaited:

```csharp
using var Db = await OpenDbConnectionAsync();

var builder = DbFactory.AsyncDbTasksBuilder()
    .Add(db => db.InsertAsync(rockstars[0]))
    .Add(db => db.InsertAsync(rockstars[0])); // <-- Duplicate PK Exception

// Exceptions are not thrown until the task is awaited
try
{
    var task = builder.RunAsync();
}
catch (Exception e)
{
    throw;
}
```

---

👈 [OrmLite's new Configuration Model](/posts/ormlite-new-configuration)
