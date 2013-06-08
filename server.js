var http = require('http'),
	https = require('https'),
	fs = require('fs'),
	twilio = require('twilio');
	
var key_store = {};
fs.readFile(__dirname + '/keys.json', function(err, data) {
	// Read keys from external, private file
	var keys = JSON.parse(data);
	key_store.accountSid = keys.accountSid;
	key_store.authToken = keys.authToken;
});	
	
exports.module = http.createServer(function(req, res) {
	if( req.url == '/' ) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream(__dirname + '/index.html').pipe(res);
	} else if( req.url.match(/^\/api/) ) {		
		var number = req.url.replace(/^\/api\/subscribe\//, '');		
		var client = twilio(this.accountSid, this.authToken, 'mneary.info');
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
}.bind(key_store)).listen(8080);