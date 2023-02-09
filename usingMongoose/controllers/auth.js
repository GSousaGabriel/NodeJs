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

exports.getRegister = (req, res, next) => {
  res.render('general/register', {
    pageTitle: 'Register',
    path: '/register',
    message: req.flash('error')
  });
};

exports.postRegister = (req, res, next) => {
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length > 0) {
        return user
      }
      return crypt.hash(req.body.pass, 12)
    })
    .then(data => {
      if (typeof data === 'string') {
        let newUser = new User({ name: req.body.username, email: req.body.email, pass: data })
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
          });
      } else {
        req.flash('error', 'email already registered!')
        res.redirect('/register')
      }
    })
    .catch(error => {
      console.log(error)
    });
};

exports.getIndex = (req, res, next) => {
  res.render('general/index', {
    pageTitle: 'Login',
    path: '/',
    message: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  let email = req.body.email
  let user = ''

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
        res.redirect('/');
      } else {
        req.session.user = user
        res.redirect('/products');
      }
    })
    .catch(error => {
      console.log(error)
    });
};

exports.getRecover = (req, res, next) => {
  res.render('general/recover', {
    pageTitle: 'Recover',
    path: '/recover',
    message: req.flash('error')
  });
};

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
        .then(user=>{
          res.redirect('/')

          return transporter.sendMail({
            to: req.body.email,
            from: 'pasteu008@gmail.com',
            subject: "Reset pass!",
            html: `<h1> here it is your token to reset the pass!</h1><br><p>click <a href="http://localhost:3000/reset/${token}">here</a> to reset your pass</p>`
          })
        })
        .catch(error => {
          console.log(error)
        });
    }
  })
};

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
      });
    })
    .catch(error => {
      console.log(error)
    });
};

exports.postReset = (req, res, next) => {
  let userId = req.body.userId
  let resetToken = req.body.resetToken
  crypt.hash(req.body.pass, 12)
    .then(pass => {
      return User.updateOne({ _id: userId, resetTokenExp:{$gt: Date.now()}, resetToken }, { pass, resetToken: null, resetTokenExp: null })
    })
    .then(user => {
        res.redirect('/')
    })
    .catch(error => {
      console.log(error)
    });
};

exports.postRegister = (req, res, next) => {
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length > 0) {
        return user
      }
      return crypt.hash(req.body.pass, 12)
    })
    .then(data => {
      if (typeof data === 'string') {
        let newUser = new User({ name: req.body.username, email: req.body.email, pass: data })
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
          });
      } else {
        req.flash('error', 'email already registered!')
        res.redirect('/register')
      }
    })
    .catch(error => {
      console.log(error)
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
};