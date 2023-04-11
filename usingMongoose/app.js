const path = require('path')
const fs= require('fs')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer= require('multer')
const helmet= require('helmet')
const compression= require('compression')
const morgan= require('morgan')
require('dotenv').config()

const errorController = require('./controllers/error')
const app = express()
const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@store.cqu3smq.mongodb.net/${process.env.MONGO_DB}`
const User = require('./models/user')
const store = new MongoDbStore({
  uri: mongoUrl,
  collection: "sessions"
})
const csrfProtection = csrf()
const fileStorage= multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "usingMongoose/images")
  },
  filename:(req, file, cb)=>{
    cb(null, file.originalname)
  }
})
const fileFilter= (req, file, cb)=>{
  if(file.mimetype.includes('image')){
    cb(null, true)
  }else{
    cb(null, false)
  }
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const loginRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const isAuth = require('./middlewares/is-auth')

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags: 'a'}
)

app.use(helmet())
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/usingMongoose/images', express.static(path.join(__dirname, 'images')))
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.get('/505', errorController.get500)

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user
        next()
      })
      .catch(error => {
        next(new Error(error))
      })
  } else {
    next()
  }
})

app.use(loginRoutes)
app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(isAuth, errorController.get404)

app.use((error, req, res, next) => {
  console.log(error)
  res.redirect('/500')
})

mongoose.connect(mongoUrl)
  .then(result => {
    app.listen(process.env.MONGO_PORT|| 3000)
  })
  .catch(error => {
    console.log(error)
  })