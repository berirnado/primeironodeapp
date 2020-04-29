const crypto = require('crypto');

const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator/check');

const User = require("../models/user");
const apikey = require('../secure/api_key');

const transporter = apikey.transporter;

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    massage = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
    validationErrors: [],
    oldInput: {email: '', password: ''}
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    massage = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {email: "", password: "", confirmPassword: ""},
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: {email: email, password: password},
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword},
      validationErrors: errors.array(),
    });
  }
    bcrypt.hash(password, 12).then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
      })
      .then((result) => {
        res.redirect("/login");
        return transporter.sendMail({
          to: email,
          from: "salvarsenhas@hotmail.com",
          subject: "SignUp Succeeded",
          html: "<h1>You have successfully signed up!</h1>",
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};


exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    massage = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = (req,res,next) => {
  email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({email: email})
    .then(user => {
      if(!user){
        req.flash('error', 'No account with that email found!');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 36000000;
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      return transporter.sendMail({
        to: email,
        from: "salvarsenhas@hotmail.com",
        subject: "Password Reset",
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
      });
    })
    .catch(err =>console.log(err))
  });
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user =>{
    let message = req.flash('error');
    if (message.length > 0) {
      massage = message[0];
    } else {
      message = null;
    }
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  })
  .catch(err => console.log(err))

}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
    })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword =>{
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
  
    .catch(err => console.log(err))
  }