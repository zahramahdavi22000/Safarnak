const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authUserMiddleware = require('../middlewares/auth_user.middleware')

router.post('/sign_up', userController.signUpPost)
router.post('/login', userController.loginPost)
router.post('/forget_password', userController.forgetPasswordPost)
router.post('/change_password', authUserMiddleware.authUser, userController.changePasswordPost)
router.post('/edit_profile', authUserMiddleware.authUser, userController.editProfilePost)
router.post('/reserve/list', authUserMiddleware.authUser, userController.getReserveListPost)
router.post('/contact', userController.contactUs)
router.post('/search',userController.searchTour)

// site routes
router.post('/tour/list', userController.getTourList)
router.post('/tour/get', userController.getTour)






module.exports = router




