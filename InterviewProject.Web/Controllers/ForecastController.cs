using System.Threading.Tasks;
using InterviewProject.App;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace InterviewProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForecastController : ControllerBase
    {
        private readonly WeatherClient _weatherClient;

        private readonly ILogger<ForecastController> _logger;

        public ForecastController(WeatherClient weatherClient, ILogger<ForecastController> logger)
        {
            _weatherClient = weatherClient;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var forecast = await _weatherClient.GetForecastAsync(id);
            _logger.LogInformation($"Returning {forecast.Length} days of forecast for location '{id}'");
            return Ok(forecast);
        }
    }
}