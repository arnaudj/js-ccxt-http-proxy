/** 
* Usage: node main.js 12345
*
* A simple app layer http(s) request proxy service.
* (1) In: clients queries (GET/POST) to http://localhost:$port/someAddressToContact (with someAddressToContact an http(s)://www.mysite/uriHere)
* (2) Out: http(s) network call is done locally, via system proxy if any. Reply is then returned to original caller as a reply to (1).
*/
const express = require('express')
const app = express()
const util = require('util')
var request = require('request')
var process = require('process')
var rawBodyParser = require('raw-body-parser');

app.use(rawBodyParser());

app.get('/*', function (req, res) {
    const url = req.url.startsWith('/') ? req.url.substring(1) : req.url;
    console.log('* GET: ' + url);
    request(url, function (error, response, body) {
        if (response && response.statusCode == 200) {
            res.send(body);
        }
        else {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
            res.statusCode = response && response.statusCode;
            res.send(error);
        }
    });
});

app.post('/*', function (req, res) {
    const url = req.url.startsWith('/') ? req.url.substring(1) : req.url;
    let body = req.rawBody.toString('utf8');

    console.log('* POST: ' + url);
    console.log('   headers: ' + JSON.stringify(req.headers));
    console.log('   body: ' + body);

    request({
        headers: {
            'Content-Length': body.length,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        uri: url,
        body: body,
        method: 'POST'
    }, function (error, response, body) {
        if (response && response.statusCode == 200) {
            console.log('200 OK:', error);
            res.send(body);
        }
        else {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
            res.statusCode = response && response.statusCode;
            res.send(error);
        }
    });
});

const port = process.argv[2] || 3000;
app.listen(port, 'localhost', function () {
    console.log('Proxy bouncer listening on port ' + port + ' with pid ' + process.pid);
});