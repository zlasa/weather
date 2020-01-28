namespace InterviewProject.Models
{
    public class Location
    {
        public Location(string id, string title)
        {
            Id = id;
            Title = title;
        }

        public string Id { get; }

        public string Title { get; }
    }
}