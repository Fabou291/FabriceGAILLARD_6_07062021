import express from "express";
import mongoDB from "../config/mongoDB.js";



const app = express();

app.use((res,req)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
})

app.use(express.static('../front/src/images/sauces'));

app.use(express.json());


export default app;
