
const User = require('../models/user.model');
module.exports = function (async) {
    return {
        SetRouting: function (router) {
            router.get('/group/:name', this.groupPage);
            router.post('/group/:name', this.groupPostPage);
        },
        groupPage: function (req, res) {
            const name = req.params.name;

            async.parallel([
                function (callback) {
                    User.findOne({ 'username': req.user.username })
                        .populate('request.userId')

                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
            ], (err, results) => {
                const result1 = results[0];
                res.render('groupchat/group', { title: 'Group | ALTP', user: req.user, groupName: name, data: result1 });

            });

        },
        //themyeucauketban
        groupPostPage: function (req, res) {
            async.parallel([
                function (callback) {
                    if (req.body.receiverName) {
                        User.updateOne({
                            'username': req.body.receiverName,
                            'request.userId': { $ne: req.user._id },
                            'friendsList.friendId': { $ne: req.user._id }
                        },
                            {
                                $push: {
                                    request: {
                                        userId: req.user._id,
                                        username: req.user.username
                                    }
                                },
                                $inc: { totalRequest: 1 }
                            },
                            (err, count) => {
                                console.log(req.body.receiverName);
                                callback(err, count);
                            })
                    }
                }
                ,
                //themDaguiketban
                function (callback) {
                    if (req.body.receiverName) {
                        User.updateOne({
                            'username': req.user.username,
                            'sentRequest.username': { $ne: req.body.receiverName }
                        },
                            {
                                $push: {
                                    sentRequest: {
                                        username: req.body.receiverName
                                    }
                                },
                            }, (err, count) => {
                                callback(err, count);
                            })
                    }
                }
            ], (err, results) => {
                res.redirect('/group/' + req.params.name);
            });

            //themvaolishbb
            async.parallel([
                function (callback) {
                    if (req.body.senderId) {
                        User.updateOne({
                            '_id': req.user._id,
                            'friendList.friendId': { $ne: req.body.senderId }
                        }, {
                            $push: {
                                friendsList: {
                                    friendId: req.body.senderId,
                                    friendName: req.body.senderName,
                                    friendImg: req.body.senderImg
                                }
                            },
                            $pull: {
                                request: {
                                    userId: req.body.senderId,
                                    username: req.body.senderName
                                }
                            },
                            $inc: { totalRequest: -1 }
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                    // body
                },
                function (callback) {
                    if (req.body.senderId) {
                        User.updateOne({
                            '_id': req.body.senderId,
                            'friendList.friendId': { $ne: req.user._id }
                        }, {
                            $push: {
                                friendsList: {
                                    friendId: req.user._id,
                                    friendName: req.user.username,
                                    friendImg: req.body.senderImg
                                }
                            },
                            $pull: {
                                sentRequest: {

                                    username: req.user.username
                                }
                            }
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                    // body
                },
                function (callback) {
                    if (req.body.user_Id) {
                        User.updateOne({
                            '_id': req.user._id,
                            'request.userId': { $eq: req.body.user_Id }
                        }, {

                            $pull: {
                                request: {
                                    userId: req.body.user_Id,

                                }
                            },
                            $inc: { totalRequest: -1 }
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                function (callback) {
                    if (req.body.user_Id) {
                        User.updateOne({
                            '_id': req.body.user_Id,
                            'sentRequest.username': { $eq: req.body.username }
                        }, {

                            $pull: {
                                sentRequest: {
                                    username: req.body.username,

                                }
                            }
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                    // body
                }
            ], (err, results) => {
                res.redirect('/group/' + req.params.name);
            })
        }
    }
}