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

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
        .then(cartProducts => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts
          });
        })
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQtd = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0]
      }
      if (product) {
        newQtd = product.cartItem.quantity + 1
        return product
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQtd } })
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(error => {
      console.log(error)
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(product => {
      return product[0].cartItem.destroy()
    })
    .then(
      res.redirect('/cart')
    )
    .catch(error => {
      console.log(error)
    });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: 'orders',
        pageTitle: 'Your order',
        orders
      })
    })
    .catch(error => {
      console.log(error)
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req, res, next) => {
  var fetchedCart = ''
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(async products => {
      await req.user.getOrders()
        .then(orders => {
          if (orders.length > 0) {
            return orders[0]
          }
          return req.user.createOrder()
        })
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product
          }))
        })
        .catch(error => {
          console.log(error)
        });
    })
    .then(() => {
      fetchedCart.setProducts(null)
    })
    .then(() => {
      req.user.getOrders({ include: ['products'] })
        .then(orders => {
          res.render('shop/orders', {
            path: 'orders',
            pageTitle: 'Your order',
            orders
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
    .catch(error => {
      console.log(error)
    });
};