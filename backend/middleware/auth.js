const jwt = require('jsonwebtoken');

//Middleware d'authentification (vérifie le token envoyé par l'application frontend)
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // récupération du token après l'espace (bearer) 
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Vérification du token
    const userId = decodedToken.userId; // Décode et récupère le userId
    if (req.body.userId && req.body.userId !== userId) { // Si le userId est dans le corps de la requête et différent du userId
        throw 'User ID non valable !'; // renvoie une erreur
    } else {
      next(); 
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !'});
  }
};

