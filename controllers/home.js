
const User = require('../models/user.model');

module.exports = function (aws, async, Group, _, Message, FriendResult) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage);
            router.get('/logout', this.logout);
            router.post('/home/newgroup', this.postGroup);
            router.post('/home', this.postHomePage);
            router.post('/uploadFile', aws.Upload.any(), this.uploadFile);
            
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
                                }, "body": { $last: "$$ROOT" }
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
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                const dataChunk =[];
                const chunksize = 4;
                for(let i =0; i < res1.length; i+= chunksize)
                {
                    dataChunk.push(res1.slice(i, i + chunksize));
                }
                res.render('home', { title: 'ALTP | Home', chunks: dataChunk , user: req.user, data: res2, chat: res3});
            })
        },
        postGroup: function(req, res){
            const newGroup = new Group();
            newGroup.name = req.body.group;
            newGroup.title = req.body.title;
            newGroup.image = req.body.upload;
            newGroup.save((err) => {

                res.redirect('/home')
            })
        }
        ,
        postHomePage: function(req, res){
            async.parallel([
                function(callback){
                    Group.updateOne({
                        '_id': req.body.id,
                        'member.username': {$ne : req.user.username},
                    }, {
                        $push: {member : {
                            username : req.user.username,
                            email: req.user.email,
                            phone: req.user.phone,
                            userImage: req.user.userImage,
                            address: req.user.address,
                            gender: req.user.gender,
                            aboutme: req.user.aboutme
                        }}
                    },(err, count) => {
                       
                        callback(err, count);
                    });
                },
               
            ], (err, results) => {
                res.redirect('/home');
            });
            FriendResult.PostRequest(req, res, '/home');
        },
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
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
        }

    }
}