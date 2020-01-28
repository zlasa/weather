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
    public class ForecastController : TestServerFixture
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
        public async Task Get_WhenInvokedWithQueryParam_ShouldFetchForecastForProvidedLocationAndReturnJSONArray()
        {
            // Setup
            var jWeatherApiResponse = new JObject
            {
                ["consolidated_weather"] = new JArray
                {
                    new JObject
                    {
                        ["applicable_date"] = "2020-01-01",
                        ["weather_state_name"] = "Snow",
                        ["the_temp"] = -5
                    },
                    new JObject
                    {
                        ["applicable_date"] = "2020-01-02",
                        ["weather_state_name"] = "Fog",
                        ["the_temp"] = 2
                    }
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
            var response = await Client.GetAsync("/api/forecast/blah");

            // Verify
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var forecast = await response.Content.ReadAsAsync<Forecast[]>();
            forecast.Should().BeEquivalentTo(new Forecast("2020-01-01", "Snow", -5), new Forecast("2020-01-02", "Fog", 2));

            actualMessage.Method.Should().Be(HttpMethod.Get);
            actualMessage.RequestUri.Should().Be("http://weather.api/api/location/blah");
        }
    }
}