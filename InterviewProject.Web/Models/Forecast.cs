namespace InterviewProject.Models
{
    public class Forecast
    {
        public Forecast(string date, string summary, decimal temperature)
        {
            Date = date;
            Summary = summary;
            Temperature = temperature;
        }

        public string Date { get; }

        public string Summary { get; }

        public decimal Temperature { get; }
    }
}