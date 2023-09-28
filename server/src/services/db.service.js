const mongoose = require("mongoose")
const dbConfig = require('../configs/db.config')

function init() {
    // mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`)
    mongoose.connect(dbConfig.db)
}


module.exports = { init }