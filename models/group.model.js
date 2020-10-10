const mongoose = require('mongoose');

const group = mongoose.Schema({
    name: { type: String, default:''},
    title: { type: String, default: ''},
    image : { type: String, default:'default.png'},
    menber: [{ 
        username: {type: String, default: ''},
        email: { type: String, default: ''},
    }]
});
module.exports = mongoose.model('Group', group);