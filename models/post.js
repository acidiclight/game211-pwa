const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
    image: String,
    location: String,
    title: String
});

module.exports = mongoose.model('posts', PostSchema);