const path= require('path');
const express= require('express');

const router= express.Router();
const adminData= require('./admin');

router.get('/', (req, res, next)=>{
    const prods= adminData.products;
    res.render('shop', {products: prods, pageTitle: 'Shop', path:'/'});
});

module.exports= router;