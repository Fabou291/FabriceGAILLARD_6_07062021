import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLog: { type: Number, required: true },
    refreshToken: { type: String, required: true, default: "nothing" },
    attempt: { type: Number, required: true },
});

export default mongoose.model("user", userSchema);
