import mongoose from "mongoose";

const initialization = () => {
  mongoose
    .connect(
      "mongodb+srv://user1:gsg291gsg@cluster0.r78hj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true }
    )
    .then(console.log("Connected to mongoDB !"))
    .catch((error) => console.log("Error connection mongoDB  : ", error));  
}

export default {initialization};
