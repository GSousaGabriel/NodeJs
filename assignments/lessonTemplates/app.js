const path= require('path');
const express= require('express');
const bodyParser= require('body-parser');

const adminData= require('./routes/admin');
const usersRoutes= require('./routes/users');

const app= express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(usersRoutes);

app.use((req, res, next)=>{
    res.status(404).render('404', {pageTitle: 'Error'});
});

app.listen(3000);