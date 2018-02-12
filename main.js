/** 
* node main.js 12345
*/
const express = require('express')
const app = express()
const util = require('util')
var request = require('request')

app.get('/*', function (req, res) {
    const url = req.url.startsWith('/') ?  req.url.substring(1) : req.url;
    console.log('Req: ' + url);
    request(url, function (error, response, body) {
        if(response && response.statusCode == 200) {
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
    console.log('Proxy bouncer listening on port ' + port);
});