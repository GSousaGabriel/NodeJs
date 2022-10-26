const express= require('express');

const router= express.Router();
const adminData= require('./admin');

router.get('/', (req, res, next)=>{
    const allUsers= adminData.users;
    res.render('all-users', {pageTitle: 'Users', users: allUsers, path: 'list'});
});

module.exports= router;