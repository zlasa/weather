using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using InterviewProject.Models;
using InterviewProject.Models.Metaweather;

namespace InterviewProject.App
{
    public class WeatherClient
    {
        private readonly HttpClient _httpClient;

        public WeatherClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Location[]> SearchLocationsAsync(string search)
        {
            var response = await _httpClient.GetAsync($"api/location/search/?query={search}");
            var locations = await response.Content.ReadAsAsync<LocationDTO[]>();
            return locations.Select(l => new Location(l.Id, l.Title)).ToArray();
        }

        public async Task<Forecast[]> GetForecastAsync(string id)
        {
            var response = await _httpClient.GetAsync($"api/location/{id}");
            var forecastResponse = await response.Content.ReadAsAsync<ForecastResponseDTO>();
            return forecastResponse.ConsolidatedWeather.Select(f => new Forecast(f.ApplicableDate, f.WeatherStateName, f.Temp)).ToArray();
        }
    }
}