'use strict';
const nodemailer = require('nodemailer');

module.exports = function (_, passport, User) {

    return {
        SetRouting: function (router) {
            router.get('/', this.indexPage);
            router.get('/login', this.loginEmail);
            router.get('/loginphone', this.loginPhone);
            router.get('/signup', this.getSignUp);
            // router.get('/signupphone', this.getSignUpPhone);
            router.get('/logout', this.logout)
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            router.post('/login', User.LoginValidation, this.postLogin);
            router.post('/signup', User.SignUpValidation, this.postSignUp);
            router.post('/loginphone', User.LoginValidationPhone, this.postLoginPhone);
            // router.post('/signupphone', User.SignUpValidationPhone, this.postSignUpPhone);
        },
        indexPage: function (req, res) {

            return res.render('verify');
        },
        loginEmail: function(req, res){
            const errors = req.flash('error');
            return res.render('index',{ title: 'Login', messages: errors, hasErrors: errors.length > 0 });
        }
        ,
        loginPhone: function(req, res){
            const errors = req.flash('error');
            return res.render('loginphone',{ title: 'Login', messages: errors, hasErrors: errors.length > 0 });
        }
        ,
        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true
        }),
        postLoginPhone: passport.authenticate('local.login.phone', {
            successRedirect: '/home',
            failureRedirect: '/loginphone',
            failureFlash: true
        }),

        getSignUp: function (req, res) {
            const errors = req.flash('error');
            return res.render('signup', { title: ' SignUp', messages: errors, hasErrors: errors.length > 0 });
        },
        // getSignUpPhone: function (req, res) {
        //     const errors = req.flash('error');
        //     return res.render('signupphone', { title: ' SignUp', messages: errors, hasErrors: errors.length > 0 });
        // },

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        // postSignUpPhone: passport.authenticate('local.signup.phone', {
        //     successRedirect: '/loginphone',
        //     failureRedirect: '/signupphone',
        //     failureFlash: true
        // }),


        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),
        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']
        }),
        
        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
        }
    }

}















