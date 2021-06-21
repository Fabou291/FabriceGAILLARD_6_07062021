import sauceModel from "../models/sauceModel.js";

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