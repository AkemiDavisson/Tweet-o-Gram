using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TweetGramAPI.Controllers.Home
{
    public class ProjectController : Controller
    {
        //
        // GET: /Project/
        public ActionResult Index()
        {
            return View("ApiHack");
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult GrabTrending()
        {
            var twit = new oAuthTwitter.OAuthTwitterWrapper();
            var json = twit.GetTrending();

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult GrabTweets(string request)
        {
            var twit = new oAuthTwitter.OAuthTwitterWrapper();
            var json = twit.GetSearch(request);

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult ResendSearch(string request, long sinceId)
        {
            var twit = new oAuthTwitter.OAuthTwitterWrapper();
            var json = twit.ResendSearch(request, sinceId);

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult getMoreTwitter(string request, long maxId)
        {
            var twit = new oAuthTwitter.OAuthTwitterWrapper();
            var json = twit.getMoreTwitter(request, maxId);

            return Json(json, JsonRequestBehavior.AllowGet);
        }


        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult GrabTrendingInstagram()
        {
            var gram = new oAuthInstagram.oAuthInstagram();
            var json = gram.GetTrending();

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult grabInstagrams(string request)
        {
            var gram = new oAuthInstagram.oAuthInstagram();
            var json = gram.GetSearch(request);

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult resendInstagramSearch(string request, long id)
        {
            var gram = new oAuthInstagram.oAuthInstagram();
            var json = gram.ResendSearch(request, id);

            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult getMoreInstagram(string request, long nextPage)
        {
            var gram = new oAuthInstagram.oAuthInstagram();
            var json = gram.getMoreInstagram(request, nextPage);

            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}
