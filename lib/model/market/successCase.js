/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var SuccessCase = require('../../schema').market.SuccessCase;
var util = require('platform-common').util;

var SuccessCaseModel = module.exports = util.extend({
    _schema: SuccessCase
}, Base);

SuccessCaseModel.recommend = function () {
    var a = this._schema.find().sort({createdAt: -1}).limit(3).exec();
    return Q.when(a);
};