const mongoose = require("mongoose")

const Doctor_Schema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    image:{
      
        type: String,
        
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    hospital_address :{
        type:String
    },
    postCode: {
        type: String
    },
    otp: {
        type: Number,
        default: ""
    },
    wrongOTP: {
        type: Number,
        default: 0
    },

    wrongpassword: {
        type: Number,
        default: 0
    },

    blocked: {
        type: Number,
        default: 0
    },

    isDeleted: {
        type: Number,
        default: 0
    },

    Longitude :{
        type : String,
        default : ""
    },

    Latitude :{
        type : String,
        default : ""
    },
    Documents : {
        type : Number,
        default : 0
    },
    specialities:{
        type : Array
    },
    status : {
        type : String,
        default : "pending"
    },
    Experience : {
        type : Number,
        default : 1
    }


}, { timestamps: true })

module.exports = mongoose.model('Doctor', Doctor_Schema)