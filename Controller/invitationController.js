const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userTable = require('../models/user');
router.get('/',(req,res)=>{
    res.render('layout/mainForm',{title:"Insert Details of members:"});
})
module.exports = router;