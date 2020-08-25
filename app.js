const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/vendor');
const User1 = require('./models/customer');
const Product = require('./models/product');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//adding current user info
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get('/', (req, res) => {
    res.render('landing');
})

//Vendor register==============================================
app.get('/vendor/register', (req, res) => {
    res.render('login-register-for-vendor/register')
})

app.post("/vendor/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function (err) {
        if (err) {
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/product");
        })
    })
})

//customer register
app.get('/customer/register', (req, res) => {
    res.render('login-register-for-customer/register')
})

//user signup
app.post('/customer/register', async (req, res) => {
    const user = new User1(req.body)

    try {
        await user.save()
        res.redirect("/product/customer")
    } catch (e) {
        res.redirect('/customer/register')
    }
})

//login Vendor
app.get('/vendor/login', (req, res) => {
    res.render('login-register-for-vendor/login.ejs');
})

//login route for handeling login logic
app.post("/vendor/login", passport.authenticate("local", {
    successRedirect: "/product",
    failureRedirect: "/vendor/login"
}), (req, res) => {

});
//==============================================================

//login customer
app.get('/customer/login', (req, res) => {
    res.render('login-register-for-customer/login.ejs');
})



//user login
app.post('/customer/login', async (req, res) => {
    try {
        const user = await User1.findByCredentials(req.body.email, req.body.password)
        res.redirect('/product/customer');
    } catch (error) {
        res.status(404).redirect('/customer/login');
    }
});


//show page
app.get('/product', (req, res) => {
    Product.find({}, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            res.render('show', { item: item, currentUser: req.user });
        }
    })
})
//show 2 page
app.get('/product/customer', (req, res) => {
    Product.find({}, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            res.render('show2', { item: item, currentUser: req.user });
        }
    })
})

//create product
app.post("/product", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price

    var newcampGround = {
        name: name,
        image: image,
        description: description,
        price: price
    }
    // create a new campground an save in the database
    Product.create(newcampGround, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/product");
        }
    })
});

//new route
app.get("/product/new", (req, res) => {
    res.render("new");
});

//logout route
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`The is running at ${port}.`);
})