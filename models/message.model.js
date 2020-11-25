const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var messageSchema = mongoose.Schema({
    message: { type: String},
    sender: { type: mongoose.Schema.ObjectId, ref: 'User'},
    receiver: { type: mongoose.Schema.ObjectId, ref: 'User'},
    senderName: { type: String},
    receiverName: { type: String},
    userImage: { type: String, default: 'defaultPic.png'},
    isReal: { type: Boolean, default: false},
    createAt: { type:Date, default: Date.now}

});

module.exports = mongoose.model('Message', messageSchema);