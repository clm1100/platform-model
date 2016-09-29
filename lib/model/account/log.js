'use strict';

var Base = require('../base');
var Log = require('../../schema').account.Log;
var util = require('platform-common').util;
var Q = require('q');

var LogModel = module.exports = util.extend({
    _schema: Log
}, Base);


/**
 * 日志分页
 * @param options
 */
LogModel.qList = function(options) {
    var criteria = options.criteria || {};
    var a = Log.find(criteria)
        .sort({ 'createdAt': -1 })
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec();
    return Q.when(a);
}
/**
 * 日志总数
 * @param options
 * @returns {*}
 */
LogModel.qCount = function(options) {
    var a = Log.find(options).count().exec();
    return Q.when(a);
}


LogModel.findWalletLog = function(user) {
    var charge = [];
    var pay = [];
    return Q.when(LogModel._schema.find({
        'type': 4,
        'user': user
    }).sort({createAt: -1}).exec())
        .then(function(logs) {
            util.forEach(logs, function(log) {
                if (log.raw && log.raw.isCharge) {
                    charge.push({
                        createdAt: log.createdAt,
                        balance: log.raw.balance,
                        num: log.raw.num,
                        cumulativeRecharge: log.raw.cumulativeRecharge
                    });
                } else if (log.raw && !log.raw.isCharge) {
                    pay.push({
                        createdAt: log.createdAt,
                        action: log.action,
                        num: log.raw.num,
                        comment: log.raw.comment,
                        site: log.raw.site
                    });
                }
            });
            return {
                pay: pay,
                charge: charge
            }
        });
};

LogModel.addRechargeLog = function(object, number, user, raw, isCharge) {
    raw = raw || {};
    if (util.isString(object)) {
        return Q.try(function() {
            throw new Error('first argument not a string.');
        });
    }
    if (!(object instanceof this.ObjectId)) {
        object = object._id;
    }
    var log = {};
    log.type = 4;
    log.object = object;
    //log.action = util.format('管理员', isCharge ? '充值' : '扣费', number, '元');
    log.action = "管理员";
    log.user = user;
    log.raw = raw;
    return this.insert(log);
};

LogModel.addUserLog = function(action, object, user) {
    var log = {};
    log.type = 5;
    log.object = object;
    log.action = action;
    log.user = user;
    return this.insert(log);
};

LogModel.addSiteLog = function(raw, siteId /*site ObjectId*/, action, userId) {
    var log = {};
    log.type = 4;
    log.object = siteId;
    log.action = action;
    log.user = userId;
    log.raw = raw;
    return this.insert(log);
};

/**
 * 记录用户操作的log
 * @param req
 * @param tableName
 * @param action
 */
LogModel.logger = function(req, tableName, action) {
    var log = {
        ip: getIpAddress(req),
        headers: req.headers,
        tableName: tableName,
        currentUser: req.user ? req.user._id : null,
        action: action
    };
    LogModel.save(log).done();
}


/**
 * 得到真实的ip
 * @param req
 * @returns {*|string}
 */
var getIpAddress = function(req) {
    var ip = req.ip || '0.0.0.0';
    if (req.headers) {
        ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
    }
    return ip;
}

//罗黎写的, user logs迁移到log表
// db.users.find().toArray().forEach(function(user) {
//     if (!user.logs) {
//         return;
//     }
//     user.logs.forEach(function(userlog) {
//         var newLog = {};
//         newLog.type = 5;
//         newLog.object = user._id;
//         newLog.user = user._id;
//         newLog.action = userlog.action;
//         newLog.raw = {
//             more: userlog.more,
//             email: userlog.email
//         };
//         newLog.createdAt = userlog.createdAt;
//         db.logs.insert(newLog);
//     });
// });

//删除user表里的logs
// db.users.update({}, {$unset:{logs:''}}, {multi:true})