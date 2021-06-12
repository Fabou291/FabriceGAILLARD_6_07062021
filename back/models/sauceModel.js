const mongoose = require('mongoose');

const sauceModel = mongoose.Schema({
    userId          : { type: String, require : true },
    name            : { type: String, require : true},
    manufacturer    : { type: String, require : true},
    mainPepper      : { type: String, require : true},
    imageUrl        : { type: String, require : true},
    heat            : { type: Number, require : true},
    likes           : { type: Number, require : true},
    dislikes        : { type: Number, require : true},
    usersLiked      : { type: String, require : true},
    usersDisliked   : { type: Array,  require : true},
    image           : { type: Array,  require : true}
});

module.exports = mongoose.model('sauceModel', sauceModel);