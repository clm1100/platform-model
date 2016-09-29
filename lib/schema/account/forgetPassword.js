'use strict';

/**
 * Log dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;
var moment = require('moment');

var getInvalidTime = function() {
    return moment().add(20, 'm').format("YYYY-MM-DD HH:mm:ss");
}

var ForgetPasswordSchema = new Schema({
    user: {  //需要充重置密码的用户
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {//需要重置密码用户的邮箱
        type: String
    },
    uuid: {//标志用户唯一的key
        type: String,
        unique: true
    },
    createdAt: {//创建时间
        type: Date,
        default: Date.now
    },
    invalidTime: {//失效时间
        type: Date,
        default: getInvalidTime
    },
    isUse: {//表示这个链接是否使用过
        type: Boolean,
        default: false
    }

});


module.exports = mongoose.model('ForgetPassword', ForgetPasswordSchema, 'forgetPassword');