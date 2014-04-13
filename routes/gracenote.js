// graceNode api
var https = require("https");

exports.searchArtist = function(req, res)
{
	console.log("graceNode api request : " + req.body.term);
  	var keywords = encodeURIComponent(req.body.term);

	var post_data = '<QUERIES> \
	<LANG>eng</LANG> \
	<AUTH> \
	<CLIENT>15450112-F98DFB0B79644829B6195029A0ACFBD6</CLIENT> \
	<USER>259892980560592564-CE98DEA6E64B31A49D4930A7FDA747A2</USER> \
	</AUTH> \
	<QUERY CMD="ALBUM_SEARCH"> <MODE>SINGLE_BEST_COVER</MODE> \
	<TEXT TYPE="ARTIST">'+keywords+'</TEXT> \
	</QUERY></QUERIES>';



	var options = {
	host: 'c15450112.web.cddbp.net',
	path: '/webapi/xml/1.0/',
	method: 'POST',
	  headers: {
	      'Content-Type': 'application/x-www-form-urlencoded',
	      'Content-Length': post_data.length
	  }
	};

  

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {

    	var parseString = require('xml2js').parseString;

		parseString(str, function (err, result) {
		    console.dir(result);
		    res.set('content-type', 'application/json');
      		res.send(result);
		});
		
    });
  };

	// Set up the request
	var post_req = https.request(options, callback);
	post_req.write(post_data);
	post_req.end();

  	if ( post_req instanceof Error ) {
    // handle the error safely
    	res.set('content-type', 'application/json');
    	res.send({'Error' : post_req});
	}
};