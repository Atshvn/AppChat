const User = require('../models/user.model');
module.exports = function (aws, formidable, async) {
    return {
        SetRouting: function (router) {
            router.get('/settings/profile', this.getProfilePage);

            router.post('/userupload', aws.Upload.any(), this.userUpload);
            router.post('/settings/profile', this.postProfilePage);

        },

        getProfilePage: function (req, res) {
            res.render('user/profile', { title: 'Profile | ALTP', user: req.user });
        }
        ,
        userUpload: function (req, res) {
            const form = new formidable.IncomingForm();

            form.on('file', (field, file) => { });

            form.on('error', (err) => { });

            form.on('end', () => { });

            form.parse(req);
        },

        postProfilePage: function (req, res) {
            async.waterfall([
                function (callback) {
                    User.findOne({ '_id': req.user._id }, (err, result) => {
                        callback(err, result);
                    })
                },

                function (result, callback) {
                    if (req.body.upload === null || req.body.upload === '') {
                        User.updateOne({
                            '_id': req.user._id
                        },
                            {
                                username: req.body.username,
                                fullname: req.body.fullname,
                                address: req.body.address,
                                gender: req.body.gender,
                                aboutme: req.body.aboutme,
                                userImage: req.body.upload.replace("C:\\fakepath\\", ""),
                            },
                            {
                                upsert: true
                            }, (err, result) => {
                                res.redirect('/settings/profile');
                            })

                    } else if (req.body.upload !== null || req.body.upload !== '') {
                        User.updateOne({
                            '_id': req.user._id

                        },
                            {
                                username: req.body.username,
                                fullname: req.body.fullname,
                                address: req.body.address,
                                gender: req.body.gender,
                                aboutme: req.body.aboutme,
                                userImage: req.body.upload.replace("C:\\fakepath\\", ""),

                            },
                            {
                                upsert: true
                            }, (err, result) => {
                                res.redirect('/settings/profile');
                            })
                    }
                    
                }
            ]);
        }
    }
}