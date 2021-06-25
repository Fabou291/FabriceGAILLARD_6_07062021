import sauceModel from "../models/sauceModel.js";
import createHttpError from "http-errors";
import fsPromises from "fs/promises"

const remove = async (id) => {
    const sauce = await sauceModel.findOne({ _id: id });
    if (!sauce) throw createHttpError.NotFound("Sauce not found");

    const fileName = sauce.imageUrl.split("/images/")[1];

    const err = await fsPromises.unlink(`images/${fileName}`);
    if(err) throw err;
};

export default { remove };