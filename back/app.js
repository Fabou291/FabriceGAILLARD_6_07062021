const express = require('express');
const app = express();

const mongoose = require('mongoose');
const path = require('path');

const userRouter = require('./routes/userRouter');
const sauceRouter = require('./routes/sauceRouter');




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

app.use('/images', express.static(path.join(__dirname, 'images/')))

app.use(express.json());

app.use( '/api/auth', userRouter );
app.use( '/api/sauces', sauceRouter );

module.exports = app;