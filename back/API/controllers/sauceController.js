import sauceModel from "../models/sauceModel.js";
import createHttpError from "http-errors";
import likeHandler from "../helpers/LikeHandler.js";
import fs from "fs";

const removeImageSauce = async (id) => {
    try {
        const sauce = await sauceModel.findOne({ _id: id });
        const fileName = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${fileName}`, () => { console.log('deleted') });
    } catch (error) {
        return error;
    }
    return true;
};

export default {
    getAll: (req, res, next) => {
        sauceModel
            .find()
            .then((sauces) => res.status(200).json(sauces))
            .catch((error) => next(createHttpError.BadRequest(error.message)));
    },

    getOne: (req, res, next) => {
        sauceModel
            .findOne({ _id: req.params.id })
            .then((sauce) => {
                if (!sauce) throw createHttpError.NotFound("Sauce not found");
                else res.status(200).json(sauce);
            })
            .catch((error) => { next(error) });
    },

    create: (req, res, next) => {
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
    },

    modify: async (req, res, next) => {
        if (req.file) {
            req.body.sauce = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            };
            await removeImageSauce(req.params.id);
        }

        sauceModel
            .updateOne({ _id: req.params.id }, { ...req.body.sauce, _id: req.params.id })
            .then((result) => {
                if (!result.ok) throw createHttpError.UnprocessableEntity("Wrong arguments");

                const message = result.nModified == 0 ? "nothing has been changed on this sauce" : "sauce successfully updated";

                res.status(200).json({ message: message });
            })
            .catch((error) => next(error));
    },

    remove: async (req, res, next) => {
        await removeImageSauce(req.params.id);

        sauceModel
            .deleteOne({ _id: req.params.id })
            .then((result) => {
                const message = result.deletedCount == 0 ? "Nothing to delete" : "The sauce hase been removed";
                res.status(200).json({ message: message });
            })
            .catch((error) => next(error));
    },

    like: async (req, res, next) => {
        try {
            const sauce = await sauceModel.findOne({ _id: req.params.id });
            if (!sauce) throw createHttpError.NotFound("Sauce not found");

            const result = await sauceModel.updateOne(
                { _id: req.params.id },
                { ...likeHandler(sauce, req.body.like, req.body.userId) }
            );

            const message = result.nModified == 0 ? "nothing has been changed on this sauce" : "sauce successfully updated";

            res.status(200).json({ message: message });
        } catch (error) {
            next(error);
        }
    },
};
