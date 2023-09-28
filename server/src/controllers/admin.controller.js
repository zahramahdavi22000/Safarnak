const adminModel = require("../models/admin.model")
const userModel = require("../models/user.model")
const tourModel = require("../models/tour.model")
const reserveModel = require("../models/reserve.model")
const randomUtil = require("../utils/random.util")
const emailUtil = require("../utils/email.util")
const jwtUtil = require("../utils/jwt.util")
const { listPerPage } = require("../configs/general.config")



async function loginPost(req, res, next) {
    try {
        let { email, password } = req.body

        let admin = await adminModel.findOne({ email, password })

        if (!admin) {
            res.json({ message: "مدیری با این مشخصات یافت نشد" })
            return
        }

        let message = "با موفقیت وارد شدید"
        let payload = { _id: admin._id, email: admin.email, role: "admin" }
        let name = admin.name
        let role = "admin"


        const token = jwtUtil.generateToken(payload)

        res.cookie('token', token, { httpOnly: true })
        res.cookie("name", name, {})
        res.cookie("role", role, {})
        res.json({ status: true, message, redirect: '/admin/admin_tour_list.html' })


    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function forgetPasswordPost(req, res, next) {
    try {
        let { email } = req.body
        let admin = await adminModel.findOne({ email })

        if (!admin) {
            res.json({ status: false, message: "مدیری با این مشخصات یافت نشد" })
            return
        }

        let new_password = randomUtil.generateRandomPassword()

        admin.password = new_password
        await admin.save()

        let emailContent = `رمز جدید شما: ${new_password}`

        emailUtil.sendEmail({
            from: "safarnak.bot",
            to: admin.email,
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
        let adminId = req.payload._id
        let { currentPassword, newPassword, confirmPassword } = req.body
        let admin = await adminModel.findOne({ _id: adminId })

        if (!admin) {
            res.json({ status: false, message: "مدیری با این مشخصات یافت نشد" })
            return
        }

        if (newPassword != confirmPassword) {
            res.json({ status: false, message: "رمز عبور جدید با تکرار رمز عبور یکسان نیست" })
            return
        }

        if (admin.password != currentPassword) {
            res.json({ status: false, message: "رمز عبور فعلی درست نیست" })
            return
        }

        admin.password = newPassword
        await admin.save()

        let message = "رمز عبور شما با موفقیت تغییر کرد"
        res.json({ status: true, message })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function getUserListPost(req, res, next) {
    try {
        let { page } = req.body

        if (!page) {
            page = 1
        }

        let per_page = listPerPage
        let users = await userModel.find().skip((page - 1) * per_page).limit(per_page)
        let max_page = Math.ceil((await userModel.count()) / per_page)
        let message = "با موفقیت انتخاب شد"

        res.json({ status: true, message, per_page, page, max_page, users })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}



async function getTourListPost(req, res, next) {
    try {
        let { page } = req.body

        if (!page) {
            page = 1
        }

        let per_page = listPerPage

        let tours = await tourModel.find().skip((page - 1) * per_page).limit(per_page).lean()
        let max_page = Math.ceil((await tourModel.count()) / per_page)
        let message = "با موفقیت انتخاب شد"

        for (let tour of tours) {
            let tourReserved = await reserveModel.count({ tourId: tour._id, status: 'SCCESSFFULL_PAYMENT' })
            tour.tourReserved = tourReserved
        }

        res.json({ status: true, message, per_page, page, max_page, tours })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}



async function getReserveListPost(req, res, next) {
    try {

        let { page } = req.body

        if (!page) {
            page = 1
        }

        let per_page = listPerPage
        let reserves = await reserveModel.find().populate('user').populate('tour').skip((page - 1) * per_page).limit(per_page).exec()
        let max_page = Math.ceil((await reserveModel.count()) / per_page)
        let message = "با موفقیت انتخاب شد"

        res.json({ status: true, message, per_page, page, max_page, reserves })


    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }

}

async function editTourPost(req, res, next) {
    try {
        // , title , summary , desccription , price , max_ticket



        let { _id, title, summary, description, price, tags, max_ticket } = req.body
        let tour = await tourModel.findById({ _id: _id })
        tags = tags.replace(/\s/g, '').split(",")
        tour.title = title
        tour.summary = summary
        tour.description = description
        tour.price = price
        tour.tags = tags
        tour.max_ticket = max_ticket

        await tour.save()

        let message = "تور با موفقیت ذخیره شد"

        res.json({ status: true, message, tour })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function editTourPhoto(req, res, next) {
    try {
        let { _id } = req.body

        let photo = "uploads" + req.files.photo[0].path.split("uploads")[1]
        let tour = await tourModel.findById({ _id: _id })
        tour.photo = photo
        await tour.save()
        let message = 'عکس تور با موفقیت  تغییر کرد'
        res.json({ status: true, message })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

// async function editTourPoster(req, res, next) { // later
//     try {
//         let { _id } = req.body

//         let poster = "uploads" + req.files.poster[0].path.split("uploads")[1]
//         let tour = await tourModel.findById({ _id: _id })
//         tour.poster = poster
//         await tour.save()
//         let message = 'پوستر تور با موفقیت  تغییر کرد'
//         res.json({ status: true, message })

//     } catch (err) {
//         console.error(`Error`, err.message)
//         res.json({ status: false, message: "خطا در سرور" })
//     }
// }


async function addTourPost(req, res, next) {
    try {

        let { title, summary, description, price, tags, max_ticket } = req.body
    
        let photo = "uploads" + req.files.photo[0].path.split("uploads")[1]
        tags = tags.replace(/\s/g, '').split(",")

        let tour = tourModel({
            title, summary, description, price, tags, max_ticket, photo
        })



        await tour.save()
        let message = "تور با موفقیت ذخیره شد"
        res.json({ status: true, message })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function deleteTour(req, res, next) {
    try {
        let { _id } = req.body
        await tourModel.findByIdAndRemove({ _id })
        await reserveModel.deleteMany({ tourId: _id })
        let message = 'تور با موفقیت حذف شد'
        res.json({ status: true, message })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}


async function getImageListPost(req, res, next) {
    try {
        let { tourId } = req.body
        let tour = await tourModel.findById({ _id: tourId })
        let images = tour.images
        res.json({ status: true, images })

    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function uploadImage(req, res, next) {
    try {
        let { tourId } = req.body        
        let imageFile = "uploads" + req.files.imageFile[0].path.split("uploads")[1]
        let tour = await tourModel.findById({ _id: tourId })
        console.log(tour)
        tour.images.push(imageFile)
        console.log(tour.images)
        await tour.save()
        let message = 'تصویر تور با موفقیت  تغییر کرد'
        res.json({ status: true, message })   
    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}

async function deleteImage(req, res, next) {
    try {
        let { tourId, image } = req.body
        console.log(tourId,image)
        let tour = await tourModel.findById({ _id: tourId })
        // let images = tour.images
        tour.images = tour.images.filter(img => img != image)
        await tour.save()
        let message = 'تصویر تور با موفقیت حذف شد'
        res.json({ status: true, images:tour.images ,message})
      
    } catch (err) {
        console.error(`Error`, err.message)
        res.json({ status: false, message: "خطا در سرور" })
    }
}




module.exports = {
    loginPost,
    forgetPasswordPost,
    changePasswordPost,
    getUserListPost,
    getTourListPost,
    editTourPost,
    addTourPost,
    editTourPhoto,
    // editTourPoster,
    deleteTour,
    getReserveListPost,
    getImageListPost,
    uploadImage,
    deleteImage
}


