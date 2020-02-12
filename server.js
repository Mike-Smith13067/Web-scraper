//Server package
const express = require('express');
//noSQL database package
const mongoose = require('mongoose');

//Scraping packages
const cheerio = require('cheerio');
const axios = require('axios');

var PORT = 3000;

//Handlebars package and initiation
const exhb = require('express-handlebars');

var db = require("./models");

//Initialize Express
const app = express();

// Set request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//Connecting to mongo database
mongoose.connect("mongodb://localhost/newsPopulater", { useNewUrlParser: true});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});