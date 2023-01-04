const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const dr_avail_slots = new mongoose.Schema({

    Doctor_ID: {
        type: Schema.Types.ObjectId, ref: 'Doctor'
    },
    date: {
        type: String
    },
    time_Slots: {
        type: Array
    },

    isAbsent: {
        type: Boolean
    }

}, { timestamps: true })

module.exports = mongoose.model('Doctor_avail_slots', dr_avail_slots)