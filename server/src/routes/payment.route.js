const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/payment.controller')
const authUserMiddleware = require('../middlewares/auth_user.middleware')




router.post('/check', authUserMiddleware.authUser, paymentController.checkPayment)
router.get('/verify', authUserMiddleware.authUser, paymentController.verifyPayment)





module.exports = router