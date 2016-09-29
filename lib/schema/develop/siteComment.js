'use strict';
/**
 * 网站的评论    #1905
 * @type {exports}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;
var moment = require('moment');


var SiteCommentSchema = new Schema({
    siteId: {
        type: Schema.ObjectId,
        ref: 'Site'
    },
    userId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    email: {// 用户的email
        type: String
    },
    name: {// 用户的 name
        type: String
    },
    comment: {  //评论
        type: String
    },
    isDelete: { //表示这个网站是否已经删除, true 表示删除
        type: Boolean
    },
    createdAt: {//创建时间
        type: Date,
        default: Date.now,
        get: util.dateFormat("YYYY-MM-DD HH:mm:ss")
    }
});


module.exports = mongoose.model('SiteComment', SiteCommentSchema, 'siteComment');