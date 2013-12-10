using System.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace oAuthTwitter
{
    public class OAuthTwitterWrapper
    {
        public AuthenticateSettings AuthenticateSettings { get; set; }
        public SearchSettings SearchSettings { get; set; }

        /// <summary>
        /// The default constructor takes all the settings from the appsettings file
        /// </summary>
        public OAuthTwitterWrapper()
        {
            string oAuthConsumerKey = ConfigurationManager.AppSettings["oAuthConsumerKey"];
            string oAuthConsumerSecret = ConfigurationManager.AppSettings["oAuthConsumerSecret"];
            string oAuthUrl = ConfigurationManager.AppSettings["oAuthUrl"];
            string accessToken = ConfigurationManager.AppSettings["twitterAccessToken"];
            string tokenType = ConfigurationManager.AppSettings["tokenType"];

            AuthenticateSettings = new AuthenticateSettings
            {
                oAuthConsumerKey = oAuthConsumerKey,
                oAuthConsumerSecret = oAuthConsumerSecret,
                oAuthUrl = oAuthUrl,
                accessToken = accessToken,
                tokenType = tokenType
            };
        }

        public string GetTrending()
        {
            string searchFormat = ConfigurationManager.AppSettings["trendingFormat"];
            var searchJson = string.Empty;

            SearchSettings = new SearchSettings
            {
                TrendingFormat = searchFormat
            };

            // Search utility
            var utility = new Utility();
            searchJson = utility.RequestJson(SearchSettings.TrendingFormat, AuthenticateSettings.tokenType, AuthenticateSettings.accessToken);

            return searchJson;
        }

        public string GetSearch(string searchText)
        {
            string searchFormat = ConfigurationManager.AppSettings["searchFormat"];
            string searchQuery = searchText;
            var searchJson = string.Empty;

            SearchSettings = new SearchSettings
            {
                SearchFormat = searchFormat,
                SearchQuery = searchQuery
            };

            //Search Utility
            var utility = new Utility();
            searchJson = utility.RequestJson(SearchSettings.SearchUrl, AuthenticateSettings.tokenType, AuthenticateSettings.accessToken);

            return searchJson;
        }

        public string ResendSearch(string searchText, long sinceId)
        {
            string searchFormat = ConfigurationManager.AppSettings["resendSearchFormat"];
            string searchQuery = searchText;
            string since_id = sinceId.ToString();
            var searchJson = string.Empty;

            SearchSettings = new SearchSettings
            {
                ResendSearchFormat = searchFormat,
                SearchQuery = searchQuery,
                SinceId = since_id,
            };

            //Search Utility
            var utility = new Utility();
            searchJson = utility.RequestJson(SearchSettings.ResendSearchUrl, AuthenticateSettings.tokenType, AuthenticateSettings.accessToken);

            return searchJson;
        }

        public string getMoreTwitter(string searchText, long maxId)
        {
            string searchFormat = ConfigurationManager.AppSettings["getMoreFormat"];
            string searchQuery = searchText;
            string id = maxId.ToString();
            var searchJson = string.Empty;

            SearchSettings = new SearchSettings
            {
                GetMoreTwitterFormat = searchFormat,
                SearchQuery = searchQuery,
                MaxId = id
            };

            //Search Utility
            var utility = new Utility();
            searchJson = utility.RequestJson(SearchSettings.GetMoreTwitterUrl, AuthenticateSettings.tokenType, AuthenticateSettings.accessToken);

            return searchJson;
        }
    }
}
