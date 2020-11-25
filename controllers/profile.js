const User = require('../models/user.model');
module.exports = function (aws, formidable, async, Message, FriendResult) {
    return {
        SetRouting: function (router) {
            router.get('/settings/profile', this.getProfilePage);
            router.post('/userupload', aws.Upload.any(), this.userUpload);
            router.post('/settings/profile', this.postProfilePage);
        },
        getProfilePage: function (req, res) {
            async.parallel([
                function (callback) {
                    User.find({'_id': req.user._id }, (err, result) => {
                        callback(err, result);
                    })
                },
                function (callback) {
                    User.findOne({ 'username': req.user.username })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
                function (callback) {
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i");
                    Message.aggregate(
                        { $match: { $or: [{ "senderName": nameRegex }, { "receiverName": nameRegex }] } },
                        { $sort: { "createdAt": -1 } },
                        {
                            $group: {
                                "_id": {
                                    "last_message_between": {
                                        $cond: [
                                            {
                                                $gt: [
                                                    { $substr: ["$senderName", 0, 1] },
                                                    { $substr: ["$receiverName", 0, 1] }]
                                            },
                                            { $concat: ["$senderName", " and ", "$receiverName"] },
                                            { $concat: ["$receiverName", " and ", "$senderName"] }
                                        ]
                                    }
                                }, "body": { $first: "$$ROOT" }
                            }
                        },function(err, newResult){
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];
                            
                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            });
                        }
                    )
                }
            ], (err, results) => {
                const res2 = results[1];
                const res3 = results[2];

               //res.send(res3)
               res.render('user/profile', { title: 'Profile | ALTP', user: req.user, data: res2, chat: res3 });
            })
            
        },
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
            FriendResult.PostRequest(req, res, '/settings/profile');
        },
      
    }
}