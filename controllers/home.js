const { render } = require("ejs");

module.exports = function(async, Group, _){
    return{
        SetRouting: function(router){
            router.get('/home', this.homePage);
        },
        homePage: function(req, res){
            return render('home');
        }
    }
}