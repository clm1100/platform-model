/**
 * 云适配的活跃用户
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;
var CONSTANTS = require('platform-common').constants;
var request = require('request');

/**
 * User Schema
 */
var ActiveUsersSchema = new Schema({
    name: String,//用户名称
    email: String,//用户邮箱
    user: {//用户
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    },
    ip: {
        type: String
    },
    finallyClickTime: {//用户最后点击开发按钮的时间  只收集 最近30天的数据
        type: Date,
        default: Date.now,
        get: util.dateFormat(),
        expires: '30d'
    }
});

module.exports = mongoose.model('ActiveUsers', ActiveUsersSchema, 'activeUsers');