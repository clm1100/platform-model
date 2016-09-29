/**!
 * Project Model
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var AutoManage = require('../../schema').auto.AutoManage;
var util = require('platform-common').util;

var AutoManageModel = module.exports = util.extend({
    _schema: AutoManage
}, Base);

AutoManageModel.getModel = function () {
    return AutoManage;
}
