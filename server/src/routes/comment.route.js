const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment.controller')
const authUserMiddleware = require('../middlewares/auth_user.middleware')
const authAdminMiddleware = require('../middlewares/auth_admin.middleware')



router.post('/send', authUserMiddleware.authUser ,commentController.sendComment)
router.post('/review',authAdminMiddleware.authAdmin,commentController.reviewComment)
router.post('/list',authAdminMiddleware.authAdmin,commentController.getCommentsPost)


module.exports = router