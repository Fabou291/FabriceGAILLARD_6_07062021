const ipModel = require('../models/ipModel');

let actualTimeStamp;

const timeLimit = 5*60*1000; //5mintues

const attemptLimit = 5;

const isInWaitingRoom = (timestamp) => {
    return (actualTimeStamp - timestamp) < timeLimit ;
}

const limitAttemptReached = (attempNumber) => {
    return attempNumber >= attemptLimit;
}

const create = (req, res, callback) => {
    const ip = new ipModel({
        ip : req.connection.remoteAddress,
        timestamp : new Date().getTime(),
        attempt : 1,
    })
    ip.save()
    .then(callback)
    .catch(error => res.status(430).json({ message : error }))
}

const update = (req, res, callback, ip) => {
    try{
        if(limitAttemptReached(ip.attempt+1) && isInWaitingRoom(ip.timestamp) ) 
            throw 'Limite de tentative de mot de passe atteinte, il reste ' + ( Math.round( (timeLimit -(actualTimeStamp - ip.timestamp))/1000)) + ' secondes'; 

        const attempt = (ip.attempt >= attemptLimit) ? 1 : ++ip.attempt;

        ipModel.updateOne({ ip : req.connection.remoteAddress }, {
            attempt     : attempt,
            timestamp   : (isInWaitingRoom(ip.timestamp) ) ? ip.timestamp : actualTimeStamp
        })
        .then(callback(attemptLimit - attempt))
        .catch(error => res.status(400).json({ message : error }))  

    }
    catch(error){ res.status(429).json({ message : error }); }  
}

exports.verif = (req, res, callback) => {
    actualTimeStamp = new Date().getTime();

    ipModel.findOne({ ip : req.connection.remoteAddress })
    .then(ip => {
        if(ip) update(req, res, callback, ip);
        else create(req, res, callback);
    })
    .catch(error => res.status(400).json({ message : error }) )
}

exports.delete = (req, res, callback) => {
    ipModel.deleteOne({ ip : req.connection.remoteAddress })
    .then(callback)
    .catch(error => res.status(500).json({ message : error }) )
}


