import express from "express";
import mongoDB from "../config/mongoDB.js";

import authenticationRouter from "./routes/authenticationRouter.js";
import sauceRouter from "./routes/sauceRouter.js";
import cookieParser from 'cookie-parser'


import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);







const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use(cookieParser());

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images/')));

app.use('/api/auth', authenticationRouter);
app.use('/api/sauces', sauceRouter);



app.use((req,res, next) => {
    res.status(404).send({
        error : {
            message : 'Not found'
        }
    })
})

export default app;
