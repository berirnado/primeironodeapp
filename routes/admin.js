const express = require('express');
const path = require('path');

const adminController = require('../controllers/admin');

const router = express.Router();

const rootDir = require('../util/path');


router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getAdminProducts)

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/add-product', adminController.postAddProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;