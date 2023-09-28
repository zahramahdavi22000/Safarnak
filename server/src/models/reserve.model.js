const mongoose = require('mongoose')

const { Schema } = mongoose

const reserveSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    tourId: {
        type: Schema.Types.ObjectId,
        ref: 'tours',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['WAIT_FOR_PAYMENT', 'SCCESSFFULL_PAYMENT', 'FAIL_PAYMENT'],
        required: true
    },
    paymentCode: {
        type: String
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

reserveSchema.virtual('user', {
    justOne: true,
    ref: 'users',
    localField: 'userId',
    foreignField: '_id'
})

reserveSchema.virtual('tour', {
    justOne: true,
    ref: 'tours',
    localField: 'tourId',
    foreignField: '_id'
})


const reserveModel = mongoose.model('reserves', reserveSchema)


module.exports = reserveModel
