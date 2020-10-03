'use strict';
const passport = require('passport');
const User = require('../models/user.model');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true, //kiem tra nguoi dung da dnag nhap hay chua
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, req.flash('error', 'Email đã được sử dụng, vui lòng chọn email khác'));

        }
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        console.log(newUser.email);
        newUser.save((err) => {
            done(null, newUser);
        })
    })
}));