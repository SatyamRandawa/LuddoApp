const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Appoiments = new mongoose.Schema({
    userID : {
        type: Schema.Types.ObjectId, ref: 'Users'
    },
    Doctor_ID : {
        type: Schema.Types.ObjectId, ref: 'Doctor'
    },
    status :{
        type : String,
        default : "pending"
    },
    slot_time : {
        type : String
    },
    date : {
        type : String
    },
    payment_status : {
        type : String,
        default : "pending "
    },
    isBooked :{
        type : Boolean,
        default : false
    }

},{timestamps : true})


module.exports = mongoose.model("appoiments", Appoiments)