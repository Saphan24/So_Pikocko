const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const ExpressBrute = require('express-brute'); // Middleware de protection de brute-force pour les routes express

const store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

router.post('/signup', userCtrl.signup);
router.post('/login', bruteforce.prevent, userCtrl.login); // erreur 429 si nous empruntons cette route trop souvent 

module.exports = router;
