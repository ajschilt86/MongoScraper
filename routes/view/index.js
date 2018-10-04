const router = require("express").Router();
const db = require("../../models");

router.get("/", function(req, res) {
    db.Headline.find({ saved: false })
    .sort({ date: -1 })
    .then(function(dbArticles) {
        res.render("home", { articles: dbArticles });
    });
});

router.get("/saved", function(req, res) {
    db.Headline.find({ saved: true })
    .sort({ date: -1 })
    .then(function(dbArticles) {
        res.render("saved", { articles: dbArticles});
    });
});

module.exports = router