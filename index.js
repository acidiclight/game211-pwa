const express = require('express');
const mongoose = require('mongoose');
const api = require("./routes/api.js");
const bodyParser = require('body-parser');
const webPush = require('web-push');
const confBecauseImTooFuckingLazyToUseEnvironmentVariables = require("./conf.js");

function startApp() {
    const app = express();

    app.use(bodyParser.json());
    app.use('/api', api);
    app.use(express.static("public"));

    app.listen(3000);
}

function setupWebPush(cb) {
    function whenDone(keys) {
        webPush.setVapidDetails("mailto:theplexgate@gmail.com", keys.publicKey, keys.privateKey);
        cb();
    }

    webPush.setGCMAPIKey(confBecauseImTooFuckingLazyToUseEnvironmentVariables.serverKey);

    const vapidKeysModel = require('./models/vapidKey.js');

    vapidKeysModel.findOne({}).exec(function(err, keys) {
        if(err) {
            throw err;
        } else {
            if(keys) {
                whenDone(keys);
            } else {
                var newKeys = webPush.generateVAPIDKeys();
                var newKeyDocument = new vapidKeysModel({
                    publicKey: newKeys.publicKey,
                    privateKey: newKeys.privateKey
                });
                newKeyDocument.save(function(err, keys) {
                    whenDone(keys);
                });
            }
        }
    });
}

mongoose.connect('mongodb://localhost/game211-pwagram')
    .then(function(connection) {
        setupWebPush(startApp);
    })
    .catch(function(error) {
        console.error(error);
    });

