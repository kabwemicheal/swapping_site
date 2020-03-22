var express = require('express');
var router = express.Router({mergeParams: true});
var Product = require('../models/product');
var Offer = require('../models/offers');
var User = require('../models/user');
var middlewareObj = require('../middleware');

// router.get('/items/:id/offers/:pro_id', middlewareObj.checkUserPro, (req, res)=>{
//     Product.find({}).where('author.id').equals(req.user._id).exec(function(err, foundItem){        if(err){
//         if(err){
//             return req.flash("error", "something is up");
//             }
//         }
//         else{
//             Product.findById(req.params.id,(err, foundP)=>{
//                 if(err){
//                     req.flash("error", "something went wrong");
//                 }
//                 else{
//                     foundP.offers.push(foundItem._id);
//                 }
//             })
//         }
//         res.render('new2', {foundItem: foundItem});
//     })
// });

router.get('/items/:id/offers/new', (req, res)=>{
    Product.findById(req.params.id, (err, foundP)=>{
            if(err){
                    req.flash("error", "there is an error");
                }
                else{
                    Product.find({}).where('author.id').equals(req.user._id).exec(function(err, foundPros){
                        if(middlewareObj.isEmp(foundPros)){
                            req.flash("error", "you dont have offers");
                            res.redirect("/items/" + req.params.id +"/reserve")
                        }  
                        else if(err){
                            req.flash("error", "something is not correct");
                        } 
                        else{
                          res.render("userPro", {foundPros: foundPros, foundP: foundP}); 
                        }
                    });
                  
                }
            });
} );

router.post('/items/:id/offers/new/:pro_id', (req, res)=>{
    Product.findById(req.params.id, (err, fProduct)=>{
        if(err){
            req.flash("error", "something went wrong");
        }
        else{
            Product.findById(req.params.pro_id, (err, fdProduct)=>{
                if(err){
                    req.flash("error", "something went wrong");
                }
                else{
                    Offer.create({
                        text: fdProduct.name,
                        image: fdProduct.image,
                        description: fdProduct.description,
                        condition: fdProduct.condition
                    }, (err, fOffer)=>{
                        if(err){
                            req.flash("error", "something went wrong");
                        }
                        else{
                            fOffer.author.id = req.user._id;
                            fOffer.author.username = req.user.username;
                            fOffer.save();
                            fProduct.offers.push(fOffer);
                            fProduct.save();
                            res.redirect('/items/' + fProduct._id + '/reserve');
                        }
                    });  
                }
            });
        }
    });
});

// router.post('/items/:id/offers', middlewareObj.isLoggedIn, (req, res)=>{
//     //find product by id
//     Product.findById(req.params.id, (err, Item)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             // Create the offer
//             var newOffer = ({
//                 text : req.body.text,
//                 condition: req.body.condition,
//                 image: req.body.image,
//                 description: req.body.description,
//             })
//             Offer.create(newOffer, (err, createdOffer)=>{
//                 console.log(newOffer);
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     createdOffer.author.id = req.user._id;
//                     createdOffer.author.username = req.user.username;
//                     createdOffer.save();
//                     //associate the offer created by pushing into the product
//                     Item.offers.push(createdOffer);
//                     //save 
//                     Item.save();
//                     //redirect to the reserve page
//                     res.redirect('/items/' + Item._id + '/reserve');
//                 }
//             });
//         }
//     })
// });

//render the contact info
router.get('/items/:id/offers/:offer_id/contact',middlewareObj.isLoggedIn, (req, res)=>{
    Offer.findById(req.params.offer_id, (err, foundOffer)=>{
        if(err){
            console.log(err);
        }
        else{
            User.findOne().where("_id").equals(foundOffer.author.id).exec(function(err, fUser){
                if(err){
                    req.flash("error", "something is wrong");
                }
                 else{
                    res.render('contact', {fUser: fUser}); 
                 }
            });
            
        }  
    });   
});

//edit offer
router.get('/items/:id/offers/:offer_id/edit', middlewareObj.checkOfferOwnership, (req, res)=>{
    Offer.findById(req.params.offer_id, (err, fOffer)=>{
        if(err){
            console.log(err);
        }
        else{
            User.findOne().where("_id").equals(fOffer.author.id).exec(function(err, foundUser){
                if(err){
                    req.flash("error", "something went wrong");
                }
                else{
                   res.render('editOffer', {item_id: req.params.id, foundOffer: fOffer, foundUser: foundUser});   
                }
            });  
        }
    });
});

//update offer
router.put('/items/:id/offers/:offer_id', middlewareObj.checkOfferOwnership, (req, res)=>{
    Offer.findByIdAndUpdate(req.params.offer_id, req.body.offer, (err, updatedOffer)=>{
        if(err){
            res.redirect('/items');
        }
        else{
            User.findByIdAndUpdate(updatedOffer.author.id, req.body.user).where("_id").equals(updatedOffer.author.id).exec(function(err, updUser){
                if (err) {
                    req.flash("error", "something went wrong!");
                }
                else{
                    res.redirect('/items/' + req.params.id + '/reserve');
                }
            });
            
        }
    });
});

//delete offer
router.delete('/items/:id/offers/:offer_id', middlewareObj.checkOfferOwnership, (req, res)=>{
    Offer.findByIdAndRemove(req.params.offer_id, (err)=>{
        if(err){
            res.redirect('/items/' + req.params.id + '/reserve');
        }
        else{
            res.redirect('/items/' + req.params.id + '/reserve');
        }
    });
});

//swap items
router.get('/items/:id/offers/:offer_id/swap',(req, res)=>{
    Product.findById(req.params.id, (err, foundIt)=>{
        if(err){
            req.flash("error", "something went wrong"); 
        }
        else{
             Offer.findById(req.params.offer_id, (err, foundOf)=>{
                if(err){
                    req.flash("error", "something is wrong");
                }
                else{
                    Product.findOne({}).where("author.id").equals(foundOf.author.id).exec(function(err, foundP){
                        if(err){
                            req.flash("error", "something is wrong");
                        }
                        else{
                            var emp = [];
                            foundP.offers = emp;
                            foundIt.offers = emp;
                            var theID = foundP.author.id;
                            var the_username = foundP.author.username;
                            foundP.author.id = foundIt.author.id;
                            foundP.author.username = foundIt.author.username;
                            foundIt.author.id = theID;
                            foundIt.author.username = the_username;
                            foundIt.save();
                            foundP.save();
                            
                            res.redirect('/items/'+ foundIt._id +'/reserve');
                   
                        }
                    })
                  
                 }
                });
                    
                }
            })
})

module.exports = router;
