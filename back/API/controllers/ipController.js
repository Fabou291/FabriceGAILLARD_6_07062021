import createHttpError from "http-errors";
import ipModel from "../models/ipModel.js";

const timeLimit = 1 * 60 * 1000;

const isOutOfAttemptLimit = (attempt) => {
    return attempt >= process.env.ATTEMPT_PASSWORD_LIMIT;
};

const isOutOfTimeLimit = (now, timestamp) => {
    return now > timestamp + timeLimit;
};

const remainingTime = (now, timestamp) => {
    const rest = Math.round((timeLimit - (now - timestamp)) / 1000);
    return rest > 60 ? `${Math.round((rest / 60) * 10) / 10} minutes` : `${rest} secondes`;
};



const create = async (req) => {
    const ip = new ipModel(req.ipEntity);
    try {
        await ip.save();
    }
    catch(error){
        next(error)
    }
}



const gate = async (req, res, next) => {
    const now = new Date().getTime();

    try {
        const ipEntity = await ipModel.findOne({ ip: req.connection.remoteAddress });
        if (ipEntity) {
            if (isOutOfAttemptLimit(ipEntity.attempt) && !isOutOfTimeLimit(now, ipEntity.timestamp)) 
                throw createHttpError.TooManyRequests(
                    `Too many tries to login, remaining time ${remainingTime(now, ipEntity.timestamp)}`
                );
            
            if (isOutOfAttemptLimit(ipEntity.attempt)) ipEntity.attempt = 1;
            

            req.ipEntity = {
                ip: ipEntity.ip,
                attempt: ipEntity.attempt,
                timestamp: isOutOfTimeLimit(now, ipEntity.timestamp) ? now : ipEntity.timestamp,
            };

            return next();
        } else {
            req.ipEntity = {
                ip: req.connection.remoteAddress,
                timestamp: now,
                attempt: 0,
            };
            create(req);
            return next();
        }
    } catch (error) {
        next(error);
    }
};

export default { gate };
