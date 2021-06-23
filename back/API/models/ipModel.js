import mongoose from 'mongoose';

const ipModel = mongoose.Schema({
    ip          : { type: String, require : true, unique : true },
    timestamp   : { type: Number, require : true },
    attempt     : { type: Number, require : true},
});

export default mongoose.model('ip',ipModel);