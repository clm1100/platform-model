'use strict';

var Base = require('../base');
var TradeLog = require('../../schema').account.TradeLog;
var util = require('platform-common').util;
var Q = require('q');

var TradeLogModel = module.exports = util.extend({
    _schema: TradeLog
}, Base);


/**
 * 网站扣费日志
 * @param obj
 */
TradeLogModel.addTradeLogger = function(obj) {
    var req = obj.req || {};
    var user = req.user;
    if (!req.headers) {
        req.headers = {};
    }
    var model = {
        ip: req.ip,
        ua: req.headers['user-agent'],
        referer: req.headers['referer'],
        currentUser: user._id,
        currentUserEmail: user.email,
        type: obj.type,
        siteID: obj.siteID,
        host: obj.host,
        beforeBalance: obj.beforeBalance,
        money: obj.money
    };
    TradeLogModel.save(model).done();
}
/**
 * 充值
 * @param obj
 */
TradeLogModel.addRechagreLogger = function(obj) {
    var req = obj.req || {};
    var user = req.user;

    var actionUser = req._user;
    if (!req.headers) {
        req.headers = {};
    }
    var model = {
        ip: req.ip,
        ua: req.headers['user-agent'],
        referer: req.headers['referer'],
        currentUser: user._id,
        currentUserEmail: user.email,

        actionUser: actionUser._id,
        actionUserEmail: actionUser.email,

        type: obj.type,
        beforeBalance: obj.beforeBalance,
        money: obj.money
    };
    TradeLogModel.save(model).done();
}
/**
 * 扣费
 * @param obj
 */
TradeLogModel.addDeductionLogger = function(obj) {
    var req = obj.req || {};
    var user = req.user;

    var actionUser = req._user;
    if (!req.headers) {
        req.headers = {};
    }
    var model = {
        ip: req.ip,
        ua: req.headers['user-agent'],
        referer: req.headers['referer'],
        currentUser: user._id,
        currentUserEmail: user.email,

        actionUser: actionUser._id,
        actionUserEmail: actionUser.email,

        type: obj.type,
        beforeBalance: obj.beforeBalance,
        money: obj.money,
        
        remark: obj.remark
    };
    TradeLogModel.save(model).done();
}