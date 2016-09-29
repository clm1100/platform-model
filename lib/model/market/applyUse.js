
'use strict';

var Q = require('q');

var Base = require('../base');
var ApplyUse = require('../../schema').market.ApplyUse;
var util = require('platform-common').util;

var ApplyUseModel = module.exports = util.extend({
    _schema: ApplyUse
}, Base);


ApplyUseModel.getCount = function() {
    return Q.when(ApplyUse.count().exec());
}

ApplyUseModel.qList = function(options) {
    var a = ApplyUse.find()
        .sort({ 'createdAt': -1 })
        .limit(15)
        .skip(15 * (options.page-1))
        .exec();
    return Q.when(a);
};