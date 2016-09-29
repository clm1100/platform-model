/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var RequireFeedback = require('../../schema').market.RequireFeedback;
var util = require('platform-common').util;

var RequireFeedbackModel = module.exports = util.extend({
    _schema: RequireFeedback
}, Base);


RequireFeedbackModel.getCount = function(criteria) {
    return Q.when(RequireFeedback.count(criteria).exec());
}

RequireFeedbackModel.qList = function(options) {
    var criteria = options.criteria || {};
    //判断删除选项
    var a = RequireFeedback.find(criteria)
        .sort({ 'createdAt': -1 })
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec();
    return Q.when(a);
};