const mongoose = require('mongoose');

const { Schema } = mongoose;

const KeySchema = new Schema({
    auth: String,
    p256dh: String
});

module.exports = mongoose.model("subscriptionKeys", KeySchema);