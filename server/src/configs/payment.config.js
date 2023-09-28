const env = process.env
const callback_uri = env.callback_uri
const api_key = env.api_key

module.exports = { callback_uri, api_key }