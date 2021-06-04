const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Tablew = require("./models/good")
mongoose.connect('mongodb://localhost:27017/invitation', 
    {   useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("CONNECTION OPEN !!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!");
        console.log(err);
    })

const seedUsers = [
    { username: 'Todd', email: 'todd@gmail.com', gender: 'Male'}, 
    { username: 'Skini', email: 'sk123@gmail.com', gender: 'Female'}
]

Tablew.insertMany(seedUsers)
    .then(res => {
        console.log("Records Added");
    })
    .catch(e => {
        console.log(e)
    })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, PATCH, DELETE");
    next();
    });


app.get('',(req,res)=>{
    res.send("server working");
})
app.get('/fetch', async (req,res)=>{
    const data = await Tablew.find({});
    console.log(data);
    res.json(data);
})

app.post("/send", (req,res)=>{
    const {username, email, gender} = req.body;
    let record = {
        username: username,
        email: email,
        gender: gender
    }
    console.log(record);
    let item = new Tablew(record);
    item.save(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            console.log(result)
        }
    })
    res.redirect("/fetch");
    // res.send("ok")
})

app.delete("/delete/:id", async (req,res)=>{
    const{ id } = req.params;
    const deleteData = await Tablew.findByIdAndDelete(id);
    if(deleteData)
    {
        req.method = "GET";
        res.redirect(303,'/fetch');
    }
    else
    res.send("no such item found")
})

app.patch("/update/:id", async (req,res)=>{
    const { id } = req.params;
    const { email, username } = req.body;
    console.log(id, email, username)
    await Tablew.findByIdAndUpdate(id,{email:email, username:username});
    req.method ="GET";
    res.redirect(303, '/fetch')
})

app.listen(3000,()=>{
    console.log('listening to port http://localhost:3000')
})