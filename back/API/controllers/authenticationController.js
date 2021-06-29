import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import attemptLogHelper from "../helpers/attemptLogHelper.js";
import tokenHelper from "../helpers/tokenHelper.js";
import logAuthHelper from "../helpers/log/logAuthHelper.js";

/**
 * @function Login
 * @description Authentifie l'utilisateur si les conditions suivantes sont réunie :
 *  - Si le mail est présent en bdd
 *  - Si son nombre de tentative n'excède pas 5 dans le temps limite impartie (protection contre brute force)
 *  - Si le password est correcte
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const login = async (req, res, next) => {
    const now = new Date().getTime();

    let user = null,
        update;

    try {
        user = await userModel.findOne({ email: req.body.email });
        if (!user) throw createHttpError.NotFound("User not found");

        if (attemptLogHelper.isOutOfTimeAndAttemptLimit(now, user))
            throw createHttpError.TooManyRequests(`Too many tries to login, remaining time ${remainingTime(now, user.lastLog)}`);

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            if (attemptLogHelper.isOutOfAttemptLimit(user.attempt) || attemptLogHelper.isOutOfTimeLimit(now, user.lastLog))
                user.attempt = 0;

            update = {
                attempt: ++user.attempt,
                lastLog: attemptLogHelper.isOutOfTimeLimit(now, user.lastLog) ? now : user.lastLog,
            };

            if (attemptLogHelper.isOutOfTimeAndAttemptLimit(now, user))
                throw createHttpError.TooManyRequests(
                    `Too many tries to login, remaining time ${remainingTime(now, user.lastLog)}`
                );
            else
                throw createHttpError.Unauthorized(
                    `invalid password, remaining attempt : ${parseInt(process.env.ATTEMPT_PASSWORD_LIMIT) - user.attempt}`
                );
        } else update = { attempt: 0, lastlog: now, refreshToken: tokenHelper.createRefreshToken(user._id) };

        await userModel.updateOne({ email: user.email }, update);
    } catch (error) {
        try {
            await logAuthHelper.create(user, req.connection.remoteAddress, error.statusCode, now);
        } catch (error) {
            return next(error);
        }
        return next(error);
    }
    
    return res.status(200).json({ userId: user._id, token: tokenHelper.createToken(user._id) });
};

export default { login };