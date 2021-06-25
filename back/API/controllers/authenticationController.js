import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import attemptLogHelper from "../helpers/attemptLogHelper.js"
import tokenHelper from "../helpers/tokenHelper.js";


const login = async (req, res, next) => {
    try {
        const now = new Date().getTime();
        
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) throw createHttpError.NotFound("User not found");

        if(attemptLogHelper.isOutOfTimeAndAttemptLimit(now, user))
            throw createHttpError.TooManyRequests(`Too many tries to login, remaining time ${remainingTime(now, user.lastLog)}`);

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {

            if (attemptLogHelper.isOutOfAttemptLimit(user.attempt) || attemptLogHelper.isOutOfTimeLimit(now, user.lastLog)) user.attempt = 0;

            await userModel.updateOne(
                { email: user.email },
                { attempt: ++user.attempt, lastLog: attemptLogHelper.isOutOfTimeLimit(now, user.lastLog) ? now : user.lastLog }
            );
            
            if(attemptLogHelper.isOutOfTimeAndAttemptLimit(now, user))
                throw createHttpError.TooManyRequests(`Too many tries to login, remaining time ${remainingTime(now, user.lastLog)}`);
            else
                throw createHttpError.Unauthorized(
                    `invalid password, remaining attempt : ${parseInt(process.env.ATTEMPT_PASSWORD_LIMIT) - user.attempt}`
                );
        } else {
            await userModel.updateOne({ email: user.email }, { attempt: 0, lastlog: now, refreshToken: tokenHelper.createRefreshToken(user._id) });
            res.status(200).json({ userId: user._id, token: tokenHelper.createToken(user._id) });
        }
    } catch (error) {
        return next(error);
    }
};

export default { login };
