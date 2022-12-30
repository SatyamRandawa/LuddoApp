const mongoose = require('mongoose')

const set_color = new mongoose.Schema({
    gameID : {
        type : Number
    },

    PlayerID1:{
        type : Array
    },

    PlayerID2:{
        type : Array
    },

    PlayerID3 : {
       type : Array
    },

    playerID4:{
        type : Array
    }
},{timestamps : true})


module.exports = mongoose.model('Set_goat_color', set_color)