var Offer = require('../models/offers');
var Product = require('../models/product');

var middlewareObj = {}
middlewareObj.checkProductOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Product.findById(req.params.id, (err, foundProduct)=>{
            if(err){
                console.log(err);
            }
            else{
                if(foundProduct.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        })
    }
    else{
        res.redirect('back')
    }
}

middlewareObj.checkOfferOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Offer.findById(req.params.offer_id, (err, foundOffer)=>{
            if(err){
                console.log(err);
            }
            else{
                if(foundOffer.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        })
    }
    else{
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    else{
      req.flash('error', 'You must be signed in to do that!');
        res.redirect('/login');
    }
}

middlewareObj.isEmp =  function(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }

    

module.exports = middlewareObj;
