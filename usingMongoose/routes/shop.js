const path = require('path')
const isAuth= require('../middlewares/is-auth')
const express = require('express')
const shopController = require('../controllers/shop')
const router = express.Router()

router.get('/products', isAuth, shopController.getProducts)

router.get('/products/:productId', isAuth, shopController.getProduct)

router.get('/cart', isAuth, shopController.getCart)

router.post('/cart', isAuth, shopController.postCart)

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

router.get('/orders', isAuth, shopController.getOrders)

router.post('/delete-order-item', isAuth, shopController.deleteItemOrder)

router.post('/checkout', isAuth, shopController.getCheckout)

router.post('/create-order', isAuth, shopController.postOrder)

module.exports = router
