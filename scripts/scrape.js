const axios = require("axios");
const cheerio = require("cheerio");


var scrape = function() {
  return axios.get("https://uncrate.com/").then(function(res) {
    var $ = cheerio.load(res.data);

    var articles = [];


    $(".article-list").each(function(i, element) {

      var head = $(this)
        .find("h2")
        .text()
        .trim();
      var url = $(this)
        .find("a")
        .attr("href");
      var sum = $(this)
        .find("p")
        .text()
        .trim();

      if (head && sum && url) {
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: "https://uncrate.com/" + url
        };

        articles.push(dataToAdd);
      }
    });
    return articles;
  });
};

module.exports = scrape;
