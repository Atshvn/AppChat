'use strict';

module.exports = function(){
    return {
        SignUpValidation: (req, res, next) => {
            req.checkBody('username', 'Username is Required').notEmpty();
            req.checkBody('username', 'Username Must Not Be Less Than 5').isLength({min: 5});
            //req.checkBody('email', 'Email is Required').notEmpty();
            //req.checkBody('email', 'Email is Invalid').isEmail();
           //     req.checkBody('phone', 'Phone is Invalid').isLength({ max:10});
            req.checkBody('password', 'Password is Required').notEmpty();
            req.checkBody('password', 'Password Must Not Be Less Than 5').isLength({min: 5});
            
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                
                    req.flash('error', messages);
                    console.log(req.originalUrl);
                    //vetifyemail/final?email=tuananh.0706999%40gmail.com&code=709345
                    res.redirect(req.originalUrl);
                })
                .catch((err) => {
                    return next();
                })
        },
        SignUpValidationadmin: (req, res, next) => {
            req.checkBody('username', 'Username is Required').notEmpty();
            req.checkBody('username', 'Username Must Not Be Less Than 5').isLength({min: 5});
            req.checkBody('email', 'Email is Invalid').isEmail();
                req.checkBody('phone', 'Phone is Invalid').isLength({ max:10});
            req.checkBody('password', 'Password is Required').notEmpty();
            req.checkBody('password', 'Password Must Not Be Less Than 5').isLength({min: 5});
            
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                
                    req.flash('error', messages);
                    //vetifyemail/final?email=tuananh.0706999%40gmail.com&code=709345
                    res.redirect('/dashboard');
                })
                .catch((err) => {
                    return next();
                })  
        },
        LoginValidation: (req, res, next) => {
           // req.checkBody('email', 'Email is Required').notEmpty();
           // req.checkBody('email', 'Email is Invalid').isEmail();
            req.checkBody('password', 'Password is Required').notEmpty();
            req.checkBody('password', 'Password Must Not Be Less Than 5').isLength({min: 5});
            
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                
                    req.flash('error', messages);
                    res.redirect('/');
                })
                .catch((err) => {
                    return next();
                })
        },

        VerifyValidationPhone: (req, res, next) => {
            //req.checkBody('sdt', 'Phone is Required').notEmpty();
            req.checkBody('sdt', 'Phone is Invalid').isLength({ max:11});
            req.checkBody('email', 'Email is Invalid').isEmail();
           // req.checkBody('password', 'Password is Required').notEmpty();
            //req.checkBody('password', 'Password Must Not Be Less Than 5').isLength({min: 5});
            
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                
                    req.flash('error', messages);
                    res.redirect('/verify');
                })
                .catch((err) => {
                    return next();
                })
        },
       
    }
}






