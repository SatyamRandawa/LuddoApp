const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    dish_num: { type: Number ,default: 0},
    admin_status: { type:Boolean ,default: 0},
    game_id :{ type: Number ,default: 50},

    });


    module.exports = mongoose.model('admin_dish_sets', schema);


