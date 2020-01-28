using Newtonsoft.Json;

namespace InterviewProject.Models.Metaweather
{
    public class ForecastResponseDTO
    {
        [JsonProperty("consolidated_weather")]
        public ForecastDTO[] ConsolidatedWeather { get; set; }
    }
}