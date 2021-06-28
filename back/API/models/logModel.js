import mongoose from 'mongoose';

const log = mongoose.Schema({
    userId : { type : String, required : true, default : null },
    date : { type : Number, required : true },
    ip : { type : String, required : true }
});

export default mongoose.model('log',log);