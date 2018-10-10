$(document).ready(function () {
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", productDelete);
    $(document).on("click", ".btn.notes", productNotes);
    $(document).on("click", ".btn.save", noteSave);
    $(document).on("click", ".btn.note-delete", noteDelete);
    $(".clear").on("click", articleClear);

    function initPage() {
        $.get("/api/headlines?saved=true").then(function (data) {
            articleContainer.empty();
            if (data && data.length) {
                renderProducts(data);
            } else {
                renderEmpty();
            }
        });
    }

    //shows all the products
    function renderProducts(articles) {
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    //show the info for everything
    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", article.url)
                    .text(article.headline),
                $("<a class='btn btn-primary delete'>Delete From Saved</a>"),
                $("<a class='btn btn-success notes'>Product Notes</a>")
            )
        );

        var cardBody = $("<div class='card-body'>").text(article.summary);

        card.append(cardHeader, cardBody);
        card.data("_id", article._id);
        return card;
    }

    //tells user there are no products scraped
    function renderEmpty() {
        var emptyAlert = $(
            [
                "<div class='text-center'>",
                "<h4>You have not scraped any products!</h4>",
                "</div>"
            ].join("")
        );
        articleContainer.append(emptyAlert);
    }

    //shows the list of notes
    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        } else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $("<li class='list-group-item note'>")
                    .text(data.notes[i].noteText)
                    .append($("<button class='btn btn-primary note-delete'>x</button>"));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    // deletes
    function productDelete() {
        var articleToDelete = $(this)
            .parents(".card")
            .data();

        $(this)
            .parents(".card")
            .remove();
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function (data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    //product notes
    function productNotes(event) {
        var currentProduct = $(this)
            .parents(".card")
            .data();
        $.get("/api/notes/" + currentProduct._id).then(function (data) {
            var modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Notes For products: " + currentProduct._id),
                $("<hr>"),
                $("<ul class='list-group note-container'>"),
                $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                $("<button class='btn btn-success save'>Save Note</button>")
            );
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentProduct._id,
                notes: data || []
            };
            $(".btn.save").data("article", noteData);
            renderNotesList(noteData);
        });
    }
    //save
    function noteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea")
            .val()
            .trim();
        if (newNote) {
            noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
            $.post("/api/notes", noteData).then(function () {

                bootbox.hideAll();
            });
        }
    }

    //delete
    function noteDelete() {
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function () {
            bootbox.hideAll();
        });
    }

    //clear products
    function articleClear() {
        $.get("api/clear")
            .then(function () {
                articleContainer.empty();
                initPage();
            });
    }
});
