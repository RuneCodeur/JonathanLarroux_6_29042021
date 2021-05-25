const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

// comportements des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//limite 10 requetes par minutes par adresse IP
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 20
});

//adresse de connexion de la base de donnée
mongoose.connect('mongodb+srv://principalUser:sgrI0teLOC5QRP1i@cluster0.tc573.mongodb.net/SoPekockoDataBase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);

app.use('/images', express.static(path.join(__dirname, 'images')));

//routes principale
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;