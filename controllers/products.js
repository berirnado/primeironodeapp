const products = [];

exports.getAddProduct = (req,res, next) => {
    res.render('add-product', {
        docTitle: 'Add Products',
        path: '/admin/add-product',
        formsCSS: true,
        activeAddProduct: true
    })
};


exports.postAddProduct = (req,res) => {
    products.push({title: req.body.title});
    res.redirect('/');
};

exports.getProducts =  (req,res, next) => {
    res.render('shop', {
        prods: products,
        docTitle: 'My Shop',
        path:'/',
        hasProducts: products.length>0,
        activeShop: true,
        productCSS: true,
    });
};