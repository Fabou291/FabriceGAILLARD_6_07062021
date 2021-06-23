import sauceModel from "../models/sauceModel.js";
import createHttpError from "http-errors";
import fs from "fs";

const remove = async (id) => {
    const sauce = await sauceModel.findOne({ _id: id });
    if (!sauce) throw createHttpError.NotFound("Sauce not found");

    const fileName = sauce.imageUrl.split("/images/")[1];

    fs.unlink(`images/${fileName}`, () => {});
};

export default { remove };