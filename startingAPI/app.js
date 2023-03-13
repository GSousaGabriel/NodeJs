const express = require("express")
const feedRoutes = require("./routes/feed")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const app = express()
const fileStorage = multer.diskStorage({
    destination: ((req, file, cb) => {
        cb(null, 'startingAPI/images')
    }),
    filename: ((req, file, cb) => {
        cb(null, file.originalname)
    })
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes('image')) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const mongoUrl = 'mongodb+srv://pasteu008:123123456@store.cqu3smq.mongodb.net/messages'

app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))
app.use('/images', express.static(path.join(__dirname, '/images')))
app.use((res, req, next) => {
    req.setHeader('Access-Control-Allow-Origin', '*')
    req.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    req.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode
    const message = error.message
    const data = error.data
    res.status(status).json({ message , data})
})

mongoose.connect(mongoUrl)
    .then(success => {
        const server=app.listen(8080)
        const io = require('./socket').init(server);
        io.on('connection', socket => {
          console.log(socket.id);
        });
    })
    .catch(error => {
        console.log(error)
    })