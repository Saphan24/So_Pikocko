const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth'); // Importation middleware d'authentification
const multer = require('../middleware/multer-config'); // Middleware multer-config gestion des fichiers images


// routes CRUD: Create, Read, Update et Delete
// Middleware d'authentification pour sécuriser les routes de l'API
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces); 
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;