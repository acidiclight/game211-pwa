const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json({ happy: "f33t"});
});

router.get('/posts', function(req, res) {
    let ret = {
        "0": {
            "title": "Hello world.",
            location: "Cyberspace",
            image: "/src/images/main-image-sm.jpg"
        }
    };

    res.status(200).json(ret);
});

router.put('/posts', function(req, res) {
    res.status(200).json({ happy: "f33t" });    
})

router.post("/posts", function(req, res) {
    res.status(200).json({ happy: "f33t" });
})

module.exports = router;