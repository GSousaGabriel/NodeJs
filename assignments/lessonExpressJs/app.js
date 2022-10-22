const path= require('path');
const express= require('express');
const bodyParser= require('body-parser');

const userRoutes= require('./routes/users');

const app= express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', userRoutes);

app.use((req, res, next)=>{
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.listen(3000);