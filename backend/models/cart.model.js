var mongoose = require("mongoose");

var CartSchema = new mongoose.Schema({
    username: String,
    nums: Number,
    book:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
    }
});

module.exports = mongoose.model("carts", CartSchema);