const express = require('express'); // import Framework Express
const bodyParser = require('body-parser'); // import Body-parser
const mongoose = require('mongoose'); // import package Mongoose pour les intéractions avec la base de données MongoDB
const path = require('path');
const helmet = require('helmet'); // import helmet
const dotenv = require('dotenv').config();

// Déclaration routes user et sauces
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const config = require('./config');

// Connection de l'API au cluster MongoDB
mongoose.connect(process.env.MONGODB_URI,
  { dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Utilisation de la méthode express 
const app = express();

//Utilisation middleware helmet
app.use(helmet());

// Middleware général qui s'applique à toutes les routes envoyé au serveur et headers pour éviter les problèmes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Analyse toutes les requêtes entrantes 
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes API
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;