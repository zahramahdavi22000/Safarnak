function generateRandomPassword() {
    let minm = 100000
    let maxm = 999999
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm
}

function testGenerateRandomPassword() {
    let password = generateRandomPassword()

    if (String(password).length != 6) {
        console.error("testGenerateRandomPassword",
            "password length error - it is not 6 digit")
        return
    }

    if (password < 100000) {
        console.error("testGenerateRandomPassword",
            "password value error - it is smaller than 100000")
        return
    }

    if (password > 999999) {
        console.error("testGenerateRandomPassword",
            "password value error - it is grater than 999999")
        return
    }

    console.log("testGenerateRandomPassword", "ok")
}

function tourHaveSpace(quantity, tourReserved, maxTicket) {
    let hsveSpace = tourReserved + quantity <= maxTicket
    return hsveSpace
}

function testTourHaveSpace() {

    if (tourHaveSpace(100, 100, 100) != false) {
        console.error("testTourHaveSpace", "logic error - this tour have not free space")
        return
    }

    if (!tourHaveSpace(100, 0, 100) != true) {
        console.error("testTourHaveSpace", "logic error - this tour have free space")
        return
    }

    console.log("testTourHaveSpace", "ok")
}

function runTests() {
    testGenerateRandomPassword()
    testTourHaveSpace()
}

runTests()