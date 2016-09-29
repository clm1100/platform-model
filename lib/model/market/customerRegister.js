/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var CustomerRegister = require('../../schema').market.CustomerRegister;
var util = require('platform-common').util;

var CustomerRegisterModel = module.exports = util.extend({
    _schema: CustomerRegister
}, Base);
