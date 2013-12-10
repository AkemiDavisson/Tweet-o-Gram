using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace oAuthTwitter
{
    class Utility
    {
        public string RequestJson(string apiUrl, string tokenType, string accessToken)
        {
            var json = string.Empty;
            HttpWebRequest apiRequest = (HttpWebRequest)WebRequest.Create(apiUrl);
            var timelineHeaderFormat = "{0} {1}";
            apiRequest.Headers.Add("Authorization",
                                        string.Format(timelineHeaderFormat, tokenType,
                                                      accessToken));
            apiRequest.Method = "Get";
            WebResponse timeLineResponse = apiRequest.GetResponse();

            using (timeLineResponse)
            {
                using (var reader = new StreamReader(timeLineResponse.GetResponseStream()))
                {
                    json = reader.ReadToEnd();
                }
            }
            return json;
        }
    }
}
