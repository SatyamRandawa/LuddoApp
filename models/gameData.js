const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    play_game: {
        type: Object
      },
  
    });


    module.exports = mongoose.model('game_results', schema);


