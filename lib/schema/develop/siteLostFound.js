'use strict';
/**
 * 网站的失物招领 Spiderman - 生成通知邮件、用户返回认领网站 #1855
 * @type {exports}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;
var moment = require('moment');


var SiteLostFoundSchema = new Schema({
    siteID: {
        type: String,
        index: true
    },
    email: {//需要重置密码用户的邮箱
        type: String
    },
    host: {//标志用户唯一的key
        type: String
    },
    token: {//失效时间
        type: String,
        index: true,
        unique: true
    },
    isClaim: { //表示此token 是否已经被领取了 true 表示已经领取
        type: Boolean
    },
    claimAt: {  //领取的时间
        type: Date,
        get: util.dateFormat()
    },
    claimUser: {  //领取人
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {//创建时间
        type: Date,
        default: Date.now,
        get: util.dateFormat()
    }
});


module.exports = mongoose.model('SiteLostFound', SiteLostFoundSchema, 'siteLostFound');