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

var ZhidaRecordSchema = new Schema({
    host: String,
    email: String,
    appID: String,
    appName: String,
    appQuery: String,
    appDesc: String,
    status: {
        type: Number,
        default: 0          //直达号状态码：0，1，3，4，分别表示创建成功，提交成功，审核不通过，审核通过
    },
    meta: {
        ignoreEmail: false //标记是否忽略发送邮件,默认不忽略
    },
    createdTime: { //创建时间
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    }
});

module.exports = mongoose.model('ZhidaRecord', ZhidaRecordSchema, 'zhidarecords');