'use strict';

const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, false, req.flash('error', 'User with email already exist'));
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        //newUser.phone = req.body.phone;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            done(null, newUser);
        });
    });
}));

// passport.use('local.signup.phone', new LocalStrategy({
//     usernameField: 'phone',
//     passwordField: 'password',
//     passReqToCallback: true
// }, (req, phone, password, done) => {

//     User.findOne({'phone': phone }, (err, user) => {
//         if (err) {
//             return done(err);
//         }

//         if (user) {
//             return done(null, false, req.flash('error', 'User with phone already exist'));
//         }

//         const newUserr = new User();
//         newUserr.username = req.body.username;
//         newUserr.fullname = req.body.username;
//         newUserr.email = req.body.email;
//         newUserr.phone = req.body.phone;
//         newUserr.password = newUserr.encryptPassword(req.body.password);

//         newUserr.save((err) => {
//             done(null, newUserr);
//         });
//     });
// }));
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(err);
        }

        const messages = [];
        if (!user || !user.validUserPassword(password)) {
            messages.push('Email Does Not Exist or Password is Invalid');
            return done(null, false, req.flash('error', messages));
        }

        return done(null, user);
    });
}));
passport.use('local.login.phone', new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password',
    passReqToCallback: true
}, (req, phone, password, done) => {

    User.findOne({ 'phone': phone }, (err, user) => {
        if (err) {
            return done(err);
        }

        const messages = [];
        if (!user || !user.validUserPassword(password)) {
            messages.push('Phone Does Not Exist or Password is Invalid');
            return done(null, false, req.flash('error', messages));
        }
        return done(null, user);
    });
}));































