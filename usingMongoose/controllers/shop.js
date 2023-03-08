const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const session = require('express-session')
const stripe = require('stripe')('sk_test_51Mj8xaLPYJaXglKDZTgRkcyI1LgYv7MVpxrdYoWT8M1687QIuAuPghBSngvQLBMdyQQcnxIM99Fz3oucasgdspTt002FxMflcQ')
const ITENS_PAGE = 1

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1
  let totalItens

  Product.find()
    .countDocuments()
    .then(number => {
      totalItens = number
      return Product.find()
        .skip((page - 1) * ITENS_PAGE)
        .limit(ITENS_PAGE)
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        totalItens: totalItens,
        hasNext: ITENS_PAGE * page < totalItens,
        hasPrev: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        currentPage: page
      })
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
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
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
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
        products: products,
        sessionId: ''
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
      req.session.user.cart.items = user.cart.items
      res.redirect('/cart')
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
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
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
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
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}

exports.getOrders = async (req, res, next) => {
  Order.find({ userId: req.session.user._id}).populate("items.productId")
    .then(orders => {
      res.render('shop/orders', {
        path: 'orders',
        pageTitle: 'Your order',
        orders
      })
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}

exports.getCheckout = (req, res, next) => {
  let products
  let totalOrder= 0

    User.find({ _id: req.session.user._id }).populate('cart.items.productId')
    .then(user => {
      products = user[0].cart.items

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          totalOrder+= p.productId.price * p.quantity
          return {
            quantity: p.quantity,
            price_data:{
              unit_amount: p.productId.price * 100,
              currency: 'usd',
              product_data:{
                name: p.productId.title,
                description: p.productId.description,
              }
            }
          }
        }),
        mode: 'payment',
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/fail'
      })
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalOrder,
        sessionId: session.id
      })
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}

exports.postOrder = (req, res, next) => {
  const newOrder = new Order({ userId: req.session.user._id, items: req.session.user.cart.items })
  newOrder.save()
    .then(result => {
      return req.user.deleteCart()
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId).populate("items.productId")
    .then(order => {
      if (!order) {
        return next(new Error("No order found!"))
      }
      if (order.userId.toString() === req.user._id.toString()) {
        const invoiceName = "invoice-" + orderId + ".pdf"
        const invoicePath = path.join('usingMongoose', 'invoices', invoiceName)
        const pdfDoc = new PDFDocument()
        let total = 0

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
        res.setHeader('Content-Type', 'application/pdf')
        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res)
        pdfDoc.fontSize(26).text('Invoice for ' + orderId + ':', {
          underline: true
        })
        pdfDoc.text('-------------------------------')
        order.items.forEach(prod => {
          pdfDoc.fontSize(14).text(prod.productId.title + ' - ' + prod.quantity + ' - ' + '$' + prod.productId.price + ' - ' + 'Total $' + (prod.productId.price * prod.quantity))
          total = total + prod.productId.price
        })
        pdfDoc.text('-------------------------------')
        pdfDoc.text('Total: $' + total)
        pdfDoc.end()

        // fs.readFile(invoicePath, (err, data) => {
        //   if (err) {
        //     return next(err)
        //   } else {
        //     res.setHeader('Content-Type', 'application/pdf')
        //     res.setHeader('Content-Disposition', 'attachment; filename="'+invoiceName+'"')
        //     res.setHeader('Content-Type', 'application/pdf')
        //     res.send(data)
        //   }
        // })
        // const file= fs.createReadStream(invoicePath)
        // res.setHeader('Content-Type', 'application/pdf')
        //     res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"')
        //     res.setHeader('Content-Type', 'application/pdf')
        // file.pipe(res)
      } else {
        return next(new Error("Not authorized!"))
      }
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}