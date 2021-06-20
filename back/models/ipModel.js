const mongoose = require('mongoose');

const ipModel = mongoose.Schema({
    ip          : { type: String, require : true, unique : true },
    timestamp   : { type: Number, require : true },
    attempt     : { type: Number, require : true},
});

module.exports = mongoose.model('ipModel',ipModel);