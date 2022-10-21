const http= require('http');
const express= require('express');

const app= express();

/*app.use('/', (req, res, next)=>{
    console.log('first middleware');
    next();//go to the next middleware
});

app.use('/', (req, res, next)=>{
    return res;
});*/

app.use('/users', (req, res, next)=>{
    console.log('first middleware dummy');
    next();//go to the next middleware
});

app.use('/', (req, res, next)=>{
    res.send('<h2>Completed!!</h2>')
});

app.listen(3000);