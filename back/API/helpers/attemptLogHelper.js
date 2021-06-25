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

export default { isOutOfAttemptLimit, isOutOfTimeLimit, isOutOfTimeAndAttemptLimit, remainingTime }