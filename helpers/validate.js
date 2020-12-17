const {check} = require('express-validator');

let validateRegisterUser = () => {
  return [ 
    check('user.username', 'username does not Empty').not().isEmpty(),
    check('user.username', 'username more than 5 degits').isLength({ min: 5 }),
    check('user.email', 'Invalid does not Empty').not().isEmpty(),
    check('user.email', 'Invalid email').isEmail(),
    check('user.phone', 'Invalid does not Empty').not().isEmpty(),
    check('user.phone', 'Invalid Pgone').isLength({ max:10}),
    check('user.password', 'Invalid does not Empty').not().isEmpty(),
    check('user.password', 'password more than 6 degits').isLength({ min: 6 })
  ]; 
}


let validate = {
  validateRegisterUser: validateRegisterUser,
};

module.exports = {validate};