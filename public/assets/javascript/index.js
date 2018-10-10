
$(document).ready(function () {

    var articleCont = $(".article-container");
    $(document).on("click", ".btn.save", articleSave);
    $(document).on("click", ".scrape-new", articleScrape);
    $(".clear").on("click", articleClear);
    function initPage() {

        $.get("/api/headlines?saved=false").then(function (data) {
            articleCont.empty();

            if (data && data.length) {
                renderArticles(data);
            } else {

                renderEmpty();
            }
        });
    }
    //show all the articles
    function renderArticles(articles) {
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
        articleCont.append(articleCards);
    }

    //creates the card that contains all the information
    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", article.url)
                    .text(article.headline),
                $("<a class='btn btn-primary save'>Save Product</a>")
            )
        );
        var cardBody = $("<div class='card-body'>").text(article.summary);
        card.append(cardHeader, cardBody);
        card.data("_id", article._id);
        return card;
    }

    //saves articles 
    function articleSave() {
        var articleToSave = $(this)
            .parents(".card")
            .data();
        $(this)
            .parents(".card")
            .remove();

        articleToSave.saved = true;
        $.ajax({
            method: "PUT",
            url: "/api/headlines/" + articleToSave._id,
            data: articleToSave
        }).then(function (data) {
            if (data.saved) {
                initPage();
            }
        });
    }

    //scrapes articles
    function articleScrape() {
        $.get("/api/fetch").then(function (data) {
            initPage();
            bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
        });
    }

    function articleClear() {
        $.get("api/clear").then(function () {
            articleCont.empty();
            initPage();
        });
    }
    
    //tell you when there are no products scraped
    function renderEmpty() {
        var emptyAlert = $(
            [
                "<div class='text-center'>",
                "<h4>You have not scraped any products!</h4>",
                "</div>"
            ].join("")
        );
        articleCont.append(emptyAlert);
    }

});
