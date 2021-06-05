const mongoose = require('mongoose');
const pplSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "this field is required"]
    },
    amount: {
        type: Number
    },
    address:{
        type: String
    },
    gift: [String],
    mobile:{
        type: Number
    }
});


let Pplmodel = mongoose.model('Pplmodel',pplSchema);
module.exports('Pplmodel');
