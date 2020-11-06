
const User = require('../models/user.model');

module.exports = function (async, Group, _) {
    return {
        SetRouting: function (router) {
            router.get('/friends', this.getFriends);
            router.get('/friend/:id', this.removeFriend)

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
                }
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = res1[0].friendsList;
                const dataChunk = [];
                const chunksize = 4;
                for (let i = 0; i < res3.length; i += chunksize) {
                    dataChunk.push(res3.slice(i, i + chunksize));
                }
                //res.send(res3)
                res.render('user/friend', { title: 'ALTP | Friends', chunks: dataChunk, user: req.user, data: res2 });
            })
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
        }
    }
}
