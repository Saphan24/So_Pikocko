const bcrypt = require('bcrypt'); //Package de chiffrement
const jwt = require('jsonwebtoken'); // Import du package de création et vérifications de tokens d'authentification
const User = require('../models/User');
const passwordValidator = require('password-validator');

// Création d'un schéma
var schema = new passwordValidator();
 
// Ajout des propriétés de passwordValidator
schema
.is().min(6)                                    //  Longueur minimale 6
.is().max(20)                                   //  Longueur maximale 20
.has().uppercase()                              //  Doit avoir des lettres majuscules
.has().lowercase()                              //  Doit avoir des lettres minuscules
.has().digits(2)                                //  Doit avoir au moins 2 chiffres
.has().not().spaces()                           //  Ne doit pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist de ces valeurs

exports.signup = (req, res, next) => { // Pour l'enregistrement de nouveaux utilisateurs
    if(!schema.validate(req.body.password)){
        console.error('Mot de passe non valide');
        return res.status(400).send('Mot de passe non valide');
    }
    bcrypt.hash(req.body.password, 10) // Cryptage du password avec un salt de 10
        .then(hash => {
            const user = new User({ // création d'un nouveau user avec password crypté
                email: req.body.email,
                password: hash
            });
            user.save() // Enregistrement de l'utilisateur dans la base de donnée
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // La promise renvoie une réponse de réussite avec un code 201
                .catch(error => res.status(400).json({ error })); // Le catch renvoie une erreur générée par mongoose code erreur 400
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => { // Pour connecter des utilisateurs existants
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) { // Si l'email n'est pas bon on renvoie une erreur!
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) // comparaison du mot de passe entré avec le mot de pass hash
             .then(valid => {
                if (!valid) { // Si mot de passe erroné on renvoie un erreur!
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign( // Encodage d'un nouveau token, chaîne secrète de développement aléatoire et durée de validité 24h
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h'}
                    )
                });
             })
             .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

