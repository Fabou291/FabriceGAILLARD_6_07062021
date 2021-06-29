import helmet from "helmet";

const initialization = (app) => {
    app.use((req, res, next) => {    
        helmet();
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");   
        next(); 
    });
}

export default { initialization };


