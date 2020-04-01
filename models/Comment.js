const mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a LinkSchema object

var CommentSchema = new Schema ({
    title: {type: String},
    summary: {String}

});
var Comments = mongoose.model("Comments", CommentSchema);

module.exports = Comments;