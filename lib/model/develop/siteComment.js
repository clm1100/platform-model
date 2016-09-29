/**!
 * Allmobilize Model - ZhidaRecord
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var SiteComment = require('../../schema').develop.SiteComment;
var util = require('platform-common').util;
var Q = require('q');

var SiteCommentModel = module.exports = util.extend({
    _schema: SiteComment
}, Base);


SiteCommentModel.getCount = function(criteria) {
    if (!criteria) criteria = {};
    criteria['isDelete'] = {$ne: true};
    return Q.when(SiteComment.count(criteria).exec());
}


SiteCommentModel.qList = function(options) {
    var criteria = options.criteria || {};
    //判断删除选项
    criteria['isDelete'] = {$ne: true};
    var a = SiteComment.find(criteria)
        .sort({ 'createdAt': -1 })
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec();
    return Q.when(a);
};
