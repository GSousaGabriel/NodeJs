const express = require('express')
const authController = require('../controllers/auth')
const router = express.Router()
const { check, body } = require('express-validator/check')
const User = require('../models/user')


router.get('/register', authController.getRegister)

router.post('/register',
    [
        check('email').isEmail().withMessage('Invalid Email!').custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('forbitten email!')
            // } else {
            //     return true
            // }
            return User.find({ email: req.body.email })
                .then(user => {
                    if (user.length > 0) {
                        return Promise.reject('email already registered!')
                    }
                })
        }),
        body('pass', 'very wrong and general error').isLength({ min: 5, max: 50 }).isAlphanumeric()
    ], authController.postRegister)

router.get('/', authController.getIndex)

router.get('/login', authController.getIndex)

router.post('/login', [
    check('pass', 'wrong pass format!').isLength({min: 5, max:50}).isAlphanumeric(),
    body('email').isEmail().withMessage('wrong email format!')
], authController.postLogin)

router.post('/logout', authController.postLogout)

router.get('/recover', authController.getRecover)

router.post('/recover', authController.postRecover)

router.get('/reset/:token', authController.getReset)

router.post('/reset', authController.postReset)

module.exports = router