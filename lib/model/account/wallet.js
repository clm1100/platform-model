/**!
 * Allmobilize Model - Wallet
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var Wallet = require('../../schema').account.Wallet;
var util = require('platform-common').util;
var Q = require('q');

var WalletModel = module.exports = util.extend({
    _schema: Wallet
}, Base);

var isWallet = function(wallet) {
    return wallet instanceof Wallet;
};

WalletModel.newWallet = function(user) {
    var UserModel = require('./user');
    var wallet = {
        balance: 0,
        freeze: 0,
        cumulativeRecharge: 0,
        cumulativePay: 0
    };
    return this.insert(wallet).then(function(result) {
        user.wallet = result.data._id;
        return UserModel.update(user).then(function() {
            return result.data;
        });
    });
};

WalletModel.newWalletWithOutQ = function(user, callback) {
    var UserModel = require('./user');
    var wallet = {
        balance: 0,
        freeze: 0,
        accumulate: 0
    };
    return this.insert(wallet).then(function(result) {
        user.wallet = result.data._id;
        user.save(callback);
    });
};

WalletModel.increaseBalance = function(walletID /* or Wallet */, num) {
    var increaseBalance = function(walletID) {
        return WalletModel.update({
            _id: walletID
        }, {
            $inc: {
                cumulativeRecharge: num,
                balance: num
            }
        });
    };
    return increaseBalance(isWallet(walletID) ? walletID._id.toString() : walletID);
};

WalletModel.decreaseBalance = function(walletID /* or Wallet */, num) {
    var decreaseBalance = function(walletID) {
        return WalletModel.update({
            _id: walletID
        }, {
            $inc: {
                cumulativePay: num,
                balance: -num
            }
        });
    };

    return decreaseBalance(isWallet(walletID) ? walletID._id.toString() : walletID);
};

WalletModel.increaseFreeze = function(walletID /* or Wallet */, num) {
    var increaseFreeze = function(walletID) {
        return WalletModel.update({
            _id: walletID
        }, {
            $inc: {
                freeze: num
            }
        });
    };

    return increaseFreeze(isWallet(walletID) ? walletID._id.toString() : walletID);
};

WalletModel.decreaseFreeze = function(walletID /* or Wallet */, num) {
    var decreaseFreeze = function(walletID) {
        return WalletModel.update({
            _id: walletID
        }, {
            $inc: {
                freeze: -num
            }
        });
    };

    return decreaseFreeze(isWallet(walletID) ? walletID._id.toString() : walletID);
};