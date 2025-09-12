const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const {generateToken} = require('../service/authentication');


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '/public/images/default.png',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }

}, { timestamps: true })



userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    const salt = randomBytes(16).toString('hex');
    const hashedpassword = createHmac("sha256", salt)
        .update(this.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedpassword;
    next();
});


userSchema.methods.matchPasswordAndGenerateToken = async function (password) {

    if (!this.salt || !this.password) {
        throw new Error("Missing salt or password on user document");
    }

    const userProvidedPass = createHmac("sha256", this.salt)
        .update(password)
        .digest("hex");

    if (userProvidedPass !== this.password) throw new Error('Password does not match');
    const token = generateToken(this);
    return token
}

const User = mongoose.model('user', userSchema);

module.exports = User;

