const mongoose = require('mongoose');
// Ma hoa pass
const bcrypt =  require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
        userName: { type: String, unique: true},
        fullName: { type: String, unique: true, default: ''},
        email: { type: String, unique: true},
        passWord: { type: String, default: ''},
        userImage: { type: String, default: 'default.png'},
        facebook: { type: String, default: ''},
        fbTokens: Array,
        google: { type: String, default: ''},
        googleTokens: Array,

});

userSchema.methods.encryptPassword = function(passWord){
    return bcrypt.hashSync(passWord, bcrypt.genSaltSync(10), null);

}
userSchema.methods.validUserPassword = function(passWord){
    return bcrypt.compareSync(passWord, this.passWord);
};

module.exports = mongoose.model('User', userSchema);