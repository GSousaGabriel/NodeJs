const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const csrf= require('csurf')
const flash= require('connect-flash')

const errorController = require('./controllers/error')
const app = express()
const mongoUrl = 'mongodb+srv://admin:admin@nodepractice.lok4ozc.mongodb.net/shopp'
const User = require('./models/user')
const store = new MongoDbStore({
  uri: mongoUrl,
  collection: "sessions"
})
const csrfProtection= csrf()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const loginRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const isAuth = require('./middlewares/is-auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user
        next()
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    next()
  }
})

app.use((req, res, next) => {
  res.locals.csrfToken= req.csrfToken()
  next()
})

app.use(loginRoutes)
app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(isAuth, errorController.get404)

mongoose.connect(mongoUrl)
  .then(result => {
    app.listen(3000)
  })
  .catch(error => {
    console.log(error)
  })