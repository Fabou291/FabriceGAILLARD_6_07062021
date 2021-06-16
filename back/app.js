const express = require('express');
const app = express();
const session = require('express-session');
const rateLimit = require("express-rate-limit");
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/userRouter');
const sauceRouter = require('./routes/sauceRouter');



const ONE_HOUR = 1000 * 60 * 60;
const NODE_ENV = 'devlopment';
const SESSION_SECRET = '&é"çàràjfd628894513$^*ù:!';

mongoose.connect( 'mongodb+srv://user1:gsg291gsg@cluster0.r78hj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex : true //Arrete le warning causé par le "unique:true" dans le userModel : "DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead."
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(
  session({
    resave : false, //n'authorise pas à save dans session store 
    name : 'sid',
    saveUninitialized : false,
    secret : SESSION_SECRET,
    cookie : {
      maxAge: ONE_HOUR,
      httpOnly : true, //HTTP only
      sameSite : true,
      secure : NODE_ENV === 'production', //passer à true lorsque la connexion sera en https
    }
  })
);

//Protège des attaques ddos et/ou brute force
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images/')))

app.use( '/api/auth', userRouter );
app.use( '/api/sauces', sauceRouter );

module.exports = app;