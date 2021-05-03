const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    heat: { type: Number, required: true },
    userId: { type: String, required: true },
    imageUrl:{ type: String, required: true },
    likes:{ type: Number, default: 0 },
    dislikes:{ type: Number, default: 0 },
    usersLiked:[],
    usersDisliked:[],
});

module.exports = mongoose.model('sauce', thingSchema);