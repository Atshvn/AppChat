
const User = require('../models/user.model');

module.exports = function (async, Group, _, FriendResult, Message) {
    return {
        SetRouting: function (router) {
            router.get('/friends', this.getFriends);
            router.post('/friends', this.postFriends);
            router.get('/friend/:id', this.removeFriend);
            router.get('/results/friend', this.getResultsFriend);
            router.post('/results/friend', this.postResultsFriend);
        //    router.get('/friend/profile/:id', this.getProfileFriend);

        },
        getFriends: function (req, res) {
            async.parallel([
                function (callback) {
                    User.find({ '_id': req.user._id }, (err, result) => {
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
                        }, function(err, newResult){
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];                            
                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            });
                        }
                    )
                }, function (callback) {
                    User.find({}, (err, result) => {
                        callback(err, result);
                    })
                },

            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = res1[0].friendsList;
                const res4 = results[2];
                const res5 = results[3];
                const dataChunk = [];
                const chunksize = 4;
                const dataChunkall = [];
                const chunksizeall = 1;
                for (let i = 0; i < res3.length; i += chunksize) {
                    dataChunk.push(res3.slice(i, i + chunksize));
                }
                for (let i = 0; i < res5.length; i += chunksizeall) {
                    dataChunkall.push(res5.slice(i, i + chunksizeall));
                }
                //res.send(res3)
                res.render('user/friend', { title: 'ALTP | Friends', chunks: dataChunk, user: req.user, data: res2, chat: res4, all: dataChunkall });
            })
        },
        postFriends: function(req, res){
            FriendResult.PostRequest(req, res, '/friend');
        },
        removeFriend: function (req, res) {
            async.parallel([
                function (callback) {
                    User.updateOne({
                        'friendsList.friendId': req.params.id,
                    }, {
                        $pull: {
                            friendsList: {
                                friendId: req.params.id,
                            }
                        }
                    }, (err, count) => {
                        callback(err, count);
                    });
                },
                function (callback) {
                    User.updateOne({
                        '_id': req.params.id
                    },
                        {
                            $pull: {
                                friendsList: {
                                    friendId: req.user._id,
                                }
                            }
                        }, (err, count) => {
                            callback(err, count);
                        });
                }], (err, results) => {
                    res.redirect('/friends');
                })
        },
        getResultsFriend: function(req, res){
            res.redirect('/friends');
        },
        postResultsFriend: function(req, res){
            
            FriendResult.PostRequest(req, res, '/results/friend');
            async.parallel([
                function (callback) {
                    const Regex = new RegExp((req.body.name), 'gi')
                    User.find({'$or': [{'username': Regex}, {'email': Regex},{'phone': Regex}]}, (err, result) => {
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
                        }, function(err, newResult){
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];                            
                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            });
                        }
                    )
                }, function (callback) {
                    User.find({ '_id': req.user._id }, (err, result) => {
                        callback(err, result);
                    })
                },
                //  function (callback) {
                //     User.find({}, (err, result) => {
                //         callback(err, result);
                //     })
                // },
           
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                const res4 = results[3];
                const res5 = res4[0].friendsList;
                // const res6 = results[4];
                const dataChunkfriend = [];
                const chunksizefriend = 1;
                // const dataChunkall = [];
                // const chunksizeall = 1;
                for (let i = 0; i < res5.length; i += chunksizefriend) {
                    dataChunkfriend.push(res5.slice(i, i + chunksizefriend));
                }
                // for (let i = 0; i < res6.length; i += chunksizeall) {
                //     dataChunkall.push(res6.slice(i, i + chunksizeall));
                // }
                const dataChunk =[];
                const chunksize = 4;
                for(let i =0; i < res1.length; i+= chunksize)
                {
                    dataChunk.push(res1.slice(i, i + chunksize));
                }
                res.render('resultsFriend', { title: 'ALTP | Home', chunks: dataChunk , user: req.user,data: res2, chat: res3, chunksfriend: dataChunkfriend});
            })
        },
    }
}
