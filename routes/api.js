const express = require('express');
const router = express.Router();
const webPush = require('web-push');
const pushSubscriptions = require("../models/subscription")
const conf = require("../conf.js");
const fetch = require('fetch');

function pushPostNotification(post, cb) {
    pushSubscriptions.find({}).populate("keys").exec(function(err, subs) {
        for(let subscription of subs) {
            webPush.sendNotification(subscription, JSON.stringify({
                title: `New post from ${post.location}`,
                content: post.title,
                openUrl: "/"
            })).catch((err) => console.log(err));
        }
        cb();
    });
}

router.get('/', function(req, res) {
    res.status(200).json({ happy: "f33t"});
});

router.get('/posts', function(req, res) {
    var Post = require("../models/post");

    Post.find({}).exec(function(err, posts) {
        if(err) {
            res.status(500).json(err);
        } else {
            let responseObject = {};
            for(let post of posts.reverse()) {
                responseObject[post._id] = {
                    id: post._id,
                    title: post.title,
                    location: post.location,
                    image: post.image
                };
            }
            res.status(200).json(responseObject);
        }
    });
});

router.post("/posts", function(req, res) {
    var Post = require("../models/post");

    var newPost = new Post({
        title: req.body.title,
        location: req.body.location,
        image: req.body.image
    });

    newPost.save(function(err, post) {
        if(err) {
            res.status(500).json(err);
        } else {
            pushPostNotification(post, function() {
                res.status(200).json({
                    id: post._id,
                    title: post.title,
                    location: post.location,
                    image: post.image
                });
            });
        }
    });
})

router.post("/subscriptions", function(req, res) {
    if(req.body.endpoint) {
        var Key = require('../models/key');
        var Subscription = require('../models/subscription');

        var newKey = new Key({
            auth: req.body.keys.auth,
            p256dh: req.body.keys.p256dh
        });

        newKey.save(function(err, key) {
            if(err) {
                res.status(500).json(err);
            } else {
                var newSub = new Subscription({
                    endpoint: req.body.endpoint,
                    expirationTime: req.body.expirationTime,
                    keys: key
                });

                newSub.save(function(err, sub) {
                    if(err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).contentType("application/json").send(sub.toJSON());
                    }
                });
            }
        })
    } else {
        res.status(420).json({ message: "Missing required subscription info, smoke weed to fix."});
    }
});

router.get('/subscriptions', function(req, res) {
    var Subscription = require('../models/subscription');

    Subscription.find({}).populate("keys").exec(function(err, subs) {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(subs);
        }
    });
});

module.exports = router;