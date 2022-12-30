const secret = Math.random().toString(36).substring(7);
var mongoose = require('mongoose'); 
mongoose.connect('mongodb+srv://SatyamRandawa:loveyam@cluster0.d2cql.mongodb.net/?retryWrites=true&w=majority');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
     console.log("mongodb database connected");
   });
  
module.exports = {
    secret,
    lobbyTimeout: 10000,
    lobbyTimeoutCheckInterval: 5000,
    port: 8080,
    baseUrlFullPath: "http://localhost:8080" ,
    baseUrl: '/'       //For use with reverse proxies.
};
