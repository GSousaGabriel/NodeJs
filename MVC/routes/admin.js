const express= require('express');
const productsController= require('../controller/products');

const router= express.Router();

router.get('/add-product', productsController.getAddProduct);

router.post('/product', productsController.postProduct);

module.exports= router;