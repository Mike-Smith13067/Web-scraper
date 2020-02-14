const mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a LinkSchema object

var CommentSchema = new Schema ({
    title: String,
    summary: String,
    link: String

});
var Article = mongoose.model("Article", CommentSchema);

module.exports = Comment;