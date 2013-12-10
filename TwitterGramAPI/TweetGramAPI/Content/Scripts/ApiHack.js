
$(document).ready(function () {

    //load trending hashtags
    trendingManager.grabTrending();
    trendingManager.grabTrendingInstagram();

    //set click events
    $("#searchBtn").click(function () {
        validateSearch.validate();
    });

    $('#search').keydown(function (e) {
        if (e.keyCode == 13) {
            validateSearch.validate();
        }
    });

    $("#hashtag").click(function () {
        $('#search').val('hashtag');
        validateSearch.validate();
    });

    $('#paginationBtn').click(function () {
        getMoreResults.paginate();
    });

});

//twitter variables
var lastSearch = null;
var tId = null;
var sinceId = null;
//instagram variables
var lastSearchGram = null;
var gId = null;
var nextPage = null;

validateSearch = {
    validate: function () {
        //search variables
        var s = null;
        var r = null;
        var request = null;
        var search = $('#search').val();
        var whiteSpaceCheck = $.trim(search);

        var error = $('#error');

        //check null value
        if (search == "" || whiteSpaceCheck == "") {

            error.text('Please enter a search first!');
            error.removeClass('hidden');
        }
        else if (error.hasClass('hidden') != true) {
            error.addClass('hidden');
        }

        //if search contains # or @ and removes it (will cause error in Twiter API if included)
        //split/trim search
        if (search.indexOf("#") === -1 && search.indexOf("@") === -1) {
            r = search.split(" ").join().replace(/\,/g, '');
            request = $.trim(search);
        }
        else if (search.indexOf("@") >= 0) {
            s = search.replace(/\@/g, '');
            s.split(" ").join().replace(/\,/g, '');
            request = $.trim(s);

        }
        else if (search.indexOf("#") >= 0) {
            s = search.replace(/\#/g, '');
            s.split(" ").join().replace(/\,/g, '');
            request = $.trim(s);
        }


        //check if search is repeated will resend search with appropriate 
        //indexing parameters
        if (lastSearch == request) {
            twitterAPIManager.resendSearch(request, sinceId, tId);
        }
        else {
            twitterAPIManager.grabTweets(request);
        }

        if (lastSearchGram == request) {
            instagramAPIManager.resendSearchGram(request, gId);
        }
        else {
            instagramAPIManager.grabInstagrams(request);
        }

        lastSearchGram = request;
        lastSearch = request;

        var searchDiv = $('.searchingTag');

        if (searchDiv.hasClass('hidden')) {

            searchDiv.removeClass('hidden');
            searchDiv.html("#" + lastSearch).hide().fadeIn('slow');
        }
        else {
            searchDiv.html("#" + lastSearch).hide().fadeIn('slow');;
        }

    }
};

getMoreResults = {
    paginate: function () {

        //check nulls
        if (lastSearch == null || lastSearchGram == null) {
            var error = $('#error');
            error.text('Please search for a hashtag first!');
            error.removeClass('hidden');
        }
        else {
            paginationManager.getMoreInstagram(lastSearchGram, nextPage);
            paginationManager.getMoreTwitter(lastSearch, tId)
        }

    }
};

var trendingManager = (function () {

    function grabTrending() {
        $.ajax({
            type: "GET",
            url: "/Project/GrabTrending",
            dataType: "json",
            data: {},
            contentType: "application/json; charset=utf-8",

            success: displayTrends,
            error: errorHandler,
            complete: completeHandler
        });
    };

    function grabTrendingInstagram() {
        $.ajax({
            type: "GET",
            url: "/Project/GrabTrendingInstagram",
            dataType: "json",
            data: {},
            contentType: "application/json; charset=utf-8",

            success: displayTrendsInstagram,
            error: errorHandler,
            complete: completeHandler
        });
    };

    var displayTrends = function (trend_data) {

        console.log("ajax call successful. DisplayTrends-Twitter");

        if (trend_data != null) {

            var data = JSON.parse(trend_data);

            var trends = data[0].trends;

            // add the trends to the DOM
            $.each(trends, function (index, value) {

                var trend = trends[index];
                var hashResult = $.inArray('#', trend.name);
                if (hashResult != -1) {
                    $(".trendingContainer").append(
                        "<a href=\"#\" class=\"trend\">"
                       + trend.name + "<a/>");
                }
            });

        }
    };

    var displayTrendsInstagram = function (trend_data) {

        console.log("ajax call successful. DisplayTrends-Instagram");

        if (trend_data != null) {

            var data = JSON.parse(trend_data);
            var resultObj = data.data;

            $.each(resultObj, function (index, value) {

                var t = resultObj[index];

                //check if result contains tags[]
                if ((t.tags.length >= 1) == true) {

                    //only want to grab 1 tag from each result,
                    //get random tag from each result
                    var count = t.tags.length - 1;
                    var min = 0;
                    var random = getRandomInt(min, count);

                    function getRandomInt(min, count) {
                        return Math.floor(Math.random() * (count - min + 1)) + min;
                    }

                    var tag = t.tags[random]

                    if (tag != null) {
                        $(".trendingContainer").append(
                        "<a href=\"#\" class=\"trend\">#"
                        + tag + "<a/>");
                    }
                }
            });
            trendClickEvent();
        }
    };

    // called upon failure of the ajax call.  handles the error
    var errorHandler = function (req, status, err) {

        console.log('ajax error: ', status, err);
    };

    // called when the request finishes (after success and error callbacks are executed). 
    var completeHandler = function (hxr, textStatus) {
        console.log("complete called with status: " + textStatus);
    };

    //event listener to search if trend links are clicked
    var trendClickEvent = function () {
        $('.trendingContainer').on('click', '.trend', function () {
            trendSearch(this);
        })
    };

    //search trend
    function trendSearch(data) {
        //grab text of trending tag
        var searchQuery = (data).text;

        //set search value to text and run search
        if (searchQuery != null) {
            var search = $('#search').val(searchQuery);
            validateSearch.validate();
        }
        else {
            var error = $('#error');
            error.text('<p>There was a problem retrieving this tag, please try again!</p>');
            error.removeClass('hidden');
        }

    };

    return {
        grabTrending: grabTrending,
        grabTrendingInstagram: grabTrendingInstagram
    }
})();

var twitterAPIManager = (function () {

    //first search AJAX
    function grabTweets(request) {
        $.ajax({
            type: "GET",
            url: "/Project/GrabTweets",
            dataType: "json",
            data: { request: request },
            contentType: "application/json; charset=utf-8",

            success: successHandler,
            error: errorHandler,
            complete: completeHandler
        });
    };

    //second search AJAX
    function resendSearch(request, sinceId) {
        $.ajax({
            type: "GET",
            url: "/Project/ResendSearch",
            dataType: "json",
            data: {
                request: request,
                sinceId: sinceId
            },
            contentType: "application/json; charset=utf-8",

            success: successHandler,
            error: errorHandler,
            complete: completeHandler
        });
    };

    // called upon successful ajax call
    var successHandler = function (twitter_data) {

        console.log("ajax call successful. TwitterAPI Manager");

        var data = JSON.parse(twitter_data);
        var results = data.statuses;

        //if no additional results to display notify user
        if (results.length == 1) {

            //remove last search
            $(".tweet").hide('slow', function () { $(this).remove() });

            //add message
            $("#twitterList").hide().append(
                    "<div class=\"tweet\">"
                    + "<h3 class=\"username\"> No more results for this search, try another search!"
                    + "</h3>"
                    + "</br>"
                    + "</div>"
                    + "</hr>").fadeIn(1500);

            tId = 0;
            sinceId = 0;
        }
            //if several results
        else if (results.length > 0) {

            var resultLength = results.length - 1;

            //find (highest id in results to set since_id parameter)
            var highest = 0;
            i = 0;
            while (i < resultLength) {
                if (results[i].id > highest) {
                    highest = results[i].id;
                }

                i += 1;
            }

            sinceId = highest;

            //calculate lowest id received in results (max_id parameter)
            var lowest = 0;
            p = 0;
            while (p < resultLength) {
                if (results[p].id < highest) {
                    highest = results[p].id;
                }

                p += 1;
            }

            lowest = highest;
            tId = lowest;

            //remove last search
            $(".tweet").hide('slow', function () { $(this).remove() });

            // add the tweets to the DOM
            $.each(results, function (index, value) {
                var result = results[index];

                $("#twitterList").append(
                    "<div class=\"tweet\">"
                    + "<h3 class=\"username\">"
                    + "<a href=\"http://www.twitter.com/" + result.user.screen_name + "\">"
                    + "<img class=\"avatar\" src=\"" + result.user.profile_image_url + "\">@"
                    + "</a>"
                    + "<a href=\"http://www.twitter.com/"
                    + result.user.screen_name + "\">" + result.user.screen_name
                    + "</a>"
                    + "</h3>"
                    + "</br>"
                    + "<h5>" + twttr.txt.autoLink(result.text) + "</h5>"
                    + "</br>"
                    + media(result)
                    + "</div>"
                    + "</hr>").delay('2000').fadeIn('slow')

                function media(result) {
                    if (result.entities.media != null) {
                        return "<img class=\"tweetImg\" src=\"" + result.entities.media[0].media_url + "\" width=\""
                        + result.entities.media[0].sizes.small.w + "\" height=\""
                        + result.entities.media[0].sizes.small.h + "\" />"
                    }
                    else {
                        var result = "";
                        return result;
                    }
                };

                // Will stop running after 12, set this is API link but double check here.
                if (index === 11) {
                    return false;
                }

            });

            $("#twitterList").fadeIn(1500);

        }
            //if no results
        else {
            //remove last search
            $(".tweet").hide('slow', function () { $(this).remove() });

            //add message
            $("#twitterList").hide().append(
                    "<div class=\"tweet\">"
                    + "<h3 class=\"username\"> No results found, try another search!"
                    + "</h3>"
                    + "</br>"
                    + "</div>"
                    + "</hr>").fadeIn(1500);

            tId = 0;
            sinceId = 0;
        }

        //reset search box
        $('#search').val('');
    };

    // called upon failure of the ajax call.  handles the error
    var errorHandler = function (req, status, err) {

        console.log('ajax error: ', status, err);
    };

    // called when the request finishes (after success and error callbacks are executed). 
    var completeHandler = function (hxr, textStatus) {
        console.log("complete called with status: " + textStatus);
    };

    return {
        grabTweets: grabTweets,
        resendSearch: resendSearch
    }
})();

var instagramAPIManager = (function () {

    function grabInstagrams(request) {

        $.ajax({
            dataType: "json",
            url: "/Project/grabInstagrams",
            data: {
                request: request
            },
            success: onDataLoaded,
            error: errorHandler,
            complete: completeHandler
        });
    };

    function resendSearchGram(request, gId) {

        $.ajax({
            dataType: "json",
            url: "/Project/resendInstagramSearch",
            data: {
                request: request,
                id: gId
            },
            success: onDataLoaded,
            error: errorHandler,
            complete: completeHandler
        });
    };

    function onDataLoaded(instagram_data) {

        console.log("ajax call successful. InstagramAPI Manager");

        var data = JSON.parse(instagram_data);

        if (data.meta.code == 200) {

            var photos = data.data;

            if (photos.length > 0) {

                //set minId for repeated search
                if (data.pagination.min_tag_id != null) {
                    gId = data.pagination.min_tag_id
                }
                else {
                    gId = 0;
                }
                //set maxId for pagination
                if (data.pagination.next_max_tag_id != null) {
                    nextPage = data.pagination.next_max_tag_id;
                }
                else {
                    nextPage = null;
                }


                //remove last search
                $(".instagram").hide('slow', function () { $(this).remove() });

                for (var index in photos) {
                    var photo = photos[index];
                    $('#instagramList').append("<div class=\"instagram\">"
                    + "<h3 class=\"username\">"
                    + "<a href=\"http://instagram.com/" + photo.user.username + "\">"
                      + "<img class=\"gramAvatar\" src=\"" + photo.user.profile_picture + "\"/>"
                      + "</a>@"
                    + "<a href=\"http://instagram.com/" + photo.user.username + "\">"
                    + photo.user.username + "</a>"
                    + "</h3>"
                    + "</br>"
                    + captionResult(photo)
                    + "</br>"
                    + "<a href=\"" + photo.link + "\">"
                    + "<img class=\"gramImg\" src=\"" + photo.images.low_resolution.url + "\" />"
                    + "</a>"
                    + "</div>"
                    + "</hr>").delay('2000').fadeIn(1500)

                    function captionResult(photo) {
                        if (photo.caption != null) {
                            return "<h5>" + twttr.txt.autoLink(photo.caption.text) + "</h5>";
                        }
                        else {
                            var result = "<h5></h5>";
                            return result;
                        }

                    };
                };
            }
            else if (photos.length == 0) {
                //remove last search
                $(".instagram").hide('slow', function () { $(this).remove() });

                $("#instagramList").hide().append(
                    "<div class=\"instagram\">"
                    + "<h3 class=\"username\"> No more results for this search, try another search!"
                    + "</h3>"
                    + "</br>"
                    + "</div>"
                    + "</hr>").fadeIn(1500);

                gId = 0;
            }

            $("#instagramList").fadeIn(1500);
        };

        //reset search box
        $('#search').val('');
    };

    // called upon failure of the ajax call.  handles the error
    var errorHandler = function (req, status, err) {

        console.log('ajax error: ', status, err);
    };

    // called when the request finishes (after success and error callbacks are executed). 
    var completeHandler = function (hxr, textStatus) {
        console.log("complete called with status: " + textStatus);
    };

    return {
        grabInstagrams: grabInstagrams,
        resendSearchGram: resendSearchGram
    }

})();

var paginationManager = (function () {

    function getMoreInstagram(request, nextPage) {

        //if no next results show message
        if (nextPage == "undefined" || nextPage == null) {
            //remove last search
            $(".instagram").hide('slow', function () { $(this).remove() });
            $("#instagramList").hide();

            $("#instagramList").hide().append(
                "<div class=\"instagram\">"
                + "<h3 class=\"username\"> No more results for this search, try another search!"
                + "</h3>"
                + "</br>"
                + "</div>"
                + "</hr>").fadeIn(1500);

            gId = 0;
            nextPage = 0;
        }
            //pagination ajax call
        else {
            $.ajax({
                dataType: "json",
                url: "/Project/getMoreInstagram",
                data: {
                    request: request,
                    nextPage: nextPage
                },
                success: onGetMoreInstagram,
                error: errorHandler,
                complete: completeHandler
            });
        }

    };

    function getMoreTwitter(request, tId) {
        //if no next results show message
        if (tId == null) {
            //remove last search
            $(".tweet").hide('slow', function () { $(this).remove() });

            $("#twitterList").hide().append(
                    "<div class=\"tweet\">"
                    + "<h3 class=\"username\"> No more results for this search, try another search!"
                    + "</h3>"
                    + "</br>"
                    + "</div>"
                    + "</hr>").fadeIn(1500);

            tId = 0;
            sinceId = 0;
        }
            //pagination ajax call
        else {
            $.ajax({
                dataType: "json",
                url: "/Project/getMoreTwitter",
                data: {
                    request: request,
                    maxId: tId
                },
                success: onGetMoreTwitter,
                error: errorHandler,
                complete: completeHandler
            });
        }
    };

    //getMoreInstagram success handler
    function onGetMoreInstagram(instagram_data) {
        console.log("ajax call successful. Pagination-Instagram");

        var data = JSON.parse(instagram_data);

        if (data.meta.code == 200) {

            var photos = data.data;

            if (photos.length > 0) {

                //set the next set of results by id.
                if (data.pagination.next_max_tag_id != null) {
                    nextPage = data.pagination.next_max_tag_id;
                }
                else {
                    nextPage = null;
                }

                //remove last search
                $(".instagram").hide('slow', function () { $(this).remove() });

                for (var index in photos) {
                    var photo = photos[index];
                    $('#instagramList').append("<div class=\"instagram\">"
                    + "<h3 class=\"username\">"
                    + "<a href=\"http://instagram.com/" + photo.user.username + "\">"
                      + "<img class=\"gramAvatar\" src=\"" + photo.user.profile_picture + "\"/>"
                      + "</a>@"
                    + "<a href=\"http://instagram.com/" + photo.user.username + "\">"
                    + photo.user.username + "</a>"
                    + "</h3>"
                    + "</br>"
                    + captionResult(photo)
                    + "</br>"
                    + "<a href=\"" + photo.link + "\">"
                    + "<img class=\"gramImg\" src=\"" + photo.images.low_resolution.url + "\" />"
                    + "</a>"
                    + "</div>"
                    + "</hr>").delay('2000').fadeIn('slow')

                    function captionResult(photo) {
                        if (photo.caption != null) {
                            return "<h5>" + twttr.txt.autoLink(photo.caption.text) + "</h5>";
                        }
                        else {
                            var result = "<h5></h5>";
                            return result;
                        }

                    };
                };

            }
            else if (photos.length == 0) {
                //remove last search
                $(".instagram").hide('slow', function () { $(this).remove() });
                $("#instagramList").hide();

                $("#instagramList").hide().append(
                    "<div class=\"instagram\">"
                    + "<h3 class=\"username\"> No more results for this search, try another search!"
                    + "</h3>"
                    + "</br>"
                    + "</div>"
                    + "</hr>").fadeIn(1500);

                gId = 0;
            }
        };

        //reset search box
        $('#search').val('');
    };

    //getMoreTwitter success handler
    function onGetMoreTwitter(twitter_data) {

        console.log("ajax call successful. Pagination-Twitter");

        var data = JSON.parse(twitter_data);
        var results = data.statuses;

        //if no additional results to display notify user
        if (results.length == 1) {

            //remove last search
            $(".tweet").hide('slow', function () { $(this).remove() });

            $("#twitterList").hide().append(
                    "<div class=\"tweet\">"
                    + "<h3 class=\"username\"> No more results for this search, try another search!"
                    + "</h3>"
                    + "</br>"
                    + "</div>"
                    + "</hr>").fadeIn(1500);

            tId = 0;
            sinceId = 0;
        }

            //if several results
        else if (results.length > 0) {
            var resultLength = results.length - 1;

            //find (highest id in results to set since_id parameter
            var highest = 0;
            i = 0;
            while (i < resultLength) {
                if (results[i].id > highest) {
                    highest = results[i].id;
                }

                i += 1;
            }

            sinceId = highest;

            //calculate lowest id received in results (max_id parameter)
            var lowest = 0;
            p = 0;
            while (p < resultLength) {
                if (results[p].id < highest) {
                    highest = results[p].id;
                }

                p += 1;
            }

            lowest = highest;
            tId = lowest;

            //remove last search
            $(".tweet").hide('slow', function () { $(this).remove() });

            // add the tweets to the DOM
            $.each(results, function (index, value) {
                var result = results[index];

                $("#twitterList").append(
                    "<div class=\"tweet\">"
                    + "<h3 class=\"username\">"
                    + "<a href=\"http://www.twitter.com/" + result.user.screen_name + "\">"
                    + "<img class=\"avatar\" src=\"" + result.user.profile_image_url + "\">@"
                    + "</a>"
                    + "<a href=\"http://www.twitter.com/"
                    + result.user.screen_name + "\">" + result.user.screen_name
                    + "</a>"
                    + "</h3>"
                    + "</br>"
                    + "<h5>" + twttr.txt.autoLink(result.text) + "</h5>"
                    + "</br>"
                    + media(result)
                    + "</div>"
                    + "</hr>").delay('2000').fadeIn('slow')

                function media(result) {
                    if (result.entities.media != null) {
                        return "<img class=\"tweetImg\" src=\"" + result.entities.media[0].media_url + "\" width=\""
                        + result.entities.media[0].sizes.small.w + "\" height=\""
                        + result.entities.media[0].sizes.small.h + "\" />"
                    }
                    else {
                        var result = "";
                        return result;
                    }

                    // Will stop running after 12, set this is API link but double check here.
                    if (index === 11) {
                        return false;
                    }
                };
            });

        }
            //if no results
        else {

            //remove last search
            $(".tweet").hide('slow', function () { $(this).remove() });

            //add message
            $("#twitterList").hide().append(
                    "<div class=\"tweet\">"
                    + "<h3 class=\"username\"> No results found, try another search!"
                    + "</h3>"
                    + "</br>"
                    + "</div>"
                    + "</hr>").fadeIn(1500);

            tId = 0;
            sinceId = 0;
        }

        //reset search box
        $('#search').val('');
    };

    // called upon failure of the ajax call.  handles the error
    var errorHandler = function (req, status, err) {

        console.log('ajax error: ', status, err);
    };

    // called when the request finishes (after success and error callbacks are executed). 
    var completeHandler = function (hxr, textStatus) {
        console.log("complete called with status: " + textStatus);
    };

    return {
        getMoreInstagram: getMoreInstagram,
        getMoreTwitter: getMoreTwitter
    }
}());
