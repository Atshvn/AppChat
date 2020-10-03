'use strict';
const passport = require('passport');
module.exports = function(_, passport){
    return{
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);


// POST SIGNUP
            router.post('/signup', this.postSignUp);
        },

        indexPage: function(req, res){
            return res.render('index');
        },

        getSignUp: function(req, res){
            return res.render('signup')
        },
        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        })
        ,
        homePage: function(req, res){
            return res.render('home');
        }
        ,

    }

}