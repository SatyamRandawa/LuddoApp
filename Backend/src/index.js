const express = require('express')
const AdminRoute = require('./routes/AdminRoute')
const userRoutes = require("./routes/user_routes")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
//app.options('*', cors())

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}

//app.use(cors(corsOptions));
app.use(cors())


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");
app.use(multer().any())




mongoose.connect("mongodb+srv://SatyamRandawa:Loveyam@cluster0.s50dt.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true })

    .then(() => {
        console.log("MongoDb connected")
    }).catch((err) => {
        console.log(err.message)
    });

app.use('/', AdminRoute);
app.use('/', userRoutes);





app.listen(process.env.Port || 443, function () {
    console.log('App running on port ' + (process.env.PORT || 443))
});


