const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    mobile:{type:Number,require:true},
    gender:{type:String,require:true},
    address:{type:String,require:true},
    create_admin:{type:Boolean,default:0},
    date:{type:Date,default:Date()}
    
    });


    module.exports = mongoose.model('admin', adminSchema);


