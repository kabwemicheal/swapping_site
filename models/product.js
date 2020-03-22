var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    condition: String,
    category: String,
    createdAt: {type: Date, default: Date.now},
    offers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offer"
        }
    ],
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
    
});

module.exports = mongoose.model('Product', productSchema);