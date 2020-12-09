const mongoose = require('mongoose');

// Modèle de données (Note de cadrage)
const sauceSchema = mongoose.Schema({
    
    // Modèle de données pour une sauce
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true }, 
    heat: { type: Number, required: true },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    
    // Modèle de données pour un utilisateur
    usersLiked: { type: Array, required: false },
    usersDisliked: { type: Array, required: false },
});

module.exports = mongoose.model('Sauce', sauceSchema);