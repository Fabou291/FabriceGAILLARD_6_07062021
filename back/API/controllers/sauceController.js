import sauceModel from "../models/sauceModel.js";
import createHttpError from "http-errors";




export default { 
    getAll : (req, res, next) => {
        sauceModel
            .find()
            .then((sauces) => res.status(200).json({ sauces }))
            .catch((error) => console.log(error));
    },

    getOne : (req, res, next) => {
        sauceModel
            .findOne({ _id: req.params.id })
            .then((sauce) => {
                if (!sauce) throw createHttpError.NotFound("Sauce not found");
                res.status(200).json({ sauce });
            })
            .catch((error) => res.status(404).json({ error }));
    },
    
    create : (req, res, next) => {
        delete req.body._id;
        const sauce = new sauceModel({ ...req.body });
        sauce
            .save()
            .then(() =>
                res.status(200).json({ message: "sauce successfully created" })
            )
            .catch((error) => res.status(400).json({ error }));
    },
    
    modify : (req, res, next) => {
        sauceModel
            .updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
            .then((result) => {
                if (!result.ok)
                    throw createHttpError.UnprocessableEntity("Wrong arguments");
                const message =
                    result.nModified == 0
                        ? "nothing has been changed on this sauce"
                        : "sauce successfully updated";
                res.status(200).json({ message: message });
            })
            .catch((error) => res.status(400).json({ error }));
    },
    
    remove : (req, res, next) => {
        sauceModel
            .deleteOne({ _id: req.params.id })
            .then(res.status(200).json({ message: "The sauce hase been removed" }))
            .catch((error) => res.status(400).json({ error }));
    },
    
    handleLike : async (req, res, next) => {
        
        try{
            const sauce = await sauceModel.findOne({ _id: req.params.id });
            if (!sauce) throw createHttpError.NotFound("Sauce not found");

            sauce
        }
        catch(error){
            res.status(404).json({ error })
        };
    
    
        //req.updateOne({ _id: req.params.id }, { likes: "", dislikes : "", usersLiked, usersDisliked });
        res.end("handleLike functionnality");
    
    
    
    }
};
