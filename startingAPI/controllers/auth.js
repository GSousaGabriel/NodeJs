const User = require("../models/user")
const { validationResult } = require('express-validator/check')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.loginUser = ((req, res, next) => {
    const userEmail = req.body.email
    const userPassword = req.body.password
    let loadedUser;

    User.findOne({ email: userEmail })
        .then(user => {
            if (!user) {
                const error = new Error('email Invalid!')
                error.statusCode = 401
                throw error
            }
            loadedUser = user
            return bcrypt.compare(userPassword, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('password Invalid!')
                error.statusCode = 401
                throw error
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
                'supermotherofjesussecret',
                {
                    expiresIn: '1h'
                }
            )
            res.status(200).json({ message: "success", token, userId: loadedUser._id.toString()})
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
})

exports.signup = ((req, res, next) => {
    const errors = validationResult(req)

    if (!errors) {
        const error = new Error("Validation failed!")
        error.statusCode = 422
        error.data = error.array()
        throw error
    }

    const email = req.body.email
    const name = req.body.name
    const password = req.body.password

    bcrypt.hash(password, 12)
        .then(hashedP => {
            const user = new User({ email, name, password: hashedP })
            return user.save()
        })
        .then(success => {
            res.status(200).json({ message: "success", userId: success._id })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
})