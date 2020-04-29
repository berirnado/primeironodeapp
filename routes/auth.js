const express = require('express');
const { check, body } = require('express-validator/check');
const bcrypt = require('bcryptjs')

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

var userAuth;

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail()
        .custom((value, {req}) => {
            return User.findOne({email: value})
            .then((userDoc) => {
                if(!userDoc) {
                    return Promise.reject('No Email found with this address');
                }else{
                    userAuth = userDoc;
                }
            })
        }),
        body('password')
        .trim()
        .custom((value, {req}) => {
            return bcrypt
            .compare(value, userAuth.password)
            .then((doMatch) => {
                if (!doMatch) {
                  return Promise.reject('Incorrect Password');
                };
            })
        })
    ],
    authController.postLogin);

router.post(
    '/signup',
    [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail()
        .custom((value, {req}) => {
            return User.findOne({ email: value })
            .then((userDoc) => {
            if (userDoc) {
                return Promise.reject('E-Mail already exists, please pick a different one.')
            }
        })}),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
    body('confirmPassword').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }else{
            return true
        }
    })
    ],
  authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;