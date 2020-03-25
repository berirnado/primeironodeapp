const Product = require('../models/product');

exports.getAddProduct = (req,res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Products',
        path: '/admin/add-product',
        formsCSS: true,
        activeAddProduct: true
    })
};

exports.postAddProduct = (req,res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode
    })
}

exports.getAdminProducts = (req,res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            docTitle: 'Admin Product List',
            path:'/admin/products'
        });
})};