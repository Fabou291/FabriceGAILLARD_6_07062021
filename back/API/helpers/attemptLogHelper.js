/**
 * @function isOutOfAttemptLimit
 * @description Vérifie si le nombre d'essai atteint ou dépasse la limite autorisé 
 * @param {Number} attempt 
 * @returns {bool}
 */
const isOutOfAttemptLimit = (attempt) => {
    return attempt >= process.env.ATTEMPT_PASSWORD_LIMIT;
};

/**
 * @function isOutOfTimeLimit
 * @description Vérifie si now (le timestamp représentant l'instant actuel) est hors des limite imposée
 * @param {Number} now 
 * @param {Number} timestamp 
 * @returns {bool}
 */
const isOutOfTimeLimit = (now, timestamp) => {
    return now > timestamp + parseInt(process.env.ATTEMPT_TIME_LIMIT);
};

/**
 * @function isOutOfTimeAndAttemptLimit
 * @description
 * @param {Number} now 
 * @param {Object} user 
 * @returns {bool}
 */
const isOutOfTimeAndAttemptLimit = (now, user) => {
    return (isOutOfAttemptLimit(user.attempt) && !isOutOfTimeLimit(now, user.lastLog))
}

/**
 * @function remainingTime
 * @description Retourne le temps restant avant de pouvoir à nouveau tenter de s'authentifier
 * @param {Number} now 
 * @param {Number} timestamp 
 * @returns {String}
 */
const remainingTime = (now, timestamp) => {
    const rest = Math.round((parseInt(process.env.ATTEMPT_TIME_LIMIT) - (now - timestamp)) / 1000);
    return rest > 60 ? `${Math.round((rest / 60) * 10) / 10} minutes` : `${rest} secondes`;
};

export default { isOutOfAttemptLimit, isOutOfTimeLimit, isOutOfTimeAndAttemptLimit, remainingTime }