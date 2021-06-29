import express from "express";
import mongoSanitize from "express-mongo-sanitize"

// Import des fichiers de config
import { path, __dirname } from "../config/pathConfig.js"
import headerConfig from "../config/headerConfig.js"
import mongooseConfig from "../config/mongooseConfig.js";
import sessionConfig from "../config/sessionConfig.js";
import limiterConfig from "../config/limiterConfig.js"

// Import des rooter
import authenticationRouter from "./routes/authenticationRouter.js";
import sauceRouter from "./routes/sauceRouter.js";



const app = express();



mongooseConfig.initialization();
limiterConfig.initialization(app);
headerConfig.initialization(app);
sessionConfig.initialization(app);

app.use(express.json());
app.use(mongoSanitize());
app.use("/images", express.static(path.join(__dirname, "images/")));
app.use("/api/auth", authenticationRouter);
app.use("/api/sauces", sauceRouter);
app.use((error, req, res, next) => {
    console.log(error)
    res.status(error.statusCode || 500).json({ error })
    res.end();
});

export default app;
