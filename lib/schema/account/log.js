'use strict';

/**
 * Log dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var LogSchema = new Schema({
    type: {
        type: Number //0 other 1 site 2 product 3 sellrecord 4 wallet 5 user
    },
    object: {//当请登录用户的 id
        type: Schema.Types.ObjectId
    },
    action: {  //日志记录的动作
        type: String,
        default: ''
    },
    user: {  //需要记录日志的人的id
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    raw: {//网站扣费时 记录的 日志
        type: Object,
        default: {}
    },
    createdAt: {//日志创建时间
        type: Date,
        default: Date.now,
        get: util.dateFormat()
    },
    ip: {//用户的ip
        type: String
    },
    headers: {//用户请求的头
        type: String
    },
    tableName: {//操作了哪些表的名称
        type: String
    },
    currentUser: {//当前登录人的id
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Log', LogSchema, 'logs');