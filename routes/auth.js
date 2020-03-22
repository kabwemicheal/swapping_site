var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Product = require('../models/product');


//register user
router.get('/register', (req, res)=>{
    res.render("register");
});

router.post('/register', (req, res)=>{
    var newUser = new User({
        fullName: req.body.fullName,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        physicalAddress: req.body.physicalAddress
    });
    User.register(newUser, req.body.password, (err, registerdUser)=>{
        if(err){
            console.log(err);
        }
         passport.authenticate('local')(req, res, function(){
                res.redirect('/items');
            });
    });
});

router.get('/login', (req, res)=>{
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/items',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome to the swapping site!' 
}));

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "you have successfully loged out");
    res.redirect("/login");
});

//user profile

router.get('/user/:user_id', (req, res)=>{
    User.findById(req.params.user_id, (err, foundUser)=>{
        if(err){
            req.flash("error", "The requested user does not exist");
        }
        else{
             Product.find({}).where('author.id').equals(foundUser._id).exec(function(err, foundProducts){
                 if(err){
                     req.flash("error", "something went wrong");
                 }
                 else{
                     console.log(foundUser);
                     console.log("=======================");
                     console.log(foundProducts);
                    res.render("user", {foundUser: foundUser, foundProducts: foundProducts});
                 }
             }) 
        }
    })
})

module.exports = router;
