var http = require('http');
var url = require('url');
var fs = require('fs');
var port = process.env.PORT || 3000;
//var port = 8080;   //uncomment to run local

const MongoClient = require('mongodb').MongoClient;
const connStr = "mongodb+srv://database_user:db123@stock.zrcipph.mongodb.net/?appName=Stock";
    
console.log('hey');
MongoClient.connect(connStr, function(err, dbConn) {
    console.log('connected');
    if(err) {
        console.log('Error connecting to MongoDB: ' + err);
    }
    else {
        var dbo = dbConn.db("Stock");   // equiv to use library
        var collection = dbo.collection("PublicCompanies");
        console.log("Success!");
        db.close();
    }
});

console.log("Server ready");
var server = http.createServer(function (req, res) {
    
    urlObj = url.parse(req.url, true);
    // console.log("The URL is: " + req.url);
    // console.log("The path is: " + urlObj.pathname);

    if (req.url == "/") {
        fs.readFile("home.html", function(err, txt) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            if (err) {
                res.write("Error loading home.html");
            } else {
                res.write(txt);
            }
            res.end();
        });
    }
    else if (urlObj.pathname == "/process") {
        fs.readFile("process.html", function(err, txt) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            if (err) {
                res.write("Error loading process.html");
            } else {
                res.write(txt);
                res.write("Showing search results for '" + urlObj.query.stock + "'");
                res.write("Showing search results for '" + urlObj.query['input-type'] + "'");
            }
            res.end();
        });
    }
    else if (urlObj.pathname == "/styles.css") {
        fs.readFile("styles.css", function(err, txt) {
            if (err) {
                res.writeHead(404);
                res.end("Style not found");
            } else {
                // Browsers REQUIRE 'text/css' to apply styles
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(txt);
            }
        });
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("Page not found");
        res.end();
    }
})
server.listen(port);
