const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const port= 3000;

const container = require('./container');



container.resolve(function (users, _) {

    mongoose.connect('mongodb://localhost/AppChatAtsh', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const app = SetupExpress();
    function SetupExpress() {
        const app = express();
        app.listen( port, function () {
            console.log('Listening on port 3000');
        });
        ConfigureExpress(app);
        //Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        app.use(router);


    }


    function ConfigureExpress(app) {
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(validator());

        app.use(session({
            secret: 'ThisIsASecretKey',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({ mongooseConnection: mongoose.connection })
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.locals._ = _;
    }

});


















