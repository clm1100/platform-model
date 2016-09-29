'use strict';

/**
 * 用户的交易日志,涉及到金额
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var TradeLogSchema = new Schema({
    type: {   // 交易的类型
        type: Number
    },
    ip: {//用户的ip
        type: String
    },
    ua: {//用户请求ua
        type: String
    },
    referer: {
        type: String
    },
    host: String,
    siteID: String,
    beforeBalance: Number,
    money: Number,//扣费 还是充值
    currentUser: {//当前操作人的id
        type: Schema.ObjectId,
        ref: 'User'
    },
    currentUserEmail: String,
    actionUser: {//被操作人
        type: Schema.ObjectId,
        ref: 'User'
    },
    actionUserEmail: String,//被操作人
    remark: String,//备注
    createdAt: {//日志创建时间
        type: Date,
        default: Date.now,
        get: util.dateFormat()
    }
});

module.exports = mongoose.model('TradeLog', TradeLogSchema, 'tradeLogs');