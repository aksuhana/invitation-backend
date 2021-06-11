const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userTable = require("./models/user")
const exphbs = require('express-handlebars');
const employeeController = require('./controllers/employeeController');

const path = require('path');
mongoose.connect('mongodb://localhost:27017/userData',
    {
        useNewUrlParser: true,
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



app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');


app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, PATCH, DELETE");
    next();
});


app.get('', (req, res) => {
    res.send("server working");
})
app.get('/api/userById/:id', async (req, res) => {
    let id = req.params.id;
    const user = await userTable.findById(id)
    res.json({
        "name": user.name,
        "amount": user.amount,
        "address": user.address,
        "mobile": user.mobile,
        "hindiName": user.hindiName,
        "hindiAddress": user.hindiAddress
    })
})
app.get('/api/fetchUser', async (req, res) => {
    const data = await userTable.find({});
    // console.log(data);
    res.json(data);
})

app.post("/api/send", (req, res) => {
    const { name, address, mobile, hindiName } = req.body;
    let record = {
        name: name,
        address: address,
        mobile: mobile,
        hindiName: hindiName
    }
    console.log(record);
    let item = new userTable(record);
    item.save(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result)
        }
    })
    res.redirect("/api/fetchUser");
    // res.send("ok")
})

app.delete("/api/deleteUser/:id", async (req, res) => {
    const { id } = req.params;
    const deleteData = await userTable.findByIdAndDelete(id);
    if (deleteData) {
        req.method = "GET";
        res.redirect(303, '/api/fetchUser');
    }
    else
        res.send("No Such User Found")
})

app.patch("/api/amountUpdate/:id", async (req, res) => {
    console.log("myUpdate Called");
    const { id } = req.params;
    const { amount, gift } = req.body;
    const updatedUser = await userTable.findByIdAndUpdate(id, req.body);
    console.log(updatedUser);
    res.json({
        "message": "query success updated user successfully"
    });
})

app.patch("/api/updateUser/:id", async (req, res) => {
    const { id } = req.params;
    const { name, address, amount, mobile, gift } = req.body;
    console.log(name, address, amount, mobile, gift)
    await userTable.findByIdAndUpdate(id, { name: name, address: address, amount: amount, mobile: mobile, gift: gift });
    req.method = "GET";
    res.redirect(303, '/api/fetchUser')
})


app.listen(3000, () => {
    console.log('listening to port http://localhost:3000')
})
app.use('/employee', employeeController);