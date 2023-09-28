const userModel = require("../models/user.model")
const adminModel = require("../models/admin.model")
const reserveModel = require("../models/reserve.model")
const commentModel = require("../models/comment.model")
const randomUtil = require("../utils/random.util")
const emailUtil = require("../utils/email.util")
const jwtUtil = require("../utils/jwt.util")
const chatgptUtil = require("../utils/chatgpt.util")
const tourModel = require('../models/tour.model')
const {listPerPage} = require("../configs/general.config")


async function signUpPost(req, res, next) {

    try {
        let { name, email, phone, password } = req.body

        let foundEmail = await userModel.findOne({ email })

        let foundPhone = await userModel.findOne({ phone })

        if (foundEmail) {
            res.json({ status: false, message: "این ایمیل ثبت شده است ایمیل جدید وارد کنید" })
            return
        }

        if (foundPhone) {
            res.json({ status: false, message: "این شماره تلفن ثبت شده است شماره تلفن جدید وارد کنید" })
            return
        }

        let user = userModel({
            name, email, phone, password
        })

        await user.save()
        let message = "حالا می توانید وارد حساب خود شوید"
        // res.redirect(302,'/user/login')
        res.json({ status: true, message, redirect: '/user/user_login.html' })




    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}




async function loginPost(req, res, next) {
    try {
        let { email, password } = req.body

        let user = await userModel.findOne({ email, password })

        if (!user) {
            res.json({ status: false, message: "کاربری با این مشخصات یافت نشد" })
            return
        }

        let message = "با موفقیت وارد شدید"
        let payload = { _id: user._id, email: user.email, role: "user" }
        let role = "user"
        const token = jwtUtil.generateToken(payload)



        res.cookie('token', token, { httpOnly: true })
        res.cookie("name", user.name, {})
        res.cookie("phone", user.phone, {})
        res.cookie("email", user.email, {})
        res.cookie("role", role, {})

        res.json({ status: true, message, redirect: '/' })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}


async function forgetPasswordPost(req, res, next) {
    try {
        let { email } = req.body
        let user = await userModel.findOne({ email })

        if (!user) {
            res.json({ status: false, message: "کاربری با این مشخصات یافت نشد" })
            return
        }

        let new_password = randomUtil.generateRandomPassword()

        user.password = new_password
        await user.save()

        let emailContent = `رمز جدید شما: ${new_password}`

        await emailUtil.sendEmail({
            from: "safarnak.bot",
            to: user.email,
            subject: "ارسال ایمیل جدید",
            text: emailContent,
            html: emailContent
        })

        let message = "رمز جدید شما به ایمیل شما ارسال شد"
        res.json({ status: true, message })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function changePasswordPost(req, res, next) {
    try {
        let userId = req.payload._id
        let { currentPassword, newPassword, confirmPassword } = req.body
        let user = await userModel.findOne({ _id: userId })

        if (!user) {
            res.json({ status: false, message: "کاربری با این مشخصات یافت نشد" })
            return
        }

        if (newPassword != confirmPassword) {
            res.json({ status: false, message: "رمز عبور جدید با تکرار رمز عبور یکسان نیست" })
            return
        }

        if (user.password != currentPassword) {
            res.json({ status: false, message: "رمز عبور فعلی درست نیست" })
            return
        }

        user.password = newPassword
        await user.save()

        let message = "رمز عبور شما با موفقیت تغییر کرد"
        res.json({ status: true, message })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function editProfilePost(req, res, next) {
    try {
        let userId = req.payload._id
        let user = await userModel.findOne({ _id: userId })

        if (!user) {
            res.json({ status: false, message: "کاربری با این مشخصات یافت نشد" })
            return
        }

        let { name, email, phone } = req.body
        user.name = name
        user.email = email
        user.phone = phone
        await user.save()

        res.cookie("name", user.name, {})
        res.cookie("phone", user.phone, {})
        res.cookie("email", user.email, {})

        let message = " پروفایل با موفقیت تغییر کرد"
        res.json({ status: true, message })


    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function getTourList(req, res, next) {
    try {
        let tours
        let {filter,maxPrice,minPrice,passenger} = req.body
        filter = filter.replace(/\s/g, '')
        let query = {}
        if(!maxPrice){
            maxPrice = 1000000000
        }
        if(!minPrice){
            minPrice = 0
        }
        if(!passenger){
            passenger = 1
        }
        if(filter != 'همه'){
            query.tags = {$in:[filter]}
        }
        
        maxPrice = Number(maxPrice)
        minPrice = Number(minPrice)
        passenger = Number(passenger)
        query.price = {$gte:minPrice,$lte:maxPrice}        
        tours = await tourModel.find(query).lean()

        for (let tour of tours) {
            let tourReserved = await reserveModel.count({ tourId: tour._id, status: 'SCCESSFFULL_PAYMENT' })
            tour.tourReserved = tourReserved
        }
        tours = tours.filter(tour => tour.max_ticket >= tour.tourReserved + passenger)

        let message = "با موفقیت انجام شد"
        res.json({ status: true, tours, message })


    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function getReserveListPost(req, res, next) {
    try {

        let id = req.payload._id
        // let user = await userModel.findOne({ _id: userId })

        let { page } = req.body

        if (!page) {
            page = 1
        }

        let per_page = listPerPage
        let reserves = await reserveModel.find({ userId: id }).populate('user').populate('tour').skip((page - 1) * per_page).limit(per_page).exec()
        let max_page = Math.ceil((await reserveModel.count()) / per_page)
        let message = "با موفقیت انتخاب شد"

        res.json({ status: true, message, per_page, page, max_page, reserves })


    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function getTour(req, res, next) {
    try {
        let { _id } = req.body

        let tour = await tourModel.findById({ _id: _id })
        let comments = await commentModel.find({tourId:tour._id , review :true}).populate('user')
        let message = 'تور پیدا شد :)'
        res.json({ status: true, message, tour ,comments })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}


async function contactUs(req, res, next) {
    try {
        let { name, email, subject, message } = req.body

        let new_line = "\n\xA0"

        let mymessage = `
        پیغامی از طرف ${name} ${new_line}
        ${email} با ایمیل ${new_line}
        با موضوع  ${subject} ${new_line}
        با محتوای زیر دریافت کردید ${new_line}
        ${message}  
        `

        let admins = await adminModel.find()
        for (let admin of admins) {
            await emailUtil.sendEmail({
                from: "safarnak.bot",
                to: admin.email,
                subject: subject,
                text: mymessage
            })
        }

        res.json({ status: true, message: "با موفقیت پیام شما ارسال شد" })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function searchTour (req,res,next){
    try{

        let {search} = req.body
        let tours = await tourModel.find().lean()

        let result = await chatgptUtil.search(search,tours)

        res.json({ status: true, message: "با موفقیت جستجو شد" ,tours:result})

    }catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

module.exports = {
    loginPost,
    signUpPost,
    forgetPasswordPost,
    changePasswordPost,
    editProfilePost,
    getTourList,
    getTour,
    contactUs,
    getReserveListPost,
    searchTour
}