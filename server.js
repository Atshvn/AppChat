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
const nodemailer = require('nodemailer');
const socketIO =  require('socket.io');
const http = require('http');
const path = require('path');
const {Users} = require('./helpers/UsersClass');
const {Global} = require('./helpers/Global');

const container = require('./container');
container.resolve(function (users, _, admin, home, profile, group, results, friend, privatechat) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://altp:altp@cluster0-shard-00-00.7rr7u.mongodb.net:27017,cluster0-shard-00-01.7rr7u.mongodb.net:27017,cluster0-shard-00-02.7rr7u.mongodb.net:27017/ALTPDB?ssl=true&replicaSet=atlas-avg5vm-shard-0&authSource=admin&retryWrites=true&w=majority', {useMongoClient: true});
    const app = SetupExpress();
    
    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        ConfigureExpress(app);
        const io = socketIO(server);
        server.listen( 3000, function () {
            console.log('Listening on port 3000');
        });
   

        require('./socket/groupchat')(io, Users);
        require('./socket/friend')(io);
        require('./socket/globalroom')(io, Global, _);
        require('./socket/privatemessage')(io);
        //Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        profile.SetRouting(router);
        group.SetRouting(router);
        results.SetRouting(router);
        friend.SetRouting(router);
        privatechat.SetRouting(router);
        app.use(router);

        app.use(function(req, res){
            res.render('404');
        });
    }


    function ConfigureExpress(app) {
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');


        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, 'views'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

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


















