const axios = require('axios')
const qs = require('qs')

const main_url = "https://safarnak.iran.liara.run"

function generateRandomNumber(minm = 100000, maxm = 999999) {
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm
}

function generateRandomName() {
    return "random_name_" + generateRandomNumber()
}

function generateRandomPhone() {
    return "0918" + generateRandomNumber(1000000, 9999999)
}

function generateRandomPassword() {
    return "random_password_" + generateRandomNumber()
}

function generateRandomEmail() {
    return "random_email_" + generateRandomNumber() + "@gmail.com"
}

async function testUserEntery() {

    let user = {
        'name': generateRandomName(),
        'phone': generateRandomPhone(),
        'password': generateRandomPassword(),
        'email': generateRandomEmail()
    }

    let signup_data = qs.stringify(user)
    let signup_config = {
        method: 'post',
        url: main_url + "/user/sign_up",
        data: signup_data
    }

    const signup_response = await axios(signup_config)

    if (!signup_response.data.status) {
        console.error("testUserEntery",
            "sign up error", signup_response.data.message)
        return
    }

    console.log("testUserEntery", "sign up ok")


    let login_data = qs.stringify(user)
    let login_config = {
        method: 'post',
        url: main_url + "/user/login",
        data: login_data
    }

    const login_response = await axios(login_config)

    if (!login_response.data.status) {
        console.error("testUserEntery",
            "login error", login_response.data.message)
        return
    }

    console.log("testUserEntery", "login ok")

}

function runTest() {
    testUserEntery()
}

runTest()