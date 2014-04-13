// var http = require('follow-redirects').http; // 
var http = require("http");
var https = require("https");
var url = require('url');


exports.getJSON = function(req, res)
{
  var options = {
    host: 'en.wikipedia.org',
    path: '/w/api.php?action=opensearch&format=json&search='+req.query.term+'&namespace=0&limit=100&suggest='
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
      res.set('content-type', 'application/json');
      res.send(str);
    });
  }

  var call = http.request(options, callback).end();
  if ( call instanceof Error ) {
    // handle the error safely
      res.set('content-type', 'application/json');
      res.send({'Error' : call});
  }
};

exports.getWikiPage = function(req, res)
{
  var options = {
    host: 'en.wikipedia.org',
    path: '/w/index.php?title=Special%3ASearch&search='+encodeURIComponent(req.query.term)
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      //console.log(str);
      console.log(response.headers);


      // require("jsdom").defaultDocumentFeatures = {
      //     FetchExternalResources: ["script", "img", "css", "frame", "iframe", "link"],
      //     ProcessExternalResources: false
      // };
      // var jsdom = require("jsdom");

      // jsdom.env(
      //   str,
      //   ["http://code.jquery.com/jquery.js"],
      //   function (errors, window) {
      //       //console.log(window.$("body").text());
      //       res.set('content-type', 'text/html');
      //       ;
      //   }
      // );


      var newUrl = response.headers.location;
      res.send(newUrl);
    });
  }

  var call = http.request(options, callback).end();
  if ( call instanceof Error ) {
    // handle the error safely
      res.set('content-type', 'application/json');
      res.send({'Error' : call});
  }

};




exports.searchYoutube = function(req, res)
{
  var options = {
    host: 'www.googleapis.com',
    path: '/youtube/v3/search?part=snippet&maxResults=20&order=viewCount&key=AIzaSyBgz_iSlDmVzMW2dhaNwnV9oFWjDFHDLio&q='+encodeURIComponent(req.body.term)
  };

  callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log(str);
      res.set('content-type', 'application/json');
      res.send(str);
    });
  }

  var call = https.request(options, callback).end();
  call.on('error', function(e) {
    res.set('content-type', 'application/json');
    res.send({'Error' : call});
  });
};

exports.getYoutubeVideos = function(keywords)
{
  var options = {
    host: 'www.googleapis.com',
    path: '/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&key=AIzaSyBgz_iSlDmVzMW2dhaNwnV9oFWjDFHDLio&key='+encodeURIComponent(keywords)
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
      console.log(response.headers);
      res.set('content-type', 'text/plain');
      var newUrl = response.headers.location;
      res.send(newUrl);
    });
  }

  var call = http.request(options, callback).end();
  call.on('error', function(e) {
    res.set('content-type', 'application/json');
    res.send({'Error' : call});
  });

};