/**
 * Auth: Changjimmy
 * 
 * Date: 2020/07/22
 * 
 * Ref.
 * https://nodejs.org/api/zlib.html
 * https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-read-stream/
 * https://expressjs.com/zh-tw/guide/writing-middleware.html
 */
var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser')
var zlib = require("zlib");
var fs = require("fs");

app.use(bodyParser())//add this before any route or before using req.body


var Logger = function (req, res, next) {
    console.log(JSON.stringify(req.headers));
    console.log(req.body); // this is what you want   
    // console.log(JSON.stringify(req.body));
    next();
};

var requestTime = function (req, res, next) {
    req.requestTime = Date.now();
    next();
};

app.use(Logger);
app.use(requestTime);


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/hello', function (req, res) {
    res.send('Hello World!');
});

app.get('/example.json', function (req, res) {
    var filename = __dirname+req.url;
    console.log(filename)
    //  const rs = createReadStream(`static${req.url}`);
    const rs = fs.createReadStream(filename);
    const gz = zlib.createGzip();
    res.setHeader("content-encoding", "gzip"); // add the header of content-encoding: gzip
    rs.pipe(gz).pipe(res); 
    rs.on("error", (err) => {
        console.log(err);
        res.writeHead(404);
        res.write("Not Found");
    });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("listen prot:3000");
});
