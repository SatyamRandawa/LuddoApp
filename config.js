const secret = "LUDOToken"
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
  baseUrlFullPath: "http://ec2-3-113-5-221.ap-northeast-1.compute.amazonaws.com:8080",
    baseUrl: '/'       //For use with reverse proxies.
};
