const jwtUtil = require("../utils/jwt.util")

function authAdmin(req, res, next) {
    const token = req.cookies.token
    const payload = jwtUtil.verifyToken(token)

    if (!payload || payload.role != "admin") {
        let message = "لطفا ابتدا وارد حساب کاربری خود شوید"
        
        let cookie = req.cookies;
        for (let prop in cookie) {
            if (!cookie.hasOwnProperty(prop)) {
                continue;
            }
            res.clearCookie(prop);
        }

        if(req.method == "POST"){
            res.json({ message, redirect: '/admin/admin_login.html' })
        }else{
            res.redirect(307,'/admin/admin_login.html')
        }
       
        return
    }

    req.payload = payload
    next()
}

module.exports = {
    authAdmin
}