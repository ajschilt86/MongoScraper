const axios = require("axios");
const cheerio = require("cheerio");


var scrape = function() {
  return axios.get("https://uncrate.com/").then(function(res) {
    var $ = cheerio.load(res.data);

    var articles = [];


    $(".article").each(function(i, element) {

      var head = $(this)
        .find("h1")
        .text()
        .trim();
      var url = $(this)
        .find("a")
        .attr("href");
      var sum = $(this)
        .find("p")
        .text()
        .trim();

     

        var dataToAdd = {
          headline: head,
          summary: sum,
          url: url
        };

        articles.push(dataToAdd);
      
    });
    return articles;
  });
};

module.exports = scrape;
