const mongoose = require('mongoose')

const User_Schema = new mongoose.Schema({
    image :{
       type : String
    },
    First_name : {
        type : String
    },
    Last_name : {
        type : String
    },
    email : {
        type : String
    },
    phone : {
        type : String
    },
    blocked : {
        type : String
    },
    isDeletd : {
        type : String
    },
    Date_Of_Birth : {
        type : String
    },
    age : {
        type : Number
    },
    Latitude : {
        type : String
    },
    Longitude : {
        type : String
    },
    password : {
        type : String
    },
    Login_otp:{
        type : Number
    },
    address : {
        type : String
    },
    wrongpassword : {
        type : Number,
        default : 0
    }

},{timestamps : true})

module.exports = mongoose.model('Users' , User_Schema )