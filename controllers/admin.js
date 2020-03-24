const Product = require('../models/product');

exports.getAddProduct = (req,res, next) => {
    res.render('admin/add-product', {
        docTitle: 'Add Products',
        path: '/admin/add-product',
        formsCSS: true,
        activeAddProduct: true
    })
};

exports.postAddProduct = (req,res) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getAdminProducts = (req,res, next) => {
    res.render('admin/products', {
        docTitle: 'Admin Products',
        path: '/admin/products'
    })
}