const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const errorController = require("./controllers/error");
const User = require('./models/user');


const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById('5e9f766d16d80708981297b2')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://bernardo:eLdHZvcimLJgqLdS@cluster0-8qvme.mongodb.net/shop?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
    )
  .then(result => {
    User.findOne().then(user => {
      if (!user){
        const user = new User({
          name: 'Max',
          email: 'max@email.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    })
    app.listen(3000)
  })
  .catch(err => {
    console.log(err);
  })
