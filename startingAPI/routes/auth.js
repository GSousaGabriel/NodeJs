const express= require('express')
const { body }= require('express-validator/check')
const User= require("../models/user")
const authController= require('../controllers/auth')

const router= express.Router()

//auth
router.post('/login', authController.loginUser)

//create
router.put('/signup', [
    body('email').isEmail().withMessage('Enter a valid email!')
    .custom((value, {req})=>{
        return User.findOne({email: value})
        .then(userDoc=>{
            if(userDoc){
                return Promise.reject("User already exists!!")
            }
        })
    }),
    body('password').trim().isLength({min:5}),
    body('name').not().isEmpty()
], authController.signup)

module.exports= router