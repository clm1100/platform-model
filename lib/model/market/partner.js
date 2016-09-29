/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var Partner = require('../../schema').market.Partner;
var util = require('platform-common').util;

var PartnerModel = module.exports = util.extend({
    _schema: Partner
}, Base);


PartnerModel.getCount = function(criteria) {
    return Q.when(Partner.count(criteria).exec());
}

PartnerModel.qList = function(options) {
    //判断删除选项
    var a = Partner.find(options)
        .sort({ 'createdAt': -1 })
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec();
    return Q.when(a);
};