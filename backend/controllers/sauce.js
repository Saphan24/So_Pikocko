const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
        })
    })
    .catch(error => res.status(500).json({ error }));
    Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			switch (req.body.like) {
                case 0 : // Si l'utilisateur supprime un like ou un dislike
                    if (sauce.usersLiked.includes(req.body.userId)) { //Si l'utilisateur est présent dans le tableau like
                        /** Retire un like du tableau des usersLiked */
						Sauce.updateOne({_id: req.params.id}, { 
                            $inc: {likes: -1}, 
                            $pull: {usersLiked: req.body.userId}, 
                        })
							.then(() => res.status(201).json({ message: 'Like supprimé'}))
							.catch(error => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) { //Si l'utilisateur est présent dans le tableau dislike
						/** Retire un like du tableau des usersDisLiked */
						Sauce.updateOne({_id: req.params.id}, {
                            $inc: {dislikes: -1}, 
                            $pull: {usersDisliked: req.body.userId}, 
                        })
							.then(() => res.status(201).json({ message: 'Dislike supprimé'}))
							.catch(error => res.status(400).json({ error }));	
					}
				break;

				case 1 :  // Si l'utilisateur like la sauce
					if (!sauce.usersLiked.includes(req.body.userId)) { // Si l'utilisateur n'a pas déjà like la sauce
						/** Ajoute un like et envoie userId dans le tableau usersLiked */
						Sauce.updateOne({ _id: req.params.id }, {
                            $inc: {likes: 1}, 
                            $push: {usersLiked: req.body.userId}, 
                        })
							.then(() => res.status(210).json({ message: 'La sauce a été likée'}))
							.catch(error => res.status(400).json({ error }));
					}
				break;

				case -1 : // Si l'utilisateur dislike la sauce
					if (!sauce.usersDisliked.includes(req.body.userId)) { //Si l'utilisateur n'a pas déjà like la sauce
						/** Ajoute un dislike et envoie userId dans le tableau usersDisLiked */
						Sauce.updateOne({ _id: req.params.id }, {
                            $inc: {dislikes: 1}, 
                            $push: {usersDisliked: req.body.userId}, 
                        })
							.then(() => res.status(210).json({ message: 'La sauce a été likée'}))
							.catch(error => res.status(400).json({ error }));
					}
				break;

				default:
					console.error("Aïe aïe aïe, il y a un problème !");
			}
		})
		.catch(error => res.status(500).json({ error }));
};