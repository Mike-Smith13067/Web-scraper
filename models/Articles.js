const mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a LinkSchema object

var ArticleSchema = new Schema ({
    title: String,
    summary: String,
    link: String,
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }

});
var Articles = mongoose.model("Article", ArticleSchema);

module.exports = Articles;

