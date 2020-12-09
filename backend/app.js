const express = require('express');
const bodyParser = require('body-parser'); // import Body-parser
const mongoose = require('mongoose'); // import mongoose
const path = require('path');

// Déclaration routes user et sauces
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const config = require('./config');
mongoose.connect( config.mongoURI,
  { useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Utilisation express 
const app = express();

// Middleware général qui s'applique à toutes les routes envoyé au serveur
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