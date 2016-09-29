'use strict';

/**
 * Module dependencies.
 * 自动转码 网站管理
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;


/**
 * Invitation Schema
 */
var AutoManageSchema = new Schema({
    agent: { //代理商id
        type: Schema.ObjectId,
        ref: 'User'
    },
    sum: {//网站转码总数
        type: Number
    },
    url: {// 在又拍云上面 转码后的csv 文件
        type: String
    },
    source: {//上传文件的来源
        type: String
    },
    siteIds: [
        {
            type: String
        }
    ],
    //批量申请直达号 存放的 ids
    zhidaHaoIds: [
        {
            type: String
        }
    ],
    autoManageType: {
        type: Number // 0 自动转码 1 直达号
    },
    failCount: {
        type: Number // 失败数量
    },
    createdTime: {
        type: Date,
        get: util.dateFormat('YYYY-MM-DD HH:mm:ss'),
        default: Date.now
    }
});

module.exports = mongoose.model('AutoManage', AutoManageSchema, 'autoManage');
