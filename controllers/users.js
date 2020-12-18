'use strict';
const user = require('../models/user.model');
const nodemailer = require('nodemailer');
const secret = require('../secret/secretFile')
const twilio = require('twilio');

const client = new twilio(secret.twilio.accountSID, secret.twilio.authToken);

module.exports = function (_, passport, User, async) {

    var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secureConnection: false,
        service: "gmail",
        auth: {
            user: "altp.appchat@gmail.com",
            pass: "0971718434altp"
        }
    });

    let randomCode = null;
    randomCode = Math.floor(Math.random() * 1000000);

    return {
        SetRouting: function (router) {
            router.get('/', this.login);
            router.get('/test', this.loginEmail);
            router.get('/signup', this.getSignUp);
            router.get('/signupphone', this.getSignUpPhone);
            router.get('/verify', this.getPageVetify);
            //  router.post('/vetify', this.postPageVetify);
            router.get('/verifycode', this.getPageVetifyCode);
            router.get('/verifyfinal', this.getPageVetifyFinal);
            router.get('/vetifyemail', this.verifyEmail);
            router.get('/vetifyemail/final/', this.verifyEmailFinal);
            // router.get('/signupphone', this.getSignUpPhone);
            router.get('/logout', this.logout)
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            router.post('/', User.LoginValidation, this.postLogin);
            router.post('/signup', User.SignUpValidation, this.postSignUp);
            router.post('/signupphone', this.postSignUpPhone);
        },

        getPageVetify: function (req, res) {
            const errors = req.flash('error');
            return res.render('register', { title: 'Verify', messages: errors, hasErrors: errors.length > 0 });
        },

        getPageVetifyCode: function (req, res) {
           
            user.findOne({phone: req.query.sdt }, (err ,user) => {
                
                if (user) {
                    const errors = [];
                    errors.push('User with phone already exist');
                    // const errors = req.flash('error', 'User with phone already exist');
                    // console.log(errors);
                    return res.render('register',{ messages: errors, hasErrors: errors.length > 0 } );
                }

                    client.verify.services(secret.twilio.seviceID)
                    .verifications
                    .create({
                        to: `+84${req.query.sdt}`,
                        channel: "sms",
                        statusCallback: 'http://localhost:3000/verify'
                    }).then((data) => {
                        //res.status(200).send(data);
                        return res.render('verify', { data: data, sdt: req.query.sdt });
                    }).catch(function (err) {
                        // handle error
                        console.error(err);
                    });
                
            });
        },

        getPageVetifyFinal: (req, res) => {
            const errors = req.flash('error');
            client.verify.services(secret.twilio.seviceID)
                .verificationChecks
                .create({
                    to: `+84${req.query.sdt}`,
                    code: req.query.code
                }).then((data) => {
                    return res.render('signupphone', { data: data, sdt: req.query.sdt, messages: errors, hasErrors: errors.length > 0 });
                })
        },

        login: function (req, res) {
            const errors = req.flash('error');
            return res.render('index', { title: 'Login', messages: errors, hasErrors: errors.length > 0 });
        },

        loginEmail: function (req, res) {
            const errors = req.flash('error');
            return res.render('test', { title: 'Login', messages: errors, hasErrors: errors.length > 0 });
        },

        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getSignUp: function (req, res) {
            const errors = req.flash('error');
            return res.render('signup', { title: ' SignUp', email: req.query.email, messages: errors, hasErrors: errors.length > 0, rand: randomCode });
        },

        getSignUpPhone: function (req, res) {
            const errors = req.flash('error');
            return res.render('signupphone', { title: ' SignUp', sdt: req.query.sdt, messages: errors, hasErrors: errors.length > 0, rand: randomCode });
        },

        verifyEmail: function (req, res) {
            user.findOne({"email": req.query.email }, (err, email) => {
               if(email){
                const errors = [];
                errors.push('User with email already exist');

                return res.render('register',{ messages: errors, hasErrors: errors.length > 0 } );
               }
                var userName = req.query.email;
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

                smtpTransport.sendMail(
                    {
                        to: req.query.email,
                        subject: "Verify",
                        text: "Your ALTP vetifycation code is: " + " " + randomCode
                    },
                    function (err, response) {
                        if (err) {
                            console.log(err);
    
                            res.end("error");
                        } else {
                            // console.log("Message sent: " + response.message);
                            return res.render('verifyemail', { email: req.query.email });
                        }
                    }
                );
            });
            

        } ,

        verifyEmailFinal: function (req, res) {
            const errors = req.flash('error');
            console.log(req.query.email);
            if (req.query.code != randomCode) {
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                //console.log(fullUrl);
                
                return res.redirect('/vetifyemail?email=' + req.query.email);
               
                //return res.render('signup', {  email: req.query.email, messages: errors, hasErrors: errors.length > 0, rand: randomCode });
            }
            return res.render('signup', { email: req.query.email,code:req.query.code, messages: errors, hasErrors: errors.length > 0 });

        },

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        postSignUpPhone: passport.authenticate('local.signup.phone', {
            successRedirect: '/',
            failureRedirect: '/signupphone',
            failureFlash: true
        }),

        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),

        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']
        }),

        googleLogin: passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        logout: function (req, res) {
            req.logout();
            req.session.destroy((err) => {
                res.redirect('/');
            });
        },

    }

}















