const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // package mongoose-unique-validator 

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true}
});

// Plugin qui restreint des utilisateurs à utiliser la même adresse mail 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);