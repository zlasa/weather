using Newtonsoft.Json;

namespace InterviewProject.Models.Metaweather
{
    public class ForecastDTO
    {
        [JsonProperty("applicable_date")]
        public string ApplicableDate { get; set; }

        [JsonProperty("weather_state_name")]
        public string WeatherStateName { get; set; }

        [JsonProperty("the_temp")]
        public decimal Temp { get; set; }
    }
}