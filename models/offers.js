var mongoose = require("mongoose");

var offerSchema = new mongoose.Schema({
    text: String,
    condition: String,
    image: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, 
        username: String,
    }
});

module.exports = mongoose.model("Offer", offerSchema);