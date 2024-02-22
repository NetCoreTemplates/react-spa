using MyApp.ServiceInterface;
using ServiceStack.NativeTypes.TypeScript;

[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost() : AppHostBase("MyApp"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            // Configure ASP.NET Core IOC Dependencies
            services.AddSingleton(new AppConfig {
                AppBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5173"  
                    : null,
                ApiBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5001"  
                    : null,
            });
        });

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure()
    {
        TypeScriptGenerator.InsertTsNoCheck = true;

        SetConfig(new HostConfig {
        });
    }
    
    // TODO: Replace with your own License Key. FREE Individual or OSS License available from: https://servicestack.net/free
    public static void RegisterKey() =>
        Licensing.RegisterLicense("OSS BSD-3-Clause 2024 https://github.com/NetCoreTemplates/react-spa KAMyxyOBAy8fD9oK7ErmpSQUuELGb+SPjmYpjblPFdLiCNHPO1q3Ftx3gPYAzKnM1lmho159CQW0OtVXG6nyKPYJbaKtdwHVGWhqfdYp4z95Sl1sIHQuB+XY8nrrJ5ZhFubFQZveR/M43thiMynRBVsgfHfxeGruw81hjMtW/N8=");    
}
