// var http = require('follow-redirects').http; // 
var http = require("http");
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

  http.request(options, callback).end();
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

  http.request(options, callback).end();
};