const fs = require('fs');
const readline = require('readline');

//
const MongoClient = require("mongodb").MongoClient;
const connStr = "mongodb+srv://database_user:db123@stock.zrcipph.mongodb.net/?appName=Stock";

MongoClient.connect(connStr, function(err, dbconn) {
    // Catch any errors in connecting
    if (err) {
        console.log("Error connecting to MongoDB: " + err);
    }
    // Everything has gone well so far
    else {
        var dbo = dbconn.db("Stock"); // Use this library
        var coll = dbo.collection("PublicCompanies"); // Find this specific collection

        // Read the data from companies.csv line by line
        const rl = readline.createInterface({
            input: fs.createReadStream("companies-1.csv"), // Assign the csv file
        }); // End of createInterface

        // Get each line, keeping track of the line number
        line_count = 0;
        rl.on("line", (line) => {
            line_count++;
            // The first line has all of the field titles, no actual data
            if (line_count != 1) {
                const columns = line.split(","); // Split it by the commas
                // Convert data to proper format
                var newCompany = {"Company": columns[0],
                                "Ticker": columns[1],
                                "Price": columns[2]};
                // Insert into the PublicCompanies databse
                coll.insertOne(newCompany, function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // Log success message
                    console.log("Success! Inserting new data: " + JSON.stringify(newCompany));
                });
            } // End of if statement
        }); // End of on

        // Close the database
        db.close();
    } // End of else
}); // End of MongoDB connect