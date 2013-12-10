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


namespace oAuthInstagram
{
    public class oAuthInstagram
    {
        public AuthenticateSettings AuthenticateSettings { get; set; }
        public SearchSettings SearchSettings { get; set; }

        /// <summary>
        /// The default constructor takes all the settings from the appsettings file
        /// </summary>
        public oAuthInstagram()
        {
            string oAuthUrl = ConfigurationManager.AppSettings["oAuthUrlGram"];
            string accessToken = ConfigurationManager.AppSettings["accessToken"];
            AuthenticateSettings = new AuthenticateSettings
            {
                oAuthUrl = oAuthUrl,
                accessToken = accessToken
            };
        }

        public string GetTrending()
        {
            string instagramSearchFormat = ConfigurationManager.AppSettings["instagramTrendingFormat"];
            var searchJson = string.Empty;

            SearchSettings = new SearchSettings
            {
                TrendingFormat = instagramSearchFormat,
                accessToken = AuthenticateSettings.accessToken,
            };

            //Search utility
            var utility = new Utility();
            searchJson = utility.RequestJson(SearchSettings.trendingInstagramUrl, AuthenticateSettings.accessToken);

            return searchJson;
        }

        public string GetSearch(string searchText)
        {
            string instagramSearchFormat = ConfigurationManager.AppSettings["instagramSearchFormat"];
            string searchQuery = searchText;
            var searchJson = string.Empty;

            SearchSettings = new SearchSettings
            {
                instagramSearchFormat = instagramSearchFormat,
                SearchQuery = searchQuery,
                accessToken = AuthenticateSettings.accessToken,
            };

            //Search utility
            var utility = new Utility();
            searchJson = utility.RequestJson(SearchSettings.SearchUrl, AuthenticateSettings.accessToken);

            return searchJson;
        }

        public string ResendSearch(string searchText, long id)
        {
            string instagramResendSearchFormat = ConfigurationManager.AppSettings["instagramResendSearchFormat"];
            string searchQuery = searchText;
            var searchJson = string.Empty;
            string gId = id.ToString();

            SearchSettings = new SearchSettings
            {
                instagramResendSearchFormat = instagramResendSearchFormat,
                SearchQuery = searchQuery,
                accessToken = AuthenticateSettings.accessToken,
                id = gId
            };

            //Search utility
            var utility = new Utility();
            searchJson = utility.RequestJson(SearchSettings.resendSearchUrl, AuthenticateSettings.accessToken);

            return searchJson;
        }

        public string getMoreInstagram(string searchText, long nextPage)
        {
            string getMoreInstagramFormat = ConfigurationManager.AppSettings["instagramGetMoreFormat"];
            string searchQuery = searchText;
            var searchJson = string.Empty;
            string gId = nextPage.ToString();

            SearchSettings = new SearchSettings
            {
                getMoreInstagramFormat = getMoreInstagramFormat,
                SearchQuery = searchQuery,
                accessToken = AuthenticateSettings.accessToken,
                nextPage = gId
            };

            //Search utility
            var utility = new Utility();
            searchJson = utility.RequestJson(SearchSettings.getMoreInstagramUrl, AuthenticateSettings.accessToken);

            return searchJson;
        }
    }
}
