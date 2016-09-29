/**!
 * Allmobilize Model - ZhidaRecord
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var ZhidaRecord = require('../../schema').account.ZhidaRecord;
var util = require('platform-common').util;
var Q = require('q');

var ZhidaRecordModel = module.exports = util.extend({
    _schema: ZhidaRecord
}, Base);
