const mongoose = require('mongoose')

const { Schema } = mongoose

const commentSchema = new Schema({
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
    text:{
        type:String,
        required:true
    },
    stars:{
        type:Number,
        required:true
    },
    review:{
        type:Boolean,
        default:false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

commentSchema.virtual('user', {
    justOne: true,
    ref: 'users',
    localField: 'userId',
    foreignField: '_id'
})

commentSchema.virtual('tour', {
    justOne: true,
    ref: 'tours',
    localField: 'tourId',
    foreignField: '_id'
})


const commentModel = mongoose.model('comments', commentSchema)


module.exports = commentModel
