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