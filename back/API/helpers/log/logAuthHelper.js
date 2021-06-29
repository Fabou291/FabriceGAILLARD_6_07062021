import logAuthModel from "../../models/log/logAuthModel.js";

const create = async (user, ip, statusCode, now) => {

    const userId = !user ? null : user._id ;
    const logAuth = new logAuthModel({
        userId : userId,
        date : now,
        ip : ip,
        statusCode : statusCode
    });

    return await logAuth.save();
}



export default { create };