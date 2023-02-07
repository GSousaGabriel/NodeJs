const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/login', shopController.getIndex);

router.post('/login', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.post('/delete-order-item', shopController.deleteItemOrder);

// router.get('/checkout', shopController.getCheckout);

router.post('/create-order', shopController.postOrder);

module.exports = router;
