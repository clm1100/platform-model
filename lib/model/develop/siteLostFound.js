/**!
 * Allmobilize Model - ZhidaRecord
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var SiteLostFound = require('../../schema').develop.SiteLostFound;
var util = require('platform-common').util;
var Q = require('q');

var SiteLostFoundModel = module.exports = util.extend({
    _schema: SiteLostFound
}, Base);
