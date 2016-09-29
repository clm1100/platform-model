/**!
 * Allmobilize Model
 *
 * 用户的 需求反馈表
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var RequireFeedbackSchema = new Schema({
    name: String, //联系人名称
    tel: String, //联系人电话
    desc: String, // 所需的适配套餐
    createdAt: {  //创建时间
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    type: String,//需求的日志, 有ide 和 market  homePage 官网的定制
    province: String,//省份
    city: String,//城市
    ip: String,//用户的IP
    user: {  //如果已经登录 存入用户的ID
        type: Schema.ObjectId,
        ref: 'User'
    },
    area: String,//地区
    remark: String,//备注,
    host: String,
    userEmail: String,//用户的邮箱
    siteID: String, //网站的siteID
    serviceType: {//产品服务类型, 10为网站移动化, 20为办公移动化, 默认为网站移动化
        type: Number,
        default: 10
    }
});

module.exports = mongoose.model('RequireFeedback', RequireFeedbackSchema, 'requireFeedback');
