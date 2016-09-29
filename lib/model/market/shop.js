/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var Shop = require('../../schema').market.Shop;
var util = require('platform-common').util;

var ShopModel = module.exports = util.extend({
    _schema: Shop
}, Base);

ShopModel.recommend = function() {
    var a = this._schema.find({status:20}).sort({createdAt: -1}).limit(3).exec();
    return Q.when(a);
};