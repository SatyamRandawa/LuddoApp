const mongoose = require('mongoose')


const BlocckedIPS =  new mongoose.Schema({
      IP :{
        type:String,
        required:true
      },
},{timestamps:true})

module.exports = mongoose.model('blockIPs', BlocckedIPS)