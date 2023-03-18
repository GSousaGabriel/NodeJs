const express = require("express")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const {graphqlHTTP}= require('express-graphql')
const graphqlSchema= require('./graphql/schema')
const graphqlResolvers= require('./graphql/resolvers')
const auth= require('./middlewares/is-auth')

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
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    if(req.method==="OPTIONS"){
        return res.sendStatus(200)
    }
    next()
})

app.use(auth)

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    formatError(error){
        if(!error.originalError){
            return error
        }
        const data= error.originalError.data
        const message= error.message || 'An errror ocurred'
        const status= error.originalError.code || 500
        return {message, status, data}
    }
})
)

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
    })
    .catch(error => {
        console.log(error)
    })