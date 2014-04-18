/**
 * @author zzy
 */

var https = require('https');
var equal = require('assert').equal;

var httpsClient = function(options) {
	this.options = options;
};

httpsClient.prototype.getReq = function(cb) {
	var req = https.request(this.options, function(res) {
		equal(200, res.statusCode);
		res.setEncoding('utf8');
		
		var _data="";
		res.on('data', function(chunk) {
			_data+=chunk;
		});
		
		res.on('end',function(){
			cb(null,JSON.parse(_data));
		});
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		cb(e, null);
	});

	req.end();
}

httpsClient.prototype.postReq = function(post_data, cb) {
	var content = JSON.stringify(post_data);
	this.options.headers = {
		'Content-Type' : 'application/json'
	};
	var req = https.request(this.options, function(res) {
		equal(200, res.statusCode);
		res.setEncoding('utf8');
		
		var _data="";
		res.on('data', function(chunk) {
			_data+=chunk;
		});
		
		res.on('end',function(){
			cb(null,JSON.parse(_data));
		});
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		cb(e, null);
	});
    console.log(content);
	req.write(content);
	req.end();
}

module.exports = httpsClient;