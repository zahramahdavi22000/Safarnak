const jwtUtil = require("../utils/jwt.util")

function authUser(req, res, next) {
    const token = req.cookies.token
    const payload = jwtUtil.verifyToken(token)

    if (!payload || payload.role != "user") {

        let message = "لطفا ابتدا وارد حساب کاربری خود شوید"
     
        let cookie = req.cookies;
        for (let prop in cookie) {
            if (!cookie.hasOwnProperty(prop)) {
                continue;
            }
            res.clearCookie(prop);
        }
      

        if (req.method == "POST") {
            res.json({ message, redirect: '/user/user_login.html' })
        } else {
            res.redirect(307, '/user/user_login.html')
        }


        return
    }

    req.payload = payload
    next()
}

module.exports = {
    authUser
}