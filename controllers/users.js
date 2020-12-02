'use strict';
const nodemailer = require('nodemailer');



module.exports = function (_, passport, User, async) {
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "altp.appchat@gmail.com",
            pass: "123456789altp"
        }
    });
    let randomCode = null;
    randomCode = Math.floor(Math.random() * 1000000);
    return {
        SetRouting: function (router) {
            router.get('/', this.loginEmail);
           // router.get('/login', this.loginEmail);
            router.get('/signup', this.getSignUp);
            router.get('/vetify', this.getPageVetify);
            // router.get('/vetifyemail', this.getvetifyEmail);
              router.post('/signup/vetifyemail', this.vetifyEmail);
            // router.get('/signupphone', this.getSignUpPhone);
            router.get('/logout', this.logout)
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            router.post('/', User.LoginValidation, this.postLogin);
            router.post('/signup', User.SignUpValidation, this.postSignUp);
           // router.post('/loginphone', User.LoginValidationPhone, this.postLoginPhone);
            // router.post('/signupphone', User.SignUpValidationPhone, this.postSignUpPhone);
        },
        getPageVetify: function(req, res){
            return res.render('xacthucemail');
        }
        ,
        // indexPage: function (req, res) {

        //     return res.render('verify');
        // },
        loginEmail: function(req, res){
            const errors = req.flash('error');
            return res.render('index',{ title: 'Login', messages: errors, hasErrors: errors.length > 0 });
        }
        ,
        // loginPhone: function(req, res){
        //     const errors = req.flash('error');
        //     return res.render('loginphone',{ title: 'Login', messages: errors, hasErrors: errors.length > 0 });
        // }
        // ,
        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),
        // postLoginPhone: passport.authenticate('local.login.phone', {
        //     successRedirect: '/home',
        //     failureRedirect: '/loginphone',
        //     failureFlash: true
        // }),

        getSignUp: function (req, res) {
            const errors = req.flash('error');
            return res.render('signup', { title: ' SignUp', messages: errors, hasErrors: errors.length > 0,rand: randomCode });
        },
        // getSignUpPhone: function (req, res) {
        //     const errors = req.flash('error');
        //     return res.render('signupphone', { title: ' SignUp', messages: errors, hasErrors: errors.length > 0 });
        // },
        // getvetifyEmail:function(req, res){
        //     res.render('verifyemail');

        // },
         vetifyEmail: function(req, res){
            var userName = req.body.email;
            console.log(userName);
            //const show_modal = !!req.body.modal;
            //var passWord = req.body.password;
            smtpTransport.sendMail(
              {
                to:'tuananh.0706999@gmail.com',
                subject: "Verification",
                text: "Your is code" + "   " + randomCode
              },
              function (err, response) {
                if (err) {
                  console.log(err);
                   
                    res.end("error");
                } else {
                    console.log("Message sent: " + response.message);
                    res.end("sent");
                }
              }
            );
           
        },
        postSignUp:  passport.authenticate('local.signup', {
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
        },
       
    }

}















