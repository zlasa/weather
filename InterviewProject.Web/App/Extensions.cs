﻿using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace InterviewProject.App
{
    public static class Extensions
    {
        public static async Task<T> ReadAsAsync<T>(this HttpContent content)
        {
            var json = await content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}