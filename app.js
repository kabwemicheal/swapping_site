var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var Product = require('./models/product');
var User = require('./models/user');
var Offer = require('./models/offers');

var ProductsRoutes = require('./routes/product');
var OffersRoutes = require('./routes/offer');
var authRoutes = require('./routes/auth');

mongoose.connect('mongodb://localhost:27017/pfe2', {useNewUrlParser: true,  useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(flash());
app.use(require('express-session')({
    secret:'site de troc',
    resave: false,
    saveUninitialized: false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // encoding the information in the session
passport.deserializeUser(User.deserializeUser()); //decoding the information

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//renders the home page
app.get('/', (req, res)=>{
    Product.find({}, (err, foundProducts)=>{
        if(err){
            req.flash("error", "something is up");
        }
        else{
          res.render("home",{foundProducts: foundProducts});  
        }
    })
    
});

app.get('/names', (req, res)=>{  
    Product.find({}, (err, allProducts)=>{
        if(err){
            req.flash("error", "something is wrong");
        }
        else{
            allProducts.category.forEach(function(proCategory){
                if(proCategory === 'Electronics'){
                    Product.find({}).where("category").equals("Electronics").exec(function(err, fProducts){
                        if(err){
                            req.flash("error", "somethimg went wrong");
                        }
                        else{
                          res.render('allprod', {fProducts: fProducts});  
                        }
                    });
                }
                
            })
            
        }
    })
 })

app.use(ProductsRoutes);
app.use(OffersRoutes);
app.use(authRoutes);

let port = 8080;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port, function(){
    console.log("Server is Running....");
});