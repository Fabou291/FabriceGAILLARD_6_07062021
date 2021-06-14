const sauceModel = require('../models/sauceModel');
const handleLikes = require('../middlewares/hundleLikes')

exports.getAllSauces = (req,res) => {
    sauceModel.find()
    .then(sauces => res.status(200).json( sauces ))
    .catch(error => res.status(400).json( { error } ));
};

exports.getOneSauce = (req,res) => {
    sauceModel.findOne({ _id : req.params.id })
    .then(sauce =>  res.status(200).json(sauce) )
    .catch(error => res.status(400).json( { error } ));
};

exports.createSauce = (req,res) => {
    const sauceReq = JSON.parse(req.body.sauce);
    delete sauceReq._id;
    const sauce = new sauceModel({
        ...sauceReq,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
    .then( () => res.status(201).json( { message : 'Sauce successfully created' } ))
    .catch(error => res.status(400).json( { error } ));
};

exports.updateSauce = (req,res) => {
    const sauceReq = JSON.parse(req.body.sauce);
    sauceModel.updateOne({ _id : req.params.id }, { 
        ...sauceReq, 
        _id : req.params._id, 
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    .then( () => res.status(200).json( { message : 'Sauce successfully updated' } ))
    .catch(error => res.status(400).json( { error } ));
};

exports.deleteSauce = (req,res) => {
    sauceModel.deleteOne({ _id : req.params.id })
    .then( () => res.status(200).json( { message : 'Sauce successfully deleted' } ))
    .catch(error => res.status(400).json( { error } ));
};



exports.likeSauce = (req,res) => {
    sauceModel.findOne({ _id : req.params.id })
    .then(sauce => {
        console.log( handleLikes(sauce, req.body.like) )
        //update sauce
        sauceModel.updateOne({ _id : req.params.id }, { ...handleLikes(sauce, req.body.like, req.body.userId) })
        .then((sauce) => res.status(200).json( sauce ))
        .catch( error => res.status(400).json({error}));
    })
    .catch(error => res.status(400).json( { error } ));
};


