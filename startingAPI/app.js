const express = require("express")
const feedRoutes = require("./routes/feed")
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use((res, req, next) => {
    req.setHeader('Access-Control-Allow-Origin', '*')
    req.setHeader('Access-Control-Allow-Methods', 'GET,POST')
    req.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use('/feed', feedRoutes)

app.listen(8080)