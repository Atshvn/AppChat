const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
//dependable
const container = require('./container');

container.resolve(function (users) {

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/AppChatAtsh', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, function () {
            console.log('Listening on port 3000')
        });
        ConfigureExpress(app);
        //cai dat router
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);
    }



    function ConfigureExpress(app) {
        require('./passport/passport-local');


        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(check());
        app.use(session({
            secret: 'thisIsASecretKey',
            resave: true,
            saveUninitialized: true,
            store: new mongoStore({ mongooseConnection: mongoose.connection })
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
    }
})
