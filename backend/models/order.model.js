var mongoose = require("mongoose");

var OderSchema = new mongoose.Schema({
    username: String,
    date: { type: Date, default: Date.now },
    nums: Number,
    book:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
    }
});

module.exports = mongoose.model("orders", OderSchema);