import mongoose from 'mongoose';

const log = mongoose.Schema({
    userId : { type : String, default : null },
    date : { type : Number, required : true },
    ip : { type : String, required : true },
    statusCode : { type : Number, required : true }
});

export default mongoose.model('logAuth',log);