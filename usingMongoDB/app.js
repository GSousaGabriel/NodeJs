const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const app = express();
const User = require('./models/user')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const loginRoutes = require('./routes/login');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(loginRoutes);

app.use((req, res, next) => {
  User.findOne('bielkiu')
    .then(user => {
      if (user.length === 0) {
        let user = new User(username, pass)
        return user.save()
      }
      return user
    })
    .then(user=>{
      req.user= new User(user[0]._id, user[0].pass, user[0].cart, user[0].orders)
      next()
    })
    .catch(error => {
      console.log(error)
    });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  console.log('success')
  app.listen(3000)
})