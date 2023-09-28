const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    }

})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel
