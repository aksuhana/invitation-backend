const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "This Field is Required"]
    },
    amount: {
        type: Number
    },
    address:{
        type: String
    },
    gift: String,
    mobile:{
        type: Number
    }
});


const userTable = mongoose.model('userTable',userSchema);
module.exports = userTable;
