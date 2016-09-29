/**!
 * Allmobilize Model - Recharge
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var Recharge = require('../../schema').account.Recharge;
var util = require('platform-common').util;

var UserModel = require('./user');
var WalletModel = require('./wallet');
var RechargeModel = module.exports = util.extend({
    _schema: Recharge
}, Base);


//extend
RechargeModel.create = function(userID, amount, callback) {
    var recharge = {
        user: userID,
        amount: amount,
        callback: callback
    };
    return RechargeModel.insert(recharge);
};

RechargeModel.finish = function(rechargeID) {
    return RechargeModel.findOne({
        _id: rechargeID
    }).then(function(recharge) {
        if (recharge.isfinish) throw new Error('该充值已完成');
        recharge.status = 1;
        return UserModel.findOne({
            _id: recharge.user
        }).then(function(user) {
            return WalletModel.increaseBalance(user.wallet, recharge.amount);
        }).then(function() {
            return RechargeModel.save(recharge);
        });
    });
};
