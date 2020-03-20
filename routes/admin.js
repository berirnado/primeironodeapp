const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('../util/path');

const products = [];

router.get( '/add-product', (req,res, next) => {
    res.render('add-product', {docTitle: 'Add Products'})
});

router.post('/add-product', (req,res) => {
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;