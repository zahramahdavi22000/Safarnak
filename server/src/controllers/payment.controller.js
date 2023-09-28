const axios = require('axios')
const qs = require('qs')
const tourModel = require("../models/tour.model")
const reserveModel = require("../models/reserve.model")
const { api_key, callback_uri } = require("../configs/payment.config")


async function checkPayment(req, res, next) {

  ///// make a reserve document in database //////
  try {
    const { tourId, quantity } = req.body
    let userId = req.payload._id
    let tour = await tourModel.findById({ _id: tourId })
    let price = tour.price
    let totalPrice = price * quantity


    let tourReserved = await reserveModel.count({ tourId: tour._id, status: 'SCCESSFFULL_PAYMENT' })
    if (tourReserved + quantity > tour.max_ticket) {
      res.json({ status: false, message: "ظرفیت پر شده است" })
      return
    }
    let reserve = reserveModel({
      userId, tourId, quantity, price, totalPrice, status: 'WAIT_FOR_PAYMENT'
    })

    await reserve.save()

    //// make a Payment gateway ////////

    let data = qs.stringify({
      'api_key': api_key,
      'amount': totalPrice,
      'order_id': reserve._id + "",
      'callback_uri': callback_uri
    })
    let config = {
      method: 'post',
      url: 'https://nextpay.org/nx/gateway/token',
      data: data
    }



    const response = await axios(config)

    /////////// redirect user to Payment gateway /////////
    if (response.data.code == -1) {
      let URL = "https://nextpay.org/nx/gateway/payment/" + response.data.trans_id
      res.json({ status: true, redirect: URL })
    } else {
      console.log(response.data.code);
      console.log(response);
      res.json({ status: false, message: "مشکل در اتصال به درگاه پرداخت" })
      
    }


  } catch (err) {
    console.error(`Error`, err.message)
    res.json({ status: false, message: "خطا در سرور" })
  }

}

async function verifyPayment(req, res, next) {
  ///////////////// get request to nextpi and varify it ////////
  try {
    let { amount, trans_id } = req.query

    let data = qs.stringify({
      'api_key': api_key,
      'amount': amount,
      'trans_id': trans_id
    })

    let config = {
      method: 'post',
      url: 'https://nextpay.org/nx/gateway/verify',
      data: data
    }

    let response = await axios(config)


    response = response.data
    let { code, order_id, Shaparak_Ref_Id } = response



    let reserve = await reserveModel.findById({ _id: order_id })

    let status = code == 0 ? 'SCCESSFFULL_PAYMENT' : 'FAIL_PAYMENT'
    let statusPosition = code == 0 ? 'ok' : 'nok'
    let url = '/user/user_payment_result.html?status=' + statusPosition + '&code=' + Shaparak_Ref_Id

    reserve.status = status
    reserve.paymentCode = Shaparak_Ref_Id
    await reserve.save()
    res.redirect(url)

  } catch (err) {
    console.error(`Error`, err.message)
    res.json({ status: false, message: "خطا در سرور" })
  }

}

module.exports = {
  checkPayment,
  verifyPayment
}