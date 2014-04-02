/**
 * @author zzy
 */

var http = require('http');
var equal = require('assert').equal;

var HttpClient = function(options) {
	this.options = options;
};

HttpClient.prototype.getReq = function(cb) {
	var req = http.request(this.options, function(res) {
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

HttpClient.prototype.postReq = function(post_data, cb) {
	var qs = require("querystring");
	var content = qs.stringify(post_data);
	this.options.headers = {
		'Content-Type' : 'application/x-www-form-urlencoded',
		'Content-Length' : content.length
	};
	
	var req = http.request(this.options, function(res) {
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

	req.write(content);
	req.end();
}

module.exports = HttpClient;