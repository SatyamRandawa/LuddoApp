const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Dr_DOC = new mongoose.Schema({
     Doctor_ID:{
        type: Schema.Types.ObjectId, ref: 'Doctor'
     },
    Provisional : {
        type : String
    },

   Medical_License : {
    type : String
   },

   Aadhar_Card : {
    type : String
   },

   Pen_Card : {
    type : String
   },

   Experience_Certificate : {
    type : String
   }

},{timestamps : true})

module.exports = mongoose.model('Dr_documents', Dr_DOC)