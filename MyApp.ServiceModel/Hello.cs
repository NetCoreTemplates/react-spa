using ServiceStack;

namespace MyApp.ServiceModel;

[Route("/hello/{Name}")]
public class Hello : IGet, IReturn<HelloResponse>
{
    public required string Name { get; set; }
}

public class HelloResponse
{
    public required string Result { get; set; }
}

public class GetWeatherForecast : IGet, IReturn<WeatherForecast[]>
{
    public required DateOnly? Date { get; set; }
}

public record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary) : IGet, IReturn<WeatherForecast[]>
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
