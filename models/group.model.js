const mongoose = require('mongoose');

const group = mongoose.Schema({
    name: { type: String, default:''},
    title: { type: String, default: ''},
    image : { type: String, default:'default.png'},
    member: [{ 
        username: {type: String, default: ''},
        email: { type: String, default: ''},
        address:{type: String, default: ''},
        gender:{type: String, default: ''},
        aboutme:{type: String, default: ''},
        phone: {type: Number, default: ''},
        userImage: {type: String, default: 'defaultPic.png'},
    }]
});
module.exports = mongoose.model('Group', group);