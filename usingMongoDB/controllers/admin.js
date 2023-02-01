const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  const product= new Product(title, price, description, imageUrl)
  product.save()
    .then(result => {
      console.log('Created Product');
      return res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params.productId;
//   req.user.getProducts({ where: {id: prodId}})
//   .then( product => {
//     if (!product[0]) {
//       return res.redirect('/');
//     }
//     res.render('admin/edit-product', {
//       pageTitle: 'Edit Product',
//       path: '/admin/edit-product',
//       editing: editMode,
//       product: product[0]
//     });
//   }).catch(error=>{
//     console.log(error);
//   })
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;
//   Product.findByPk(prodId)
//   .then(product=>{
//     product.title= updatedTitle;
//     product.price= updatedPrice;
//     product.description= updatedImageUrl;
//     product.imageUrl= updatedDesc;
//     return product.save();
//   })
//   .then(result=>{
//     res.redirect('/admin/products');
//   }).catch(error=>{
//     console.log(error)
//   })
// };

// exports.getProducts = (req, res, next) => {
//   req.user.getProducts()
//   .then(products => {
//     res.render('admin/products', {
//       prods: products,
//       pageTitle: 'Admin Products',
//       path: '/admin/products'
//     })
//   }).catch(error=> {
//     console.log(error);
//   });
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId).then(product=>{
//     product.destroy();
//   })
//   .then(result=>{
//     res.redirect('/admin/products');
//   })
//   .catch(error=>{
//     console.log(error);
//   });
// };
