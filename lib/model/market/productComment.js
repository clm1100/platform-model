/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var ProductComment = require('../../schema').market.ProductComment;
var util = require('platform-common').util;

var ProductCommentModel = module.exports = util.extend({
    _schema: ProductComment
}, Base);

ProductCommentModel.recommend = function () {
    var a = this._schema.find().sort({createdAt: -1}).limit(6).exec();
    return Q.when(a);
};
