const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    mobile:{type:Number,require:true},
    image:{type:String,require:true},
    gender:{type:String,require:true},
    address:{type:String,require:true},
    date:{type:Date,default:Date()}
    
    });


    module.exports = mongoose.model('user', userSchema);


