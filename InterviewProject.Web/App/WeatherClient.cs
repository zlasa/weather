using System.Net.Http;
using System.Threading.Tasks;
using InterviewProject.Models;

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
            var locations = await response.Content.ReadAsAsync<Location[]>();
            return locations;
        }
    }
}