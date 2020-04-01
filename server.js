//Server package
const express = require('express');
//noSQL database package
const mongoose = require('mongoose');
const logger = require("morgan");

//Scraping packages
const cheerio = require('cheerio');
const axios = require('axios');

var PORT = process.env.PORT || 8080;
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";
mongoose.connect(MONGODB_URI);
var databaseURL = "news";
var collections = ["articles"];

//Handlebars package and initiation
const exhb = require('express-handlebars');

const db = require("./models/");

//Initialize Express
const app = express();

// Use morgan logger for logging requests//
app.use(logger("dev"));
// Set request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));



//Scrape articles from website and insert into mongo database
app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/section/sports").then(function (response) {
        var $ = cheerio.load(response.data);
        $("article").each(function (i, element) {
            var title = $(element).find("h2").text();
            var summary = $(element).find("p").text();
            var link = $(element).find("a").attr("href");

            console.log(title, link);

            if (title && link) {
                db.Articles.create({
                    title: title,
                    summary: summary,
                    link: link
                },
                    function (err, inserted) {
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

// Route to retrieve all articles from the database//
app.get("/Articles", function (req, res) {
    db.Articles.find({})
    .then(function (dbArticles) {
        res.json(dbArticles);
    }).catch(function (err) {
        res.json(err);
    });
});

//Route to get a specific atricle and associated notes//
app.get("/Articles/:id", function (req, res) {
    db.Articles.findOne({ _id: req.params.id})
    .populate("comment")
    .then(function(dbArticles) {
        res.json(dbArticles);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Route for Comments
app.post("/Articles/:id", function (req, res) {
    db.Comments.create({
        title: req.body.title,
        summary: req.body.summary
    })
    .then(function(dbComments) {
        console.log("comment iD" + dbComments._id);
        return db.Articles.findOneAndUpdate({ _id: req.params.id}, {$set: {comment: dbComments._id}}, {new: true});
    })
    .then(function(dbArticles){
        console.log ("article" + dbArticles);
        res.json(dbArticles);
    })
    
    .catch(function(err) {
        res.json(err)
    })
   
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

module.exports = app;