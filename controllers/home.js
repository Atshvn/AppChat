
const User = require('../models/user.model');

module.exports = function (async, Group, _) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage);
            router.get('/logout', this.logout);
            router.post('/home', this.postHomePage);
            
        },
        homePage: function (req, res) {
            async.parallel([
                function (callback) {
                    Group.find({}, (err, result) => {
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
                const dataChunk =[];
                const chunksize = 4;
                for(let i =0; i < res1.length; i+= chunksize)
                {
                    dataChunk.push(res1.slice(i, i + chunksize));
                }
                res.render('home', { title: 'ALTP | Home', chunks: dataChunk , user: req.user, data: res2});
            })
        },
        postHomePage: function(req, res){
            async.parallel([
                function(callback){
                    Group.updateOne({
                        '_id': req.body.id,
                        'member.username': {$ne : req.user.username},
                    }, {
                        $push: {member : {
                            username : req.user.username,
                            email: req.user.email
                        }}
                    },(err, count) => {
                       
                        callback(err, count);
                    });
                }
            ], (err, results) => {
                res.redirect('/home');
            })
        },
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
        }

    }
}