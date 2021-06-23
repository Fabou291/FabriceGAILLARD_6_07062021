import createHttpError from "http-errors";
import ipModel from "../models/ipModel.js";

const timeLimit = 3 * 60 * 1000;

const isOutOfAttemptLimit = (attempt) => {
    return attempt >= 5;
};

const isOutOfTimeLimit = (now, timestamp) => {
    return now > timestamp + timeLimit;
};

const remainingTime = (now, timestamp) => {
    const rest = Math.round((timeLimit - (now - timestamp)) / 1000);
    return rest > 60 ? `${Math.round((rest / 60) * 10) / 10} minutes` : `${rest} secondes`;
};

const modify = (req, res, next) => {
    ipModel
        .updateOne(
            { ip: req.ipEntity.ip },
            {
                timestamp: isOutOfTimeLimit(req.now, req.ipEntity.timestamp) ? req.now : req.ipEntity.timestamp,
                attempt: req.ipEntity.attempt,
            }
        )
        .then(res.status(200).json({ message: "ip succesfully updated" }))
        .catch((error) => next(error));
};

const create = (req, res, next) => {
    const ip = new ipModel({
        ip: req.connection.remoteAddress,
        timestamp: req.now,
        attempt: 1,
    });
    ip.save()
        .then(res.status(201).json({ message: "ip succesfully created" }))
        .catch((error) => next(error));
};

const del = (req, res, next) => {
    ipModel.deleteOne({ ip: req.connection.remoteAddress }).catch((error) => next(error));
};

const handle = (req, res, next) => {
    const now = new Date().getTime();
    console.log(req.connection.remoteAddress);
    ipModel
        .findOne({ ip: req.connection.remoteAddress })
        .then((ipEntity) => {
            if (ipEntity) {
                if (isOutOfAttemptLimit(++ipEntity.attempt)) {
                    if (!isOutOfTimeLimit(now, ipEntity.timestamp))
                        return next(createHttpError.TooManyRequests(`Trop, il reste ${remainingTime(now, ipEntity.timestamp)}`));
                    else ipEntity.attempt = 1;
                }

                req.ipEntity = ipEntity;
                req.now = now;
                modify(req, res, next);
            } else {
                req.now = now;
                create(req, res, next);
            }
        })
        .catch((error) => next(error));
};

export default { handle, delete: del };
