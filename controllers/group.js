
const User = require('../models/user.model');
module.exports = function (async,Group, Message, FriendResult, GroupMessage) {
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
                }, function (callback) {
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
                        }, function (err, newResult) {
                            const arr = [
                                { path: 'body.sender', model: 'User' },
                                { path: 'body.receiver', model: 'User' }
                            ];
                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            });
                        }
                    )
                },
                function (callback) {
                    GroupMessage.find({})
                        .populate('sender')
                        .exec((err, result) => {
                            callback(err, result)
                        });
                },
                function (callback) {
                    Group.find({ 'name': req.params.name }, (err, result) => {
                        callback(err, result);
                    })
                },

            ], (err, results) => {
                const result1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                const res4 = results[3];
                const res5 = res4[0].member;
                const dataChunk = [];
                const chunksize = 1;
                for (let i = 0; i < res5.length; i += chunksize) {
                    dataChunk.push(res5.slice(i, i + chunksize));
                }
                res.render('groupchat/group', { user: req.user, groupName: name,
                data: result1, chat: res2, groupMsg: res3, chunks: dataChunk,  });

            });

        },
        //themyeucauketban
        groupPostPage: function (req, res) {
            FriendResult.PostRequest(req, res, '/group/' + req.params.name);
            async.parallel([
                function (callback) {
                    if (req.body.message) {
                        const groupmg = new GroupMessage();
                        groupmg.sender = req.user._id;
                        groupmg.body = req.body.message;
                        groupmg.name = req.body.groupName;
                        groupmg.createdAt = new Date();

                        groupmg.save((err, msg) => {
                            callback(err, msg);
                        });
                    }
                }
            ], (err, results) => {
                res.redirect('/group/' + req.params.name);
            });
        }
    }
}