
const User = require('../models/user.model');

module.exports = function (async, Group, _) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage);
            
        },
        homePage: function (req, res) {
            async.parallel([
                function (callback) {
                    Group.find({}, (err, result) => {
                        callback(err, result);
                    })
                }
            ], (err, results) => {
                const res1 = results[0];
                const dataChunk =[];
                const chunksize = 4;
                for(let i =0; i < res1.length; i+= chunksize)
                {
                    dataChunk.push(res1.slice(i, i + chunksize));
                }
                res.render('home', { title: 'ALTP | Home', data: dataChunk , user: req.user});
            })
        }

    }
}