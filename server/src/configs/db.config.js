const env = process.env
const db = env.DB || "mongodb://127.0.0.1:27017/safarnak"
module.exports = { db }
