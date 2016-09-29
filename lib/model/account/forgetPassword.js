/**!
 * Allmobilize Model - Invitation
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var ForgetPassword = require('../../schema').account.ForgetPassword;
var util = require('platform-common').util;

var ForgetPasswordModel = module.exports = util.extend({
    _schema: ForgetPassword
}, Base);

//extend
