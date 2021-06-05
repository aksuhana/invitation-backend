const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userTable = require("./models/user")
mongoose.connect('mongodb://localhost:27017/userData', 
    {   useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("CONNECTION OPEN !!!")
    })
    .catch(err => {
        console.log("ERROR While Connecting!!!!");
        console.log(err);
    })

const seedUsers = [
    { name: 'Ankit Jain', amount: 0, address: 'Africa', mobile: 9996699990, gift: 'Black Mamba' },
    { name: 'Shaurya Khandelwal', amount: 2000, address: 'USA', mobile: 9944449999, gift: '' },
    { name: 'Malini Tripathi', amount: 300, address: 'Australia', mobile: 9023459999, gift: 'Kangaroo' },
    { name: 'Aditya Surana', amount: 4000, address: 'Rajasthan', mobile: 9588838654, gift: 'Bugatti Chiron' },
    { name: 'Aakriti Yadav', amount: 5000, address: 'Agra', mobile: 9012640934, gift: 'Taj Mahal' },
    { name: 'Sahil Subhnani', amount: 10000, address: 'Jaipur', mobile: 9092475398, gift: 'Kohinoor' }
];


userTable.insertMany(seedUsers)
    .then(res => {
        console.log("Records Added");
    })
    .catch(e => {
        console.log(e)
    })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, PATCH, DELETE");
    next();
    });


app.get('',(req,res)=>{
    res.send("server working");
})
app.get('/api/fetchUser', async (req,res)=>{
    const data = await userTable.find({});
    // console.log(data);
    res.json(data);
})

app.post("/api/send", (req,res)=>{
    const {name, address, mobile} = req.body;
    let record = {
        name: name,
        address: address,
        mobile: mobile
    }
    console.log(record);
    let item = new userTable(record);
    item.save(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            console.log(result)
        }
    })
    res.redirect("/api/fetchUser");
    // res.send("ok")
})

app.delete("/api/deleteUser/:id", async (req,res)=>{
    const{ id } = req.params;
    const deleteData = await userTable.findByIdAndDelete(id);
    if(deleteData)
    {
        req.method = "GET";
        res.redirect(303,'/api/fetchUser');
    }
    else
    res.send("No Such User Found")
})

app.patch("/api/amountUpdate/:id", async (req,res)=>{
    console.log("myUpdate Called");
    const { id } = req.params;
    const {amount, gift} =req.body;
    const updatedUser = await userTable.findByIdAndUpdate(id,req.body);
    console.log(updatedUser);
    res.send("Transaction Sucess")
})
app.patch("/api/updateUser/:id", async (req,res)=>{
    const { id } = req.params;
    const { name, address, amount, mobile, gift} = req.body;
    console.log(name, address, amount, mobile, gift)
    await userTable.findByIdAndUpdate(id,{name:name, address:address, amount:amount, mobile:mobile, gift:gift});
    req.method ="GET";
    res.redirect(303, '/api/fetchUser')
})

app.listen(3000,()=>{
    console.log('listening to port http://localhost:3000')
})