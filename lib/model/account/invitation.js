/**!
 * Allmobilize Model - Invitation
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var Invitation = require('../../schema').account.Invitation;
var util = require('platform-common').util;

var InvitationModel = module.exports = util.extend({
    _schema: Invitation
}, Base);

//extend
