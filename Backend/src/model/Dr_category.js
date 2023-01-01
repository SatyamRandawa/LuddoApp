const mongoose = require('mongoose')

const Dr_category = new mongoose.Schema({
    Dr_cat :{
        type : Array
    }
},{timestamps : true})

module.exports = mongoose.model('Dr_category', Dr_category)