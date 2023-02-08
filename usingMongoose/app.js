const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose= require('mongoose')

const errorController = require('./controllers/error')
const app = express()
const User = require('./models/user')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const loginRoutes = require('./routes/login')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next)=>{
  User.find({name:'Gabriel'})
  .then(user=>{
    if(user.length>0){
      req.user= user[0]
      next()
    }
  })
  .catch(error => {
  console.log(error)
  })
})

app.use(loginRoutes)

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect('mongodb+srv://admin:admin@nodepractice.lok4ozc.mongodb.net/shopp')
.then(result=>{
  User.find({name:'Gabriel'})
  .then(user=>{
    if(user.length===0){
      const user= new User({
        name: 'Gabriel',
        email: 'test@gmail.com',
        cart:{
          items:[]
        }
      })
      user.save()
    }
  })
  app.listen(3000)
})
.catch(error => {
  console.log(error)
})