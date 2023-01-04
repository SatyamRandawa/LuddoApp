const mongoose = require('mongoose')


const Rooms_players = new mongoose.Schema({
    playerId: {
        type : Number
    },
        playerName:{
            type : String
        },
        ingame:{
            type : Boolean
        },
        ready:{
            type : Boolean
        },
        spectating:{
            type : Boolean
        },
        inLobby:{
            type : Boolean
        },
        lastActiveLobby:{
            type : Date
        },
        RoomID:{
            type : Number
        },
},{timestamps:true})


module.exports = mongoose.model('Rooms_players', Rooms_players)