const mongoose = require('mongoose');

const { Schema } = mongoose;

const VAPIDSchema = new Schema({
    privateKey: String,
    publicKey: String
});

module.exports = mongoose.model('vapidKeys', VAPIDSchema);