
const User = require('../models/user.model');
module.exports = function(async, Group){
    return{
        SetRouting : function(router){
            router.get('/results', this.getResults);
           
            router.post('/results', this.postResults);

        },
        getResults: function(req, res){
            res.redirect('/home');
        },
        postResults : function(req, res){
            async.parallel([
                function (callback) {
                    const Regex = new RegExp((req.body.name), 'gi');
                    Group.find({'$or': [{'name': Regex}, {'title': Regex}]}, (err, result) => {
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
                res.render('results', { title: 'ALTP | Home', chunks: dataChunk , user: req.user,data: res2});
            })
        }
    }
}