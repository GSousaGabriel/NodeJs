const path= require('path');
const express= require('express');
const rootDir= require('../util/path');

const router= express.Router();
const adminData= require('./admin');

router.get('/', (req, res, next)=>{
    const prods= adminData.products;
    res.render('shop', {products: prods, docTitle: 'My shop'});
});

module.exports= router;