---
title: Protect same APIs with API Keys or Identity Auth
summary: Learn how to create ServiceStack APIs that can be protected with API Keys or Identity Auth
tags: [apikeys,identity-auth,auth]
author: Brandon Foley
image: https://servicestack.net/img/posts/identityauth-claims-roles/bg.webp
---

Modern APIs need to serve different types of clients, each with distinct authentication requirements. 
Understanding when to use **Identity Auth** versus **API Keys** is crucial to optimize for security, performance, 
and user experience.

## Two Auth Paradigms for Different Use Cases

### Identity Auth: User → API

**Identity Auth** is designed for scenarios where a **human user** is interacting with your API, typically through a 
web or mobile application which:

- Requires user credentials (username/password, OAuth, etc.)
- Establishes a user session with roles and permissions
- For interactive workflows like logins, password resets & email confirmation
- Enables user-specific features like profile management and personalized UX
- Provides full access to user context, claims, and role-based authorization

### API Keys: Machine → API / User Agent → API

**API Keys** are purpose-built for **machine-to-machine** communication or **user agents** accessing your 
API programmatically, without interactive user authentication. This authentication model:

- Provides simple, token-based authentication without user sessions
- Enables fine-grained access control through scopes and features
- Supports non-interactive scenarios like scripts, services, and integrations
- Can optionally be associated with a user but doesn't run in their context
- Offers superior performance by avoiding the auth workflow overhead
- Supports project based billing and usage metrics by API Key

**Common scenarios:**
- Microservices communicating with each other
- Third-party integrations accessing your API
- CLI tools and scripts that need API access
- Mobile apps or SPAs making direct API calls without user context
- Webhooks and automated processes
- Providing API access to partners or customers with controlled permissions

Despite serving 2 different use-cases there are a few times when you may want to serve the same API with both
Identity Auth and API Keys.

### Supporting both Auth Models with 2 APIs

Previously you would've needed to maintain two separate APIs, one protected with Identity Auth and another with API Keys.
Thanks to ServiceStack's message-based APIs and [built-in Auto Mapping](https://docs.servicestack.net/auto-mapping)
this is fairly easy to do:

```csharp
// For authenticated users
[ValidateIsAuthenticated]
public class QueryOrders : QueryDb<Order> { }

// For API key access
[ValidateApiKey]
public class QueryOrdersApiKey : QueryDb<Order> { }

public class OrderService : Service
{
    public List<Order> Get(GetOrders request)
    {
        var userId = Request.GetRequiredUserId();
        // Shared business logic
    }
    
    public List<Order> Get(GetOrdersViaApiKey request) => 
        Get(request.ConvertTo<GetOrders>());
}

public static class MyExtensions
{
    public static string GetRequiredUserId(this IRequest? req) =>
        req.GetApiKey()?.UserAuthId ??
        req.GetClaimsPrincipal().GetUserId() ?? 
        throw HttpError.Unauthorized("API Key must be associated with a user");
}
```

Whilst easy to implement, the biggest draw back with this approach is that it requires maintaining 2x APIs, 
2x API endpoints, and 2x API docs.

## The Best of Both Worlds

ServiceStack's flexible [API Keys feature](https://docs.servicestack.net/auth/apikeys) now allows you to protect 
the same APIs with **both** Identity Auth and API Keys, enabling you to:

- Maintain a single API surface for all clients
- Serve the same interactive UIs protected with Identity Auth or API Keys
- Provide programmatic access via API Keys
- Maintain all the benefits of API Keys

To achieve this, Users will need to have a valid API Key generated for them which would then need to be added to the `apikey`
Claim in the `UserClaimsPrincipalFactory` to be included in their Identity Auth Cookie:

```csharp
// Program.cs
services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, 
    AdditionalUserClaimsPrincipalFactory>();

// AdditionalUserClaimsPrincipalFactory.cs
/// <summary>
/// Add additional claims to the Identity Auth Cookie
/// </summary>
public class AdditionalUserClaimsPrincipalFactory(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager,
    IApiKeySource apiKeySource,
    IOptions<IdentityOptions> optionsAccessor)
    : UserClaimsPrincipalFactory<ApplicationUser,IdentityRole>(
        userManager, roleManager, optionsAccessor)
{
  public override async Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
  {
      var principal = await base.CreateAsync(user);
      var identity = (ClaimsIdentity)principal.Identity!;
      
      var claims = new List<Claim>();
      if (user.ProfileUrl != null)
      {
          claims.Add(new Claim(JwtClaimTypes.Picture, user.ProfileUrl));
      }
      
      // Add Users latest valid API Key to their Auth Cookie's 'apikey' claim
      var latestKey = (await apiKeySource.GetApiKeysByUserIdAsync(user.Id))
          .OrderByDescending(x => x.CreatedDate)
          .FirstOrDefault();
      if (latestKey != null)
      {
          claims.Add(new Claim(JwtClaimTypes.ApiKey, latestKey.Key));
      }
      
      identity.AddClaims(claims);
      return principal;
  }
}
```

After which Authenticated Users will be able to access `[ValidateApiKey]` protected APIs where it attaches the 
API Key in the `apikey` Claim to the request - resulting in the same behavior had they sent their API Key with the request.

```csharp
// For authenticated users or API Keys
[ValidateApiKey]
public class QueryOrders : QueryDb<Order> { }
```