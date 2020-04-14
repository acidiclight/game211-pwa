const express = require('express');
const mongoose = require('mongoose');
const api = require("./routes/api.js");
const bodyParser = require('body-parser');
const webPush = require('web-push');
const conf = require("./conf.js");
const path = require('path');

function startApp() {
    const app = express();

    app.use(bodyParser.json());
    app.use('/api', api);
    app.use(express.static(path.join(__dirname, "public")));

    app.listen(3000);
}

function setupWebPush(cb) {
    webPush.setVapidDetails("mailto:theplexgate@gmail.com", conf.vapidKeys.publicKey, conf.vapidKeys.privateKey);
    webPush.setGCMAPIKey(conf.serverKey);
    cb();
}

mongoose.connect('mongodb://localhost/game211-pwagram')
    .then(function(connection) {
        setupWebPush(startApp);
    })
    .catch(function(error) {
        console.error(error);
    });

