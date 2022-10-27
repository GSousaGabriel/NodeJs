const Product= require('../models/product');

exports.adminAddProduct= (req, res, next)=>{
    res.render('admin/add-product', {pageTitle: 'Add product', path: 'admin/add-product'});
}

exports.adminEditProduct= (req, res, next)=>{
    res.render('admin/edit-product', {pageTitle: 'Add product', path: 'admin/edit-product'});
}

exports.adminAllProducts= (req, res, next)=>{
    Product.fetchAll(
        prods=>{
            res.render('admin/products', {products: prods, pageTitle: 'Shop', path:'admin/products'})
        }
    );
}

exports.postProduct= (req, res, next)=>{
    const title= req.body.title;
    const imageUrl= req.body.imageUrl;
    const price= req.body.price;
    const description= req.body.description;
    const product= new Product(title, imageUrl, price, description);
    product.save();
    res.redirect('/');
}