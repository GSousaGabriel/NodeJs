const crypo = require('crypto')
const User = require('../models/user')
const crypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const transporter = nodeMailer.createTransport(sendGridTransport({
  auth: {
    api_key: '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'
  }
}))
const { validationResult } = require('express-validator/check')

exports.getRegister = (req, res, next) => {
  res.render('general/register', {
    pageTitle: 'Register',
    path: '/register',
    message: req.flash('error'),
    input: {username: '', email: '', pass: ''},
    errors: []
  })
}

exports.getIndex = (req, res, next) => {
  res.render('general/index', {
    pageTitle: 'Login',
    path: '/',
    message: req.flash('error'),
    input: {email: '', pass: ''},
    errors: []
  })
}

exports.postLogin = (req, res, next) => {
  let email = req.body.email
  let user = ''
  const errors= validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(422).render('general/index', {
      pageTitle: 'Login',
      path: '/',
      message: errors.errors[0].msg,
      input: {email: req.body.email, pass: req.body.pass},
      errors: errors.errors
    })
  } else {
    User.findOne({ email })
      .then(userTry => {
        if (userTry) {
          user = userTry
          return crypt.compare(req.body.pass, userTry.pass)
        }
      })
      .then(isCorrect => {
        if (!isCorrect) {
          req.flash('error', 'Invalid email or password')
          res.redirect('/')
        } else {
          req.session.user = user
          res.redirect('/products')
        }
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
  }
}

exports.getRecover = (req, res, next) => {
  res.render('general/recover', {
    pageTitle: 'Recover',
    path: '/recover',
    message: req.flash('error')
  })
}

exports.postRecover = (req, res, next) => {
  crypo.randomBytes(32, (err, buffer) => {
    if (err) {
      res.redirect('/recover')
    } else {
      const token = buffer.toString('hex')

      User.find({ email: req.body.email })
        .then(user => {
          if (user.length > 0) {
            user[0].resetToken = token
            user[0].resetTokenExp = Date.now() + 360000
            return user[0].save()
          } else {
            req.flash('error', 'email not found!')
            res.redirect('/recover')
          }
        })
        .then(user => {
          let email= req.body.email
          res.redirect('/')

          return transporter.sendMail({
            to: email,
            from: 'pasteu008@gmail.com',
            subject: "Reset pass!",
            html: `<h1> here it is your token to reset the pass!</h1><br><p>click <a href="http://localhost:3000/reset/${token}">here</a> to reset your pass</p>`
          })
        })
        .then(email=>{
          console.log(email)
        })
        .catch(error => {
          const errorReq= new Error(error)
          errorReq.httpStatusCode= 500
          return next(errorReq)
        })
    }
  })
}

exports.getReset = (req, res, next) => {
  const resetToken = req.params.token

  User.findOne({ resetToken, resetTokenExp: { $gt: Date.now() } })
    .then(user => {
      res.render('general/newPass', {
        pageTitle: 'Reset pass',
        path: '/reset',
        resetToken,
        userId: user._id.toString(),
        message: req.flash('error')
      })
    })
    .catch(error => {
      const errorReq= new Error(error)
      errorReq.httpStatusCode= 500
      return next(errorReq)
    })
}

exports.postReset = (req, res, next) => {
  let userId = req.body.userId
  let resetToken = req.body.resetToken
  crypt.hash(req.body.pass, 12)
    .then(pass => {
      return User.updateOne({ _id: userId, resetTokenExp: { $gt: Date.now() }, resetToken }, { pass, resetToken: null, resetTokenExp: null })
    })
    .then(user => {
      res.redirect('/')
    })
    .catch(error => {
      const errorReq= new Error(error)
      errorReq.httpStatusCode= 500
      return next(errorReq)
    })
}

exports.postRegister = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('general/register', {
      pageTitle: 'Register',
      path: '/register',
      message: errors.errors[0].msg,
      input: {username: req.body.username, email: req.body.email, pass: req.body.pass},
      errors: errors.errors
    })
  } else {
    crypt.hash(req.body.pass, 12)
      .then(data => {
        let newUser = new User({ name: req.body.username.trim(), email: req.body.email.trim(), pass: data.trim() })
        newUser.save()
          .then(data => {
            res.redirect('/')
            return transporter.sendMail({
              to: req.body.email,
              from: 'pasteu008@gmail.com',
              subject: "registered!",
              html: '<h1> Successfully signed!</h1>'
            })
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
  }
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}