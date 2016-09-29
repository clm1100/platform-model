/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var BugFeedback = require('../../schema').market.BugFeedback;
var util = require('platform-common').util;

var BugFeedbackModel = module.exports = util.extend({
    _schema: BugFeedback
}, Base);

BugFeedbackModel.getCount = function(criteria) {
    return Q.when(BugFeedback.count(criteria).exec());
}

BugFeedbackModel.qList = function(options) {
    var criteria = options.criteria || {};
    //判断删除选项
    var a = BugFeedback.find(criteria)
        .sort({ 'createdAt': -1 })
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec();
    return Q.when(a);
};