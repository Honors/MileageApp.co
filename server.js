var http = require('http'),
	https = require('https'),
	fs = require('fs'),
	twilio = require('twilio');
	
http.createServer(function(req, res) {
	if( req.url == '/' ) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream(__dirname + '/index.html').pipe(res);
	} else if( req.url.match(/^\/api/) ) {		
		var number = req.url.replace(/^\/api\/subscribe\//, '');
		var accountSid = 'ACa3aa78f43d06f2f74cc50ae4eb464967';
		var authToken = "333d70beaae798cc9ea97fa13b338b2c";
		var client = twilio(accountSid, authToken, 'mneary.info');
		client.sms.messages.create({
		    body: "New Subscriber: "+number,
		    to: "+16144408217",
		    from: "+16143471344"
		}, function(err, message) {
		    // handle resp
		    res.end(JSON.stringify({success: !err, error: err}));
		});
	} else {
		var path = __dirname + req.url;
		fs.stat(path, function(err) {
			if( err ) {
				res.writeHead(404);
				res.end();
			} else {
				fs.createReadStream(path).pipe(res);
			}
		});		
	}
});