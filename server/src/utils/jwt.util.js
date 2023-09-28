const jwt = require('jsonwebtoken')
const refreshTokenSecret = "12345678"

function generateToken(payload) {
    const token = jwt.sign(payload, refreshTokenSecret)
    return token
}

function verifyToken(token) {
    try {
        let payload = jwt.verify(token, refreshTokenSecret)
        return payload
    } catch (err) {
        // if (err) console.error(err)
        return false
    }
}

module.exports = {
    generateToken,
    verifyToken
}