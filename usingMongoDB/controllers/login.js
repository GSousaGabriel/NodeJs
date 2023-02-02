const User = require('../models/user')

exports.getIndex = (req, res, next) => {
    res.render('general/index', {
      pageTitle: 'Login',
      path: '/'
    });
  };
  
  exports.postLogin = (req, res, next) => {
    let username= req.body.username
    let pass= req.body.pass

    User.findOne(username)
      .then(user => {
        if(user.length=== 0){
            let user= new User(username, pass)
            return user.save()
        }
        return user
      })
      .then(user=>{
        req.user= user
        res.redirect('/products');
      })
      .catch(error => {
        console.log(error)
      });
  };