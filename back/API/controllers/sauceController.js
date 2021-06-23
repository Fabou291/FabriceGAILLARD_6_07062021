import sauceModel from "../models/sauceModel.js";
import createHttpError from "http-errors";
import likeHelper from "../helpers/LikeHelper.js";
import imageHelper from "../helpers/ImageHelper.js"


const getAll = (req, res, next) => {
    sauceModel
        .find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => next(createHttpError.BadRequest(error.message)));
}

const getOne = (req, res, next) => {
    sauceModel
        .findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) throw createHttpError.NotFound("Sauce not found");
            else res.status(200).json(sauce);
        })
        .catch((error) => {
            next(error);
        });
}

const create = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);

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

const modify = async (req, res, next) => {
    if (req.file) {
        req.body.sauce = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        };
        imageHelper.remove(req.params.id).catch(error => next(error))
    } else req.body.sauce = { ...req.body };

    sauceModel
        .updateOne({ _id: req.params.id }, { ...req.body.sauce, _id: req.params.id })
        .then((result) => {
            if (!result.ok) throw createHttpError.UnprocessableEntity("Wrong arguments");

            const message = result.nModified == 0 ? "nothing has been changed on this sauce" : "sauce successfully updated";

            res.status(200).json({ message: message });
        })
        .catch((error) => next(error));
}

const remove = async (req, res, next) => {
    await imageHelper.remove(req.params.id);

    sauceModel
        .deleteOne({ _id: req.params.id })
        .then((result) => {
            const message = result.deletedCount == 0 ? "Nothing to delete" : "The sauce hase been removed";
            res.status(200).json({ message: message });
        })
        .catch((error) => next(error));
}

const like = async (req, res, next) => {
    try {
        const sauce = await sauceModel.findOne({ _id: req.params.id });
        if (!sauce) throw createHttpError.NotFound("Sauce not found");

        const result = await sauceModel.updateOne(
            { _id: req.params.id },
            { ...likeHelper.handle(sauce, req.body.like, req.body.userId) }
        );

        const message = result.nModified == 0 ? "nothing has been changed on this sauce" : "sauce successfully updated";

        res.status(200).json({ message: message });
    } catch (error) {
        next(error);
    }
}



export default { getAll, getOne, create, modify, remove, like }
