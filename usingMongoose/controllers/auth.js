const User = require('../models/user')
const crypt = require('bcryptjs')

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
          })
          .catch(error => {
            console.log(error)
          });
      }else{
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
  let user= ''

  User.findOne({ email })
    .then(userTry => {
      if(userTry){
        user= userTry
        return crypt.compare(req.body.pass, userTry.pass)
      }
    })
    .then(isCorrect => {
      if (!isCorrect) {
        req.flash('error', 'Invalid email or password')
        res.redirect('/');
      }else{
        req.session.user = user
        res.redirect('/products');
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