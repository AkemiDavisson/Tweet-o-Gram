using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace oAuthTwitter
{
    public class SearchSettings
    {
        public string SearchFormat { get; set; }
        public string SearchQuery { get; set; }
        public string SearchUrl
        {
            get { return string.Format(SearchFormat, SearchQuery); }
        }

        public string ResendSearchFormat { get; set; }
        public string SinceId { get; set; }
        public string ResendSearchUrl
        {
            get { return string.Format(ResendSearchFormat, SearchQuery, SinceId); }
        }


        public string GetMoreTwitterFormat { get; set; }
        public string MaxId { get; set; }
        public string GetMoreTwitterUrl
        {
            get { return string.Format(GetMoreTwitterFormat, SearchQuery, MaxId); }
        }

        public string TrendingFormat { get; set; }
    }
}
