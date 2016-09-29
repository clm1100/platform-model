/**!
 * Allmobilize Model
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

/**
 * Wallet dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var WalletSchema = new Schema({
    balance: {  //账户余额
        type: Number,
        default: 0
    },
    freeze: {//冻结
        type: Number,
        min: 0,
        default: 0
    },
    cumulativeRecharge: {//累计充值
        type: Number,
        min: 0,
        default: 0
    },
    cumulativePay: {//累计支付
        type: Number,
        min: 0,
        default: 0
    },
    logs: {
        type: Schema.Types.ObjectId,
        ref: 'Log'
    }
});

WalletSchema.statics = {
    load: function(options, cb) {
        this.findOne(options).exec(cb);
    },
    list: function(options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria).exec(cb);
    }
};

module.exports = mongoose.model('Wallet', WalletSchema, 'wallets');