const Product = require('../models/product');


exports.getIndex = (req,res, next) => {
    res.render('shop/index', {
        docTitle: 'My Shop',
        path: '/'
    })
};

exports.getProducts =  (req,res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            docTitle: 'Product List',
            path:'/products'
        });
    });
};

exports.getCart = (req,res, next) => {
    res.render('shop/cart', {
        docTitle: 'Cart',
        path: '/cart'
    })
};

exports.getAdminProducts = (req,res, next) => {
    res.render('admin/products', {
        docTitle: 'Admin Products',
        path: '/admin/products'
    })
}

exports.getCheckout = (req,res, next) => {
    res.render('checkout',  {
        docTitle: Checkout,
        path: '/checkout'
    })
}

