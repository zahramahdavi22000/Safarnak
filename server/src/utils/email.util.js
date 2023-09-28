const nodeMailer = require('nodemailer')

const smtpServer = {
    "service": "gmail",
    "host": "smtp.gmail.com",
    "auth": {
        "user": "sfarnaksafar",
        "pass": "wtwnvilvzplajkfj"
    }
}

const MailerConfigur = nodeMailer.createTransport(smtpServer)


async function sendEmail(mailOptions) {

    let emailText = mailOptions.text
    let emailHtml = mailOptions.html

    const mail_content = {
        from: '"' + mailOptions.from + `" <${smtpServer.auth.user}>`,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: emailText,
        html: emailHtml
    }

    MailerConfigur.sendMail(mail_content, function (err, info) {
        if (err) console.error("error in Send Message In Email : ", err)
    })

}

module.exports = { sendEmail }