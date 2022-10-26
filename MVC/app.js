const path= require('path');
const http= require('http');
const express= require('express');
const bodyParser= require('body-parser');

const adminRoutes= require('./routes/admin');
const shopRoutes= require('./routes/shop');
const productsController= require('./controller/errors');

const app= express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(productsController.errorPage);

app.listen(3000);