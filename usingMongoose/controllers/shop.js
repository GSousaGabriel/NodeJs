const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
    Product.find()
      .then(products => {
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
          path: '/products'
        })
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
      .then(product => {
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products'
        })
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
}

exports.getCart = (req, res, next) => {
    User.find({ _id: req.session.user._id }).populate('cart.items.productId')
      .then(user => {
        let products = user[0].cart.items

        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
        })
      })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findOne({ _id: prodId })
      .then(prod => {
        return req.user.addToCart(prod)
      })
      .then(user => {
        res.redirect('/cart')
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
}

exports.deleteItemOrder = (req, res, next) => {
    const prodId = req.body.productId
    Order.find({ userId: req.session.user._id, isOpen: true })
      .then(order => {
        order[0].deleteItem(prodId)
      })
      .then(order => {
        res.redirect('/orders')
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user.deleteItem(prodId)
      .then(cart => {
        console.log(cart)
        res.redirect('/cart')
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
}

exports.getOrders = async (req, res, next) => {
    let orders = []
    let items = []

    Order.find({ userId: req.session.user._id, isOpen: true }).populate("items.productId")
      .then(orders => {
        res.render('shop/orders', {
          path: 'orders',
          pageTitle: 'Your order',
          orders
        })
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
}

exports.getCheckout = (req, res, next) => {
    Order.updateOne({ userId: req.session.user._id, isOpen: true }, { isOpen: false })
      .then(result => {
        res.redirect('/products')
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
}

exports.postOrder = (req, res, next) => {
    Order.find({ userId: req.session.user._id, isOpen: true })
      .then(order => {
        if (order.length === 0) {
          const newOrder = new Order({ userId: req.session.user._id, items: req.session.user.cart.items, isOpen: true })
          return newOrder.save()
        } else {
          return order[0].addToOrder(req.user.cart.items)
        }
      })
      .then(result => {
        return req.user.deleteCart()
      })
      .then(result => {
        res.redirect('/orders')
      })
      .catch(error => {
        const errorReq= new Error(error)
        errorReq.httpStatusCode= 500
        return next(errorReq)
      })
}