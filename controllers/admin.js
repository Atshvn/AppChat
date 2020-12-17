
// const path = require('path');
// const fs = require('fs');

const user = require('../models/user.model');
module.exports = function (aws, formidable, Group, async, _, passport, User) {

    return {
        SetRouting: function (router) {
            router.get('/dashboard', this.adminPage);
            router.get('/member', this.getAllUser);
            router.get('/member/:id', this.deleteUser);
           // router.get('/detailprofile', this.detailProfile);
            router.get('/admin', this.loginAdmin);
            router.post('/admin', this.postLoginAdmin);
            router.post('/uploadFile', aws.Upload.any(), this.uploadFile); //
            router.post('/postUser', User.SignUpValidationadmin, this.postUser);
        },
        loginAdmin: function (req, res) {
            const errors = req.flash('error');
            return res.render('admin/login', { user: req.user,title: 'Login', messages: errors, hasErrors: errors.length > 0 });
        },

        postLoginAdmin: passport.authenticate('local.login.admin', {
            successRedirect: '/dashboard',
            failureRedirect: '/admin',
            failureFlash: true
        }),
        adminPage: function (req, res) {
            const errors = req.flash('error');
            async.parallel([
                function (callback) {
                    user.find({}, (err, result) => {
                        callback(err, result);
                    })
                }
            ], (err, results) => {
                const res1 = results[0];
                const dataChunk = [];
                const chunksize = 4;
                for (let i = 0; i < res1.length; i += chunksize) {
                    dataChunk.push(res1.slice(i, i + chunksize));
                }
                res.render('admin/dashboard', { title: 'ALTP | Member', data: dataChunk,  user: req.user , messages: errors, hasErrors: errors.length > 0 });
            })
            //res.render('admin/dashboard',{ title: 'Dashboard | ALTP', user: req.user });
        },
       
        uploadFile: (req, res) => {
            const form = new formidable.IncomingForm();
            // form.uploadDir = path.join(__dirname, '../public/uploads');
            form.on('file', (field, file) => {
                // fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
                //     if(err) throw err;
                //     console.log('File renamed')
                // });            
            });
            form.on('error', (err) => {
                // console.log(err);
            });
            form.on('end', () => {
                //console.log('File Upload Successful');
            });
            form.parse(req);
        },
        getAllUser: (req, res) => {
            const errors = req.flash('error');
            async.parallel([
                function (callback) {
                    user.find({}, (err, result) => {
                        callback(err, result);
                    })
                }
            ], (err, results) => {
                const res1 = results[0];
                const dataChunk = [];
                const chunksize = 4;
                for (let i = 0; i < res1.length; i += chunksize) {
                    dataChunk.push(res1.slice(i, i + chunksize));
                }
                res.render('admin/member', { title: 'ALTP | Member', data: dataChunk,  user: req.user, messages: errors, hasErrors: errors.length > 0 });
            })
        },
        
        postUser: (req, res) => {
            user.findOne({'username': req.body.username }, (err, use) => {
                const errors = req.flash('error');
                // if (err) {
                //     return done(err);
                // }
              
                // if (user) {
                //     return done(null, false, req.flash('error', 'User already exist'));
                // }
        
                const newUserr = new user();
                newUserr.username = req.body.username;
                newUserr.fullname = req.body.username;
                newUserr.email = req.body.email;
                newUserr.phone = req.body.phone;
                newUserr.password = newUserr.encryptPassword(req.body.password);
        
                newUserr.save((err) => {
                    res.jsonp({success : true})
                    res.redirect('/dashboard');
                });
              
            });
            // var user = new User({
            //     username: req.body.username,
            //     fullname: req.body.username,
            //     email: req.body.email,
            //     password: req.body.password,
            //     phone: req.body.phone,
            //     userImage: 'defaultPic.png',

            // });
            // // result = User.addUser(user);
            // user.save().then((user) => {
            //     res.send(user);
            // }, (e) => {
            //     res.status(400).send(e);
            // });
        },
        deleteUser: function (req, res) {
            user.findOneAndRemove({
                '_id': req.params.id
            }, function(err, user) {
        
                if (err) throw err;       
                console.log("Success");
            });
        
            res.redirect('/dashboard');
           
        }
    }
}















