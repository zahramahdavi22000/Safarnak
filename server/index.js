//requires
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const DbService = require("./src/services/db.service")
const adminMigration = require('./admin.migration')
const adminRouter = require('./src/routes/admin.route')
const userRouter = require('./src/routes/user.route')
const paymentRouter = require('./src/routes/payment.route')
const commentRouter = require('./src/routes/comment.route')

const myLogger = require('./src/middlewares/logging.middleware')
const { port } = require("./src/configs/general.config")



//initialasations
DbService.init()

adminMigration.migrate()
const app = express()


// middlewares
app.use(myLogger.myLogger)

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(cookieParser())


// routers
app.use('/admin', adminRouter)

app.use('/user', userRouter)

app.use('/payment', paymentRouter)

app.use('/comment', commentRouter)

app.get('/', function (req, res) {
  res.redirect(307, '/index.html')
})

app.get('/tour/:id', function (req, res) {
  res.sendFile('src/public/user/user_tour_detail.html', { root: __dirname })
})




app.get('/exit', function (req, res) {
  
  let cookie = req.cookies;
  for (let prop in cookie) {
      if (!cookie.hasOwnProperty(prop)) {
          continue;
      }
      res.clearCookie(prop);
  }

  res.redirect(307, '/')
})



app.use(express.static(__dirname + '/src/public'))

app.use("*", (req, res, next) => res.status(404).sendFile('src/public/404.html', { root: __dirname }))



// app listiening
app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${port}`)
})




