using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace oAuthInstagram
{
    public class SearchSettings
    {
        public string accessToken { get; set; }

        public string instagramSearchFormat { get; set; }
        public string SearchQuery { get; set; }
        public string SearchUrl
        {
            get { return string.Format(instagramSearchFormat, SearchQuery, accessToken); }
        }

        public string instagramResendSearchFormat { get; set; }
        public string id { get; set; }
        public string resendSearchUrl
        {
            get { return string.Format(instagramResendSearchFormat, SearchQuery, accessToken, id); }
        }

        public string getMoreInstagramFormat { get; set; }
        public string nextPage { get; set; }
        public string getMoreInstagramUrl
        {
            get { return string.Format(getMoreInstagramFormat, SearchQuery, accessToken, nextPage); }
        }

        public string TrendingFormat { get; set; }
        public string trendingInstagramUrl
        {
            get { return string.Format(TrendingFormat, accessToken); }
        }

    }
}
