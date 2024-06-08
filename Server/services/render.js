const axios = require("axios");

exports.home = (req, res) => {
    res.render("index.ejs");
}

exports.chat =(req, res) => {
    res.render("home.ejs");
}