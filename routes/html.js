var db = require("../models");
var mongojs = require("mongojs");

module.exports = function(app) {
  app.get("/articles", function(req, res) {
    db.Articles.find({})
      .then(function(dbArticles) {
        let hndlbarsObj = {
          h1: "New York Times Sports",
          subtitle: "Articles",
          type: "scrape",
          hereLink: "/scrape",
          scrapeButton: true,
          articles: dbArticles
        };
        res.render("index", hndlbarsObj);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/saved", function(req, res) {
    db.Articles.find({ saved: true })
      .then(function(dbArticles) {
        let hndlbarsObj = {
          h1: "Saved Articles",
          subtitle: "Your Saved Articles",
          type: "save",
          hereLink: "/articles",
          noteButton: true,
          articles: dbArticles
        };
        console.log(hndlbarsObj);
        res.render("index", hndlbarsObj);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/", function(req, res) {
    res.redirect("/articles");
  });

  app.get("/articles/:id", function(req, res) {
    console.log("getting note info");
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticles) {
        console.log(dbArticles);
        // var modalObj = {
        //   modal: dbArticle
        // }
        let hndlbarsObj = {
          h1: "Notes",
          subtitle: "Your thoughts here.",
          type: "save",
          hereLink: "/articles",
          noteButton: true,
          article: dbArticles
        };
        console.log(hndlbarsObj);
        res.render("add-note-page", hndlbarsObj);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/articles/:id", function(req, res) {
    console.log("this is working");
    db.Comments.create({
      body: req.body.note,
      dateCreated: req.body.created
    })
      .then(function(dbNote) {
        console.log(dbNote);
        return db.Articles.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { note: dbNote._id } },
          { new: true }
        );
      })
      .then(function(dbArticles) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.delete("/deleteNote/:id", function(req, res) {
    db.Note.remove({
      _id: mongojs.ObjectId(req.params.id)
    }, function(error, response) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.send(response);
      };
    });
  });

  app.put("/save/:id", function(req, res) {
    db.Articles.updateOne(
      {
        _id: mongojs.ObjectId(req.params.id)
      },
      {
        $set: {
          saved: true
        }
      },
      function(error, found) {
        if (error) {
          console.log(error);
          console.log(req.params.id);
        } else {
          res.json(found);
        }
      }
    );
  });

  app.put("/unsave/:id", function(req, res) {
    db.Articles.updateOne(
      {
        _id: mongojs.ObjectId(req.params.id)
      },
      {
        $set: {
          saved: false
        }
      },
      function(error, found) {
        if (error) {
          console.log(error);
          console.log(req.params.id);
        } else {
          res.json(found);
        }
      }
    );
  });
};