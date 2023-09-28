const mongoose = require('mongoose')
const { Schema } = mongoose

const adminSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

})

const adminModel = mongoose.model('admins', adminSchema)

module.exports = adminModel