


module.exports = function (async,Group, _) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage);
        },
        getGroup: function(req, res){
            Group.find().then((group) => {
                res.send({ group });
            }, (e) => {
                res.status(400).send (e);
            });
        }
        ,
        homePage: function (req, res) {
            async.parallel([
                function (callback) {
                    Group.find({}, (err, result) => {
                        callback(err, result);
                    })
                }


            ], (err, results) => {
                const res1 = results[0];
                console.log(res1);
                // const dataChunk = [];
                // const chunkSize = 3;
                // for (let i = 0; i < res1.lenght; i += chunkSize) {
                //     dataChunk.push(res1.slice(i, i+chunkSize));
                // }

                res.render('home', { title: 'ALTP | Home',data: res1 });
            })
        }
        
    }
}