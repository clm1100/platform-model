/**!
 * Allmobilize Model - Invitation
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var ActiveUsers = require('../../schema').account.ActiveUsers;
var util = require('platform-common').util;

var ActiveUsersModel = module.exports = util.extend({
    _schema: ActiveUsers
}, Base);


/**
 * 更新最后活跃时间
 * @param req
 * @param user
 */
ActiveUsersModel.updateActiveTime = function(req, user) {
    ActiveUsersModel.update({user: user._id}, {
        name: user.name || '',
        email: user.email || '',
        user: user._id,
        ip: getIpAddress(req),
        finallyClickTime: Date.now()
    }, {upsert: true})
        .done()
}

/**
 * 得到真实的ip
 * @param req
 * @returns {*|string}
 */
var getIpAddress = function(req) {
    var ip = req.ip || '0.0.0.0';
    if (req.headers['x-real-ip'] || req.headers['x-forwarded-for']) {
        ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
    }
    return ip;
}