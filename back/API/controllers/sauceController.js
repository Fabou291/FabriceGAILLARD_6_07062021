import sauceModel from "../models/sauceModel.js";
import createHttpError from "http-errors";
import likeHelper from "../helpers/LikeHelper.js";
import imageHelper from "../helpers/ImageHelper.js"
import xss from "xss"

/**
 * @function getAll
 * @description Récupère l'ensemble des sauces
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getAll = (req, res, next) => {
    sauceModel
        .find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => next(createHttpError.BadRequest(error.message)));
}

/**
 * @function getOne
 * @description Récupère une sauce en fonction de l'id (req.params.id)
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getOne = (req, res, next) => {

    sauceModel
        .findOne({ _id: xss(req.params.id) })
        .then((sauce) => {
            if (!sauce) throw createHttpError.NotFound("Sauce not found");
            else res.status(200).json(sauce);
        })
        .catch((error) => {
            next(error);
        });
}

/**
 * @function create
 * @description Ajoute une nouvelle sauce en bdd
 * @param {*} req (req.body.sauce)
 * @param {*} res 
 * @param {*} next 
 */
const create = (req, res, next) => {

    req.body.sauce = JSON.parse(req.body.sauce);
    for(let k in req.body.sauce) req.body.sauce[k] = xss(req.body.sauce[k]);

    delete req.body._id;
    const sauce = new sauceModel({
        ...req.body.sauce,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    sauce
        .save()
        .then(() => res.status(200).json({ message: "sauce successfully created" }))
        .catch((error) => next(error));
}

/**
 * @function modify
 * @description Modifie les informations d'une sauce déja existante en bdd
 * @param {*} req (req.file, req.body.sauce)
 * @param {*} res 
 * @param {*} next 
 */
const modify = async (req, res, next) => {
    if (req.file) {
        req.body.sauce = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        };
        await imageHelper.remove(req.params.id).catch(error => next(error))
    } else req.body.sauce = { ...req.body };

    for(let k in req.body.sauce) req.body.sauce[k] = xss(req.body.sauce[k]);

    sauceModel
        .updateOne({ _id: xss(req.params.id), userId: req.authentication.userId }, { ...req.body.sauce, _id: xss(req.params.id) })
        .then((result) => {
            if (!result.ok) throw createHttpError.UnprocessableEntity("Wrong arguments");

            const message = result.nModified == 0 ? "nothing has been changed on this sauce" : "sauce successfully updated";

            res.status(200).json({ message: message });
        })
        .catch((error) => next(error));
}

/**
 * @function remove
 * @description Supprime la sauce en bdd dont l'id correspond
 * @param {*} req (req.params.id)
 * @param {*} res 
 * @param {*} next 
 */
const remove = async (req, res, next) => {
    req.params.id = xss(req.params.id);

    await imageHelper.remove(req.params.id).catch(error => next(error));

    sauceModel
        .deleteOne({ _id: req.params.id, userId: req.authentication.userId })
        .then((result) => {
            const message = result.deletedCount == 0 ? "Nothing to delete" : "The sauce hase been removed";
            res.status(200).json({ message: message });
        })
        .catch((error) => next(error));
}

/**
 * @function like
 * @description Met à jours les données relative aux like / dislike pour la sauce défini par l'id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const like = async (req, res, next) => {
    try {
        req.params.id = xss(req.params.id);
        const sauce = await sauceModel.findOne({ _id: req.params.id });
        if (!sauce) throw createHttpError.NotFound("Sauce not found");

        const result = await sauceModel.updateOne(
            { _id: req.params.id },
            { ...likeHelper.handle(sauce, xss(req.body.like), xss(req.body.userId)) }
        );

        const message = result.nModified == 0 ? "nothing has been changed on this sauce" : "sauce successfully updated";

        res.status(200).json({ message: message });
    } catch (error) {
        next(error);
    }
}



export default { getAll, getOne, create, modify, remove, like }
