using System.Threading.Tasks;
using InterviewProject.App;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace InterviewProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly WeatherClient _weatherClient;

        private readonly ILogger<WeatherForecastController> _logger;

        public LocationsController(WeatherClient weatherClient, ILogger<WeatherForecastController> logger)
        {
            _weatherClient = weatherClient;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string search)
        {
            var locations = await _weatherClient.SearchLocationsAsync(search);
            _logger.LogInformation($"Returning {locations.Length} locations for search string '{search}'");
            return Ok(locations);
        }
    }
}