var http = require('http');
var url = require('url');
var fs = require('fs');
var port = process.env.PORT || 3000;
// var port = 8080;   // uncomment to run local

const MongoClient = require('mongodb').MongoClient;
const connStr = "mongodb+srv://database_user:db123@stock.zrcipph.mongodb.net/?appName=Stock";


// console.log("Server ready");

// Create the server
var server = http.createServer(function (req, res) {
    
    // Parse the url to get the form inputs
    urlObj = url.parse(req.url, true);

    // Load the home page
    if (req.url == "/") {
        fs.readFile("home.html", function(err, txt) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            // Catch any errors
            if (err) {
                res.write("Error loading home.html");
            } else {
                res.write(txt);
            }
            res.end();
        });
    }
    // Load the process page
    else if (urlObj.pathname == "/process") {
        fs.readFile("process.html", function(err, txt) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            // Catch any errors
            if (err) {
                res.write("Error loading process.html");
            }
            else {
                res.write(txt);
                // Build the query according to the inputs of the form
                the_query = {};
                // Search by ticker symbol
                if (urlObj.query['input-type'] == "ticker-symbol") {
                    the_query = {"Ticker": urlObj.query.stock};
                    res.write("Showing search results for the ticker '" + urlObj.query.stock + "'<br>");
                }
                // Search by company name
                else {
                    the_query = {"Company": urlObj.query.stock};
                    res.write("Showing search results for the company'" + urlObj.query.stock + "'<br>");
                }

                // Connect to MongoDB Stock->PublicCompanies collection
                MongoClient.connect(connStr, function(err, dbConn) {
                    // Catch any errors in connecting
                    if(err) {
                        console.log('Error connecting to MongoDB: ' + err);
                    }
                    // Everything has gone well so far
                    else {
                        var dbo = dbConn.db("Stock"); // use this library
                        var stock = dbo.collection("PublicCompanies"); // find this specific collection
                        
                        // Query the collection with the query we extracted
                        stock.find(the_query).toArray(function(err, items) {
                            // Catch any errors in querying
                            if (err) {
                                console.log("Error with querying MongoDB: " + err);
                            }
                            // Display each result and log it to the console
                            else {
                                res.write("<hr>");
                                console.log("Searching for " + JSON.stringify(the_query));
                                for (i = 0; i < items.length; i++) {
                                    console.log(items[i].Company + " " + items[i].Ticker + " $" + items[i].Price);
                                    res.write("<div class='result-container'>");
                                    res.write("<div class='company-info'><h3>" + items[i].Company + "</h3><div class='company-ticker'>" + items[i].Ticker + "</div></div> $" + items[i].Price);
                                    res.write("</div><br><hr>");
                                }
                                res.write("</div></div></body></html>");
                                res.end();
                            }
                        }); // End of find
                        
                        // Close the databse
                        db.close();
                    } // End of else
                }); // End of mongo connect
            }
        });
    }
    // For loading my styles!
    else if (urlObj.pathname == "/styles.css") {
        fs.readFile("styles.css", function(err, txt) {
            if (err) {
                res.writeHead(404);
                res.end("Style not found");
            } else {
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(txt);
            }
        });
    } // End of style loading

    // In all other cases, the page is not found
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("Page not found");
        res.end();
    }
});

server.listen(port); // Listen at this port
