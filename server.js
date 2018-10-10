const express = require("express");
const mongoose = require("mongoose");
const hb = require("express-handlebars");

//port
const PORT = process.env.PORT || 8080;

//express
const app = express();
const routes = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", hb({ defaultLayout: "main" }));

//connecting hb
app.set("view engine", "handlebars");
app.use(routes);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
    console.log("listening on port: " + PORT);
});