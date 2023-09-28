const reserveModel = require("../models/reserve.model")
const commentModel = require("../models/comment.model")
const {listPerPage} = require("../configs/general.config")


async function sendComment(req, res, next) {
    try {
        const { text, stars, tourId } = req.body;
        const userId = req.payload._id;
        let reserve = await reserveModel.findOne({ tourId: tourId, userId: userId })

        if (!reserve) {
            res.json({ status: false, message: "تنها افرادی که تور را رزرو کرده اند می تواند نظر بگذارد!" })
            return
        }

        let comment = commentModel({ tourId, userId, text, stars })
        await comment.save()
        res.json({ status: true, message: "نظر شما پس از بررسی و تایید ادمین نمایش داده می شود" })



    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function getCommentsPost(req, res, next) {
    try {
        let { page } = req.body

        if (!page) {
            page = 1
        }

        let per_page = listPerPage

        let comments = await commentModel.find().populate('user').populate('tour').skip((page - 1) * per_page).limit(per_page).lean()
        let max_page = Math.ceil((await commentModel.count()) / per_page)
        let message = "با موفقیت انتخاب شد"

   
        res.json({ status: true, message, per_page, page, max_page, comments })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function reviewComment(req,res,next){
    try{
        const {commentId,review} = req.body
        let comment = await commentModel.findById({_id:commentId})
        comment.review = review;
        await comment.save()
        res.json({ status: true, message: "وضعیت کامنت با موفقیت اپدیت شد" })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}


module.exports = {
    sendComment,
    getCommentsPost,
    reviewComment
}