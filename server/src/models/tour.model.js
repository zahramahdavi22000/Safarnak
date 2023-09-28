const mongoose = require('mongoose')
const { Schema } = mongoose

const tourSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            // unique:true
        },
        summary: String,
        description: String,
        price: {
            type: Number,
            required: true
        },
        max_ticket: {
            type: Number,
            required: true
        },
        photo: {
            type: String,
            required: true,
            // unique:true
        },
        images :{
            type:[String],
            default:[]
        },
        tags: {
            type: [String],
            default: []
        }
        // poster: {
        //     type: String,
        //     required: true,
        //     // unique:true
        // },
    }
)


const tourModel = mongoose.model('tours', tourSchema)

module.exports = tourModel