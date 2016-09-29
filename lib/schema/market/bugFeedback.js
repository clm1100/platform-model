/**!
 * Allmobilize Model
 *
 * bug馈表
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var BugFeedbackSchema = new Schema({
    name: String, //联系人名称
    desc: String, // bug 的描述
    type: String,//需求的日志, 有ide 和market
    ip: String,//用户的IP
    user: {  //如果已经登录 存入用户的ID
        type: Schema.ObjectId,
        ref: 'User'
    },
    userEmail: String,//用户的邮箱
    createdAt: {  //创建时间
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    siteID: String //网站的siteID
});

module.exports = mongoose.model('BugFeedback', BugFeedbackSchema, 'bugFeedback');
