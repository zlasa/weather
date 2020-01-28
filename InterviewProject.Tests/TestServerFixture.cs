using System;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

namespace InterviewProject.Tests
{
    public class TestServerFixture : IDisposable
    {
        private readonly WebApplicationFactory<Startup> _webApplicationFactory;

        protected HttpClient Client;

        public TestServerFixture()
        {
            _webApplicationFactory = new WebApplicationFactory<Startup>().WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(ConfigureTestServices);
            });

            Client = _webApplicationFactory.CreateClient();
        }

        public void Dispose()
        {
            _webApplicationFactory?.Dispose();
        }

        protected virtual void ConfigureTestServices(IServiceCollection service)
        {
        }
    }
}