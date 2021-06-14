const sauceModel = require('../models/sauceModel');
const handleLikes = require('../middlewares/hundleLikes');
const fs = require('fs');
const { update } = require('../models/sauceModel');

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

updateS = (req,res, sauceReq) => {
    
    sauceModel.updateOne({ _id : req.params.id }, { 
        ...sauceReq, 
        _id : req.params.id
    })
    .then( () => res.status(200).json( { message : 'Sauce successfully updated' } ))
    .catch(error => res.status(400).json( { error } ));
}

updateSauceWithFile = (req, res) => {
    const sauceReq = {  
        ...JSON.parse(req.body.sauce), 
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    };

    sauceModel.findOne({ _id : req.params.id })
    .then(sauce => {
        const fileName = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${fileName}`, ()=> {  updateS(req, res, sauceReq) })
    })
    .catch(error => res.status(400).json( { error } ));
}

updateSauceWithoutFile = (req, res) => {
    updateS(req, res, { ...req.body });
}

exports.updateSauce = (req,res) => {
    if(req.file) updateSauceWithFile(req,res)
    else updateSauceWithoutFile(req,res);
};

exports.deleteSauce = (req,res) => {

    sauceModel.findOne({ _id : req.params.id })
    .then(sauce => {
        const fileName = sauce.imageUrl.split('/images/')[1];

        fs.unlink(`images/${fileName}`, () => {
            sauceModel.deleteOne({ _id : req.params.id })
            .then( () => res.status(200).json( { message : 'Sauce successfully deleted' } ))
            .catch(error => res.status(400).json( { error } ));            
        });

    })
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


