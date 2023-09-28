const express = require('express')
const multer = require('multer')

const adminController = require('../controllers/admin.controller')
const authAdminMiddleware = require('../middlewares/auth_admin.middleware')//
const router = express.Router()
const upload = multer({ dest: './src/public/uploads/' })

const uploadPosterAndPhoto = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'poster', maxCount: 1 }])
const uploadImage = upload.fields([{ name: 'imageFile', maxCount: 1 }])
// const uploadPoster = upload.fields([{ name: 'poster', maxCount: 1 }])
const uploadPhoto = upload.fields([{ name: 'photo', maxCount: 1 }])


router.post('/login', adminController.loginPost)
router.post('/forget_password', adminController.forgetPasswordPost)
router.post('/change_password', authAdminMiddleware.authAdmin, adminController.changePasswordPost)
router.post('/user/list', authAdminMiddleware.authAdmin, adminController.getUserListPost)
router.post('/tour/list', authAdminMiddleware.authAdmin, adminController.getTourListPost)
router.post('/reserve/list', authAdminMiddleware.authAdmin, adminController.getReserveListPost)
router.post('/tour/add', authAdminMiddleware.authAdmin, uploadPosterAndPhoto, adminController.addTourPost)
router.post('/tour/edit', authAdminMiddleware.authAdmin, adminController.editTourPost)
router.post('/tour/editPhoto', authAdminMiddleware.authAdmin, uploadPhoto, adminController.editTourPhoto)
// router.post('/tour/editPoster', authAdminMiddleware.authAdmin, uploadPoster, adminController.editTourPoster)
router.post('/tour/delete', authAdminMiddleware.authAdmin, adminController.deleteTour)
router.post('/tour/image/list', authAdminMiddleware.authAdmin,adminController.getImageListPost)
router.post('/tour/image/upload', authAdminMiddleware.authAdmin,uploadImage,adminController.uploadImage)
router.post('/tour/image/delete', authAdminMiddleware.authAdmin,adminController.deleteImage)


// router.post()

router.get('/',authAdminMiddleware.authAdmin, function (req, res) {

    res.redirect(307, '/admin/admin_tour_list.html')

})


module.exports = router
