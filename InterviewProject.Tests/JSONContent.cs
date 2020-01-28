using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace InterviewProject.Tests
{
    public class JSONContent : StringContent
    {
        public JSONContent(JToken jToken) : base(jToken.ToString(Formatting.None), Encoding.UTF8, "application/json")
        {
        }
    }
}