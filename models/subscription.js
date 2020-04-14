const mongoose = require('mongoose');

const { Schema } = mongoose;

var SubscriptionsSchema = new Schema({
    endpoint: String,
    expirationTime: Date,
    keys: {
        type: Schema.Types.ObjectId,
        ref: "subscriptionKeys"
    }
});

// fix because I'm dumb.
var keys = require("./key.js");

module.exports = mongoose.model("subscriptions", SubscriptionsSchema);