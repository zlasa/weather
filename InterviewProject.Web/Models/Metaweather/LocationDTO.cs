using Newtonsoft.Json;

namespace InterviewProject.Models.Metaweather
{
    public class LocationDTO
    {
        [JsonProperty("woeid")]
        public string Id { get; set; }

        public string Title { get; set; }
    }
}