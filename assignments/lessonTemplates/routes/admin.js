const express= require('express');

const router= express.Router();
const allUsers= [];

router.get('/new-user', (req, res, next)=>{
    res.render('new-user', {pageTitle: 'Register user', path: 'admin/new-user'});
});

router.post('/new-user', (req, res, next)=>{
    allUsers.push({username: req.body.username});
    res.redirect('/');
});

exports.routes= router;
exports.users= allUsers;