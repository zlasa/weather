using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using InterviewProject.App;
using InterviewProject.Models;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Moq.Protected;
using Newtonsoft.Json.Linq;
using Xunit;

namespace InterviewProject.Tests
{
    public class LocationsControllerTests : TestServerFixture
    {
        private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler = new Mock<HttpMessageHandler>();

        protected override void ConfigureTestServices(IServiceCollection service)
        {
            var mockHttpClientFactory = new Mock<IHttpClientFactory>();
            mockHttpClientFactory.Setup(f => f.CreateClient(nameof(WeatherClient))).Returns(new HttpClient(_mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://weather.api")
            });
            service.AddSingleton(mockHttpClientFactory.Object);
        }

        [Fact]
        public async Task Get_WhenInvokedWithQueryParam_ShouldSearchForLocationsAndReturnJSONArray()
        {
            // Setup
            var jWeatherApiResponse = new JArray
            {
                new JObject
                {
                    ["woeid"] = "id1",
                    ["title"] = "city 1"
                },
                new JObject
                {
                    ["woeid"] = "id2",
                    ["title"] = "city 3"
                }
            };

            HttpRequestMessage actualMessage = null;
            _mockHttpMessageHandler.Protected().Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .Callback<HttpRequestMessage, CancellationToken>((m, t) => actualMessage = m)
                .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new JSONContent(jWeatherApiResponse)
                });

            // Execute
            var response = await Client.GetAsync("/api/locations?search=blah");

            // Verify
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var locations = await response.Content.ReadAsAsync<Location[]>();
            locations.Should().BeEquivalentTo(new Location("id1", "city 1"), new Location("id2", "city 3"));

            actualMessage.Method.Should().Be(HttpMethod.Get);
            actualMessage.RequestUri.Should().Be("http://weather.api/api/location/search/?query=blah");
        }
    }
}