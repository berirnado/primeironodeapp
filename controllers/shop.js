const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getIndex = (req,res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            docTitle: 'My Shop',
            path:'/'
        });
    });
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

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            docTitle: product.title,
            path: '/products'
        });
    })
}

exports.getCart = (req,res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                docTitle: 'Cart',
                path: '/cart',
                products: cartProducts
            })
        })
    })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        console.log('entrou aqui tbm')
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    })
}

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

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Your Orders',
        path: '/orders'
    })
}
