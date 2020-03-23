const Product = require('../models/product');

exports.getAddProduct = (req,res, next) => {
    res.render('add-product', {
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

exports.getProducts =  (req,res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', {
            prods: products,
            docTitle: 'My Shop',
            path:'/',
            hasProducts: products.length>0,
            activeShop: true,
            productCSS: true,
        });
    });
};