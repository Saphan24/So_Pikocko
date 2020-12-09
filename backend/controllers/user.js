const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => { // Pour l'enregistrement de nouveaux utilisateurs
    bcrypt.hash(req.body.password, 10) // Cryptage du password
        .then(hash => {
            const user = new User({ // création d'un nouveau user avec password crypté
                email: req.body.email,
                password: hash
            });
            user.save() // Enregistrement de l'utilisateur dans la base de donnée
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
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
                    token: jwt.sign(
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

