// require("./src/services/db.service")
const adminModel = require("./src/models/admin.model")

async function migrate() {
    const adminCount = await adminModel.count({})   

    if (adminCount == 0) {
        admin = adminModel({
            email: 'admin@gmail.com',
            password: 'admin',
        })

        await admin.save()
    }
}

module.exports = {
    migrate
}