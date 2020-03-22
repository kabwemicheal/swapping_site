var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var middlewareObj = require('../middleware');

//retrieves all the items in the database and posts them!!
router.get('/items', (req, res)=>{
    Product.find({}, (err, createdProduct)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {passedItems: createdProduct, currentUser: req.user});
        }
    });
});


//renders a form for creating a new product!
router.get('/items/new',middlewareObj.isLoggedIn, (req, res)=>{
    res.render('new');
});

//create and save a new item into the database and then redirect to the items page!!
router.post('/items', middlewareObj.isLoggedIn, (req, res)=>{
    var name = req.body.name;
    var img = req.body.image;
    var description = req.body.description;
    var condition = req.body.condition;
    var category = req.body.category;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    Product.create({
        name: name,
        image: img,
        description: description,
        condition: condition,
        category: category,
        author: author
    },(err)=>{
        if (err) {
            console.log(err);
        }
        else{
            res.redirect('/items');
        }
    });
});

//show route,
//find the item by id and then retrieve it by passing into the show page!!
router.get('/items/:id', middlewareObj.isLoggedIn, (req, res)=>{
    var id  = req.params.id;
    Product.findById(id, (err, requestedItem)=>{
        if (err) {
            console.log(err);
        }
        else{
            res.render('show', {requestedItem: requestedItem});
        }
    });
});

//edit the product
router.get('/items/:id/edit', middlewareObj.checkProductOwnership, (req, res)=>{
    var id = req.params.id;
    Product.findById(id, (err, foundItem)=>{
        if (err) {
            res.redirect('/items');
        }
        else{
            res.render('edit', {foundItem: foundItem});
        }
    })
});
//update product
router.put('/items/:id', middlewareObj.checkProductOwnership, (req, res)=>{
    var id = req.params.id;
    Product.findByIdAndUpdate(id, req.body.product, (err, updatedItem)=>{
        if (err) {
            res.redirect("/items");
        }
        else{
            res.redirect('/items/' + updatedItem._id);
        }
    });
});

//delete route
router.delete('/items/:id', middlewareObj.checkProductOwnership, (req, res)=>{
    var id = req.params.id;
    Product.findByIdAndRemove(id, (err)=>{
        if(err){
            res.redirect('/items');
        }
        else{
            res.redirect('/items');
        }
    });
});

//reserve the offer!
router.get('/items/:id/reserve',middlewareObj.isLoggedIn, (req, res)=>{
    var id = req.params.id;
    Product.findById(id).populate("offers").exec(function(err, reqItem){
        if (err) {
            console.log(err);
        }
        else{
            res.render('reserve', {resItem: reqItem});
        }
    });  
});


module.exports = router;