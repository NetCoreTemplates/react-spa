using Microsoft.AspNetCore.Identity;
using MyApp.Data;
using MyApp.ServiceInterface;
using ServiceStack.Jobs;

[assembly: HostingStartup(typeof(MyApp.ConfigureBackgroundJobs))]

namespace MyApp;

public class ConfigureBackgroundJobs : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddPlugin(new CommandsFeature());
            services.AddPlugin(new BackgroundsJobFeature());
            services.AddHostedService<JobsHostedService>();
        }).ConfigureAppHost(afterAppHostInit: appHost => {
            var services = appHost.GetApplicationServices();
            var jobs = services.GetRequiredService<IBackgroundJobs>();
            // Example of registering a Recurring Job to run Every Hour
            //jobs.RecurringCommand<MyCommand>(Schedule.Hourly);
        });
}

public class JobsHostedService(ILogger<JobsHostedService> log, IBackgroundJobs jobs) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await jobs.StartAsync(stoppingToken);
        
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(3));
        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            await jobs.TickAsync();
        }
    }
}

/// <summary>
/// Sends emails by executing SendEmailCommand in a background job where it's serially processed by 'smtp' worker
/// </summary>
public class EmailSender(IBackgroundJobs jobs) : IEmailSender<ApplicationUser>
{
    public Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        jobs.EnqueueCommand<SendEmailCommand>(new SendEmail {
            To = email,
            Subject = subject,
            BodyHtml = htmlMessage,
        });
        return Task.CompletedTask;
    }

    public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink) =>
        SendEmailAsync(email, "Confirm your email", $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.");

    public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink) =>
        SendEmailAsync(email, "Reset your password", $"Please reset your password by <a href='{resetLink}'>clicking here</a>.");

    public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode) =>
        SendEmailAsync(email, "Reset your password", $"Please reset your password using the following code: {resetCode}");
}
