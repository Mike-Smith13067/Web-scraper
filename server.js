//Server package
const express = require('express');
//noSQL database package
const mongoose = require('mongoose');

//Scraping packages
const cheerio = require('cheerio');
const axios = require('axios');

var PORT = process.env.PORT || 8080;
var databaseURL = "news";
var collections = ["articles"];

//Handlebars package and initiation
const exhb = require('express-handlebars');

 const db = require("./models/");

//Initialize Express
const app = express();

// Set request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/news", { useNewUrlParser: true });

//Scrape articles from website and insert into mongo database
app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/section/sports").then(function(response) {
        var $ =cheerio.load(response.data);
        $("article").each(function(i, element) {
            var title = $(element).find("h2").text();
            var summary = $(element).find("p").text();
            var link = $(element).find("a").attr("href");

            console.log(title, link);

            if(title && link) {
                db.Articles.create({
                    title: title,
                    summary: summary,
                    link: link
                },
                function(err, inserted) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(inserted);
                    }
                });
            }
        });
    });

    res.send("Scrape complete");
});


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});