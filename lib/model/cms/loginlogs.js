/**!
 * Allmobilize Model - Page
 * @author: clm / liming.chen@yunshipei.com
 *
 * Copyright (c) 2016-9 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var LoginLogs = require('../../schema').market.LoginLogs;
var util = require('platform-common').util;

var LoginLogsModel = module.exports = util.extend({
    _schema: LoginLogs
}, Base);