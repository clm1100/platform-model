/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var Product = require('../../schema').market.Product;
var util = require('platform-common').util;
var ShopModel = require('./shop');

var ProductModel = module.exports = util.extend({
    _schema: Product
}, Base);

ProductModel.recommend = function () {
    return  ShopModel.find({status: 20})
        .then(function (shops) {
            return util.map(shops, function (shop) {
                return shop._id;
            })
        })
        .then(function (allowShopId) {
            console.log(allowShopId)
            return Q.when(ProductModel._schema.find({shop: {$in: allowShopId}}).sort({createdAt: -1}).limit(6).exec());
        });
};
