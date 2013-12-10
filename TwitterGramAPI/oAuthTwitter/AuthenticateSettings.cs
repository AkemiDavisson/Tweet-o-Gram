using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace oAuthTwitter
{
    public class AuthenticateSettings
    {
        public string oAuthConsumerKey { get; set; }
        public string oAuthConsumerSecret { get; set; }
        public string oAuthUrl { get; set; }
        public string accessToken { get; set; }
        public string tokenType { get; set; }
    }
}
