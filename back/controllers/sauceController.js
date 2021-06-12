const sauceModel = require('../models/sauceModel');

exports.getAllSauces = (req,res) => {
    sauceModel.find()
    .then(sauces => res.status(200).json( sauces ))
    .catch(error => res.status(400).json( { error } ));
};

exports.getOneSauce = (req,res) => {
    sauceModel.findOne({ _id : req.params.id })
    .then(sauce => res.status(200).json( sauce ))
    .catch(error => res.status(400).json( { error } ));
};

exports.createSauce = (req,res) => {
    delete req.body._id;
    const sauce = new sauceModel({
        ...req.body
    })
    sauce.save()
    .then( () => res.status(201).json( { message : 'Sauce successfully created' } ))
    .catch(error => res.status(400).json( { error } ));
};

exports.updateSauce = (req,res) => {
    sauceModel.updateOne({ _id : req.params.id }, { ...req.body, _id : req.params._id } )
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
    .then(sauce => res.status(200).json( sauce ))
    .catch(error => res.status(400).json( { error } ));
};