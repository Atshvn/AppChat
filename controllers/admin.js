
// const path = require('path');
// const fs = require('fs');
const User = require('../models/user.model');
module.exports = function (aws, formidable, Group, async) {

    return {
        SetRouting: function (router) {
            router.get('/dashboard', this.adminPage);
            router.get('/member', this.getAllUser);
            router.get('/member/:id', this.deleteUser);
            router.get('/detailprofile', this.detailProfile);

            router.post('/uploadFile', aws.Upload.any(), this.uploadFile); //
            router.post('/dashboard', this.adminPostPage);
            router.post('/postUser', this.postUser);

        },
        adminPage: function (req, res) {
            res.render('admin/dashboard');
        },
        detailProfile:  function (req, res) {
            res.render('detailprofile',  { title: 'Profile | ALTP', user: req.user });
        },
        adminPostPage: function (req, res) {
            const newGroup = new Group();
            newGroup.name = req.body.group;
            newGroup.title = req.body.title;
            newGroup.image = req.body.upload;
            newGroup.save((err) => {

                res.render('admin/dashboard');
            })
        }
        ,
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
            async.parallel([
                function (callback) {
                    User.find({}, (err, result) => {
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
                res.render('admin/member', { title: 'ALTP | Member', data: dataChunk });
            })
        },
        postUser: (req, res) => {
            var user = new User({
                username: req.body.username,
                fullname: req.body.username,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                userImage: 'defaultPic.png',

            });
            // result = User.addUser(user);
            user.save().then((user) => {
                res.send(user);
            }, (e) => {
                res.status(400).send(e);
            });
        },
        deleteUser: function (req, res) {
            User.findOneAndRemove({
                '_id': req.params.id
            }, function(err, user) {
        
                if (err) throw err;
        
                console.log("Success");
        
            });
        
            res.redirect('/member');
           
        }
    }
}















