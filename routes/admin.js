const { check, body } = require('express-validator/check');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
    '/add-product',
    [
        check('title', 'No numbers or special characters allowed in title')
        .isAlpha(),
        check('imageUrl', 'Please enter a valid URL')
        .isURL(),
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
    '/edit-product',
    [
        check('title', 'No numbers or special characters allowed in title')
        .isAlpha(),
        check('imageUrl', 'Please enter a valid URL')
        .isURL(),
    ],
    isAuth,
    adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
