/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var Order = require('../../schema').market.Order;
var util = require('platform-common').util;

var OrderModel = module.exports = util.extend({
    _schema: Order
}, Base);