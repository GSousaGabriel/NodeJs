const Product= require('../models/product');

exports.index= (req, res, next)=>{
    Product.fetchAll(
        prods=>{
            res.render('shop/index', {products: prods, pageTitle: 'Shop', path:'/product-list'})
        }
    );
}

exports.getMyProducts= (req, res, next)=>{
    Product.fetchAll(
        prods=>{
            res.render('shop/product-list', {products: prods, pageTitle: 'Shop', path:'/product-list'})
        }
    );
}

exports.getProductDetail= (req, res, next)=>{
        res.render('shop/product-detail', {products: prods, pageTitle: 'Shop', path:'/product-detail'})
}

exports.getMyCart= (req, res, next)=>{
    Product.fetchAll(
        prods=>{
            res.render('shop/cart', {products: prods, pageTitle: 'Shop', path:'/cart'})
        }
    );
}

exports.getOrders= (req, res, next)=>{
    Product.fetchAll(
        prods=>{
            res.render('shop/orders', {products: prods, pageTitle: 'Your orders', path:'/orders'})
        }
    );
}

exports.checkout= (req, res, next)=>{
    Product.fetchAll(
        prods=>{
            res.render('shop/checkout', {products: prods, pageTitle: 'Shop', path:'/checkout'})
        }
    );
}