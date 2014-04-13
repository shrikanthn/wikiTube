// var http = require('follow-redirects').http; // 
var http = require("http");
var https = require("https");
var url = require('url');
var querystring = require('querystring');


exports.getJSON = function(req, res)
{
  console.log('fetching wiki keyword options');
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
      console.log('completed keyword fetch');
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
    path: '/w/index.php?title=Special%3ASearch&redirect=yes&search='+encodeURIComponent(req.query.term)
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
      //};
      //var jsdom = require("jsdom");

       /*jsdom.env(
         str,
         ["http://code.jquery.com/jquery.js"],
         function (errors, window) {
              console.log("hello");
             //console.log(window.$("body").text());
      //       res.set('content-type', 'text/html');
      //       ;
         }
       );*/

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
    };

  var call = https.request(options, callback);
  call.on('error', function(e) {
    res.set('content-type', 'application/json');
    res.send({'Error' : call});
  });
  call.end();

};

var getYoutubeVideos = function(keywords, res)
{
  var options = {
    host: 'www.googleapis.com',
    path: '/youtube/v3/search?part=snippet&maxResults=30&order=viewCount&key=AIzaSyBgz_iSlDmVzMW2dhaNwnV9oFWjDFHDLio&q='+encodeURIComponent(keywords)
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      res.set("Content-Type", "application/json");
      res.send(JSON.parse(str));
    });  
  };

  var call = https.request(options, callback);
  call.on('error', function(e) {
    res.set('content-type', 'application/json');
    res.send({'Error' : call});
  });
  call.end();

};

exports.getEntities = function(req, res)
{

    var data = querystring.stringify({
        url : req.query.url,
        apikey: "ae4799220327659bbe7444c8e61155d32f47e06a",
        outputMode : "json",
        maxRetrieve : "20"
      });

    var options = {
        host: 'access.alchemyapi.com',
        path: '/calls/url/URLGetRankedNamedEntities',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length
        }
      }

    callback = function(response) {  
        var str1 = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
          str1 += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          console.log("entity extraction ends");
          str1 = JSON.parse(str1);
          var entities = [];
          for(var i=0; i<str1.entities.length; i++)
          {
              entities.push(str1.entities[i].text);
              if(i == 2)
                break;
          }

          console.log(entities);
          getYoutubeVideos(entities.join(" "), res);
        });  
      };  

      var call = http.request(options, callback);
      call.write(data);
      call.end();
      call.on('error', function(){
        console.error("Error while fetching entities");
        res.set("Content-Type", "application/json");
        res.send({"Error" :  call});
      });

    /*var options = {
      host: 'en.wikipedia.org',
      path: '/w/api.php?action=mobileview&format=json&redirect=no&sections=0&prop=text&sectionprop=toclevel|level|line|number|index|fromtitle|anchor&page='+encodeURIComponent(req.query.term)
    };
    var youtubevideos = {};
    
    console.log('entitity fetch begin');

    callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {

      console.log('came back from wiki');

      str = JSON.parse(str);
      str = str.mobileview.sections[0].text.replace(/<\/?[^>]+(>|$)/g, "");
  
      console.log(str);

      var data = querystring.stringify({
        url : "http://en.wikipedia.org/wiki/Tool_(band)",
        apikey: "ae4799220327659bbe7444c8e61155d32f47e06a",
        outputMode : "json",
        maxRetrieve : "20"
      });

      var options1 = {
        host: 'access.alchemyapi.com',
        path: '/calls/url/URLGetRankedNamedEntities',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length
        }
      }

      callback1 = function(response) {  
        var str1 = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
          str1 += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          console.log("entity extraction ends");
          str1 = JSON.parse(str1);
          var entities = [];
          for(var i=0; i<str1.entities.length; i++)
          {
              entities.push(str1.entities[i].text);
              if(i == 2)
                break;
          }

          console.log(entities);
          getYoutubeVideos(entities.join(" "), res);
        });  
      };

      var call = http.request(options1, callback1);
      call.write(data);
      call.end();
      call.on('error', function(){
        console.error("Error while fetching entities");
        res.set("Content-Type", "application/json");
        res.send({"Error" :  call});
      });

      console.log('end of response');

    });
    
    console.log('end of response');
      var call2 = http.request(options, callback);
      call2.end();
      call2.on('error', function(){
          console.error("Error while fetching entities");
          res.set("Content-Type", "application/json");
          res.send({"Error" :  call2});
      });

  };*/
}

