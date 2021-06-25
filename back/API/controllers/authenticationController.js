import userModel from "../models/userModel.js";
import authenticationHelper from "../helpers/authenticationHelper.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";



const isOutOfAttemptLimit = (attempt) => {
    return attempt >= process.env.ATTEMPT_PASSWORD_LIMIT;
};

const isOutOfTimeLimit = (now, timestamp) => {
    return now > timestamp + parseInt(process.env.ATTEMPT_TIME_LIMIT);
};

const isOutOfTimeAndAttemptLimit = (now, user) => {
    return (isOutOfAttemptLimit(user.attempt) && !isOutOfTimeLimit(now, user.lastLog))
}

const remainingTime = (now, timestamp) => {
    const rest = Math.round((parseInt(process.env.ATTEMPT_TIME_LIMIT) - (now - timestamp)) / 1000);
    return rest > 60 ? `${Math.round((rest / 60) * 10) / 10} minutes` : `${rest} secondes`;
};

const login = async (req, res, next) => {
    try {
        const now = new Date().getTime();
        

        const user = await userModel.findOne({ email: req.body.email });
        if (!user) throw createHttpError.NotFound("User not found");

        if(isOutOfTimeAndAttemptLimit(now, user))
            throw createHttpError.TooManyRequests(`Too many tries to login, remaining time ${remainingTime(now, user.lastLog)}`);

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {

            if (isOutOfAttemptLimit(user.attempt) || isOutOfTimeLimit(now, user.lastLog)) user.attempt = 0;

            await userModel.updateOne(
                { email: user.email },
                { attempt: ++user.attempt, lastLog: isOutOfTimeLimit(now, user.lastLog) ? now : user.lastLog }
            );
            
            if(isOutOfTimeAndAttemptLimit(now, user))
                throw createHttpError.TooManyRequests(`Too many tries to login, remaining time ${remainingTime(now, user.lastLog)}`);
            else
                throw createHttpError.Unauthorized(
                    `invalid password, remaining attempt : ${parseInt(process.env.ATTEMPT_PASSWORD_LIMIT) - user.attempt}`
                );
        } else {
            await userModel.updateOne({ email: user.email }, { attempt: 0, lastlog: now });
            res.status(200).json({ userId: user._id, token: authenticationHelper.createToken(user._id) });
        }
    } catch (error) {
        return next(error);
    }
};

export default { login };
