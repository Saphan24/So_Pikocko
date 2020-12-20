const multer = require('multer');

const MIME_TYPES = { // Dictionnaire qui accepte tous types d'images
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// Lieu d'enregistrement et nom du fichier
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image'); // On explique à multer que c'est un fichier image uniquement 