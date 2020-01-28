namespace InterviewProject.Models
{
    public class Location
    {
        public Location(string woeid, string title)
        {
            Woeid = woeid;
            Title = title;
        }

        public string Woeid { get; }

        public string Title { get; }
    }
}