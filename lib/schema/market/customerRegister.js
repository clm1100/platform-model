/**!
 * Allmobilize Model
 *
 * 用户注册的表
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var CustomerRegisterSchema = new Schema({
    name: String, //联系人名称
    contact: String, //联系人信息(电话)
    email: String, //联系人信息(邮箱)
    companyName: String,//企业名称
    trad: String,//行业类别
    size: String,//企业规模
    companyDomain:String, //公司网址
    companyCid:String, //公司ID
    password:String, //公司密码

    createdAt: {  //创建时间
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    type: String,//需求的日志, 有ide 和 market  homePage 官网的定制
    ip: String,//用户的IP
    requirement: String//需求
});

module.exports = mongoose.model('CustomerRegister', CustomerRegisterSchema, 'customerRegister');
