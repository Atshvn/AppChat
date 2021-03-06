const dependable = require('dependable');
const path = require('path');
// const _ = require('lodash');

const container = dependable.container();

const simpleDependencies = [
    ['_', 'lodash'],
    ['passport','passport'],
    ['formidable', 'formidable'],
    ['Group', './models/group.model'],
    ['GroupMessage', './models/groupmessage.model'],
    ['Message', './models/message.model'],
    ['aws', './helpers/AWSUpload'],
    ['async', 'async'],
];

simpleDependencies.forEach(function(val){
    container.register(val[0], function(){
        return require(val[1]);
    })
});
container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container', function(){
    return container;
} );

module.exports = container;