const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const userTable = require('../models/user.js');


router.get('/', (req, res) => {
    res.render("user/addOrEdit", {
        viewTitle: "Insert USER"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    const {name, address, mobile,amount, gift, hindiName} = req.body;
    let record = {
        name: name,
        address: address,
        mobile: mobile,
        amount:amount,
        gift: gift,
        hindiName:hindiName
    }
    console.log(record);
    let item = new userTable(record);
    item.save(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            console.log(result)
            res.redirect('employee/list');
        }
    })
    // console.log(req.body)
    // var user = new userTable();
    // user.name = req.body.name;
    // user.address = req.body.address;
    // user.mobile = req.body.mobile;
    // user.amount = req.body.amount;
    // user.gift = req.body.gift;
    // const myArr = []
    // user.save((err, doc) => {
    //     if (!err)
    //         res.redirect('user/list');
    //     else {
    //         if (err.name == 'ValidationError') {
    //             // handleValidationError(err, req.body);
    //             res.render("user/addOrEdit", {
    //                 viewTitle: "Insert User",
    //                 user: req.body
    //             });
    //         }
    //         else
    //             console.log('Error during record insertion : ' + err);
    //     }
    // });
}

function updateRecord(req, res) {
    userTable.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                // handleValidationError(err, req.body);
                res.render("user/addOrEdit", {
                    viewTitle: 'Update User',
                    user: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    }).lean();
}


router.get('/list', (req, res) => {
    userTable.find((err, docs) => {
        if (!err) {
            console.log(docs)
            res.render("user/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
});


// function handleValidationError(err, body) {
//     for (field in err.errors) {
//         switch (err.errors[field].path) {
//             case 'fullName':
//                 body['fullNameError'] = err.errors[field].message;
//                 break;
//             case 'email':
//                 body['emailError'] = err.errors[field].message;
//                 break;
//             default:
//                 break;
//         }
//     }
// }

router.get('/:id', (req, res) => {
    userTable.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("user/addOrEdit", {
                viewTitle: "Update User",
                user: doc
            });
        }
    }).lean();
});

router.get('/delete/:id', (req, res) => {
    userTable.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in user delete :' + err); }
    });
});

module.exports = router;