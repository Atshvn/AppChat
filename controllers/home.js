

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
                const res2 = results[1];
                const res3 = results[2];
                const res4 = results[3];
                const dataChunk = [];
                const chunkSize = 3;
                for (let i = 0; i < res1.lenght; i += chunkSize) {
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }

                res.render('home', { title: 'ALTP | Home', chunks: dataChunk });
            })
        }
    }
}