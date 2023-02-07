const Product = require('../models/product');
const User = require('../models/user')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.fetchOne(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  res.render('shop/product-list', {
    pageTitle: 'Login',
    path: '/products'
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne(req.body.username, req.body.pass)
    .then(user => {
      res.redirect('/cart');
    })
    .catch(error => {
      console.log(error)
    });
};

exports.getCart = async (req, res, next) => {
  let products= []

  if(req.user.cart){
    for (let index = 0; index < req.user.cart.items.length; index++) {
      await Product.fetchOne(req.user.cart.items[index].productId)
      .then(product=>{
        products.push({
          _id: product._id,
          title: product.title,
          quantity: req.user.cart.items[index].quantity
        })
      })  
    }
  }
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: products
  })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.fetchOne(prodId)
  .then(prod=>{
    return req.user.addProduct(prod)
  })
  .then(user=>{
    res.redirect('/cart');
  })
  .catch(error => {
    console.log(error)
  });
};

exports.deleteItemOrder = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemOrder(prodId)
    .then(order => {
      console.log(order)
      res.redirect('/orders');
    })
    .catch(error => {
      console.log(error)
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItem(prodId)
    .then(cart => {
      console.log(cart)
      res.redirect('/cart')
    })
    .catch(error => {
      console.log(error)
    });
};

exports.getOrders = async (req, res, next) => {
  let orders= []
  let items= []

  if(req.user.orders){
    orders= req.user.orders
    for (let i = 0; i < orders.length; i++) {
      if(orders[i].open){
        for (let index = 0; index < orders[i].items.length; index++) {
          await Product.fetchOne(orders[i].items[index].productId)
          .then(product=>{
            items.push({
                _id: product._id,
                title: product.title,
                quantity: req.user.orders[i].items[index].quantity,
                price: product.price,
                imageUrl: product.imageUrl,
                description: product.description
            })
          })
          .catch(error => {
            console.log(error)
          });
        }
        orders[i].items= items
      }
    }
  }
  res.render('shop/orders', {
    path: 'orders',
    pageTitle: 'Your order',
    orders
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req, res, next) => {
  req.user.updateOrder()
  .then(orders=>{
    console.log(orders)
    res.redirect('/orders')
  })
  .catch(error => {
    console.log(error)
  });
};