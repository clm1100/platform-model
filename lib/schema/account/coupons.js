/**!
 * Allmobilize Model
 *  网站订单的优惠卷
 *
 *  这个类 暂时用不到
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;


/**
 * Invitation Schema
 */
var CouponsSchema = new Schema({
    key: String, //密钥
    favourablePrice: {  //优惠价格
        type: Number
    },
    createdTime: {  //优惠卷创建时间
        type: Date,
        get: util.getDateTime,
        default: Date.now
    },
    usageTime: {  //优惠卷使用时间
        type: Date,
        get: util.getDateTime,
    },
    user: {   //优惠卷的使用人的id
        type: Schema.ObjectId,
        ref: 'User'
    },
    userIP: String //使用优惠卷人的ip
});

InvitationSchema.pre('save', function (next) {
    this.key = this.encryptInvitation(this._id.toString());
    next();
});

InvitationSchema.methods = {
    encryptInvitation: function (text) {
        //TODO: key 写入数据库字典表
        return util.md5(text, 'html5');
    }
};

InvitationSchema.statics = {
    load: function (_id, cb) {
        this.findOne({
            _id: _id
        }).exec(cb);
    },
    loadByKey: function (key, cb) {
        this.findOne({
            key: key
        }).exec(cb);
    },
    list: function (options, cb) {
        var criteria = options.criteria || {};

        this.find(criteria)
            // .populate('logs.operator')
            .sort({
                'createdTime': -1
            }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    }
};

module.exports = mongoose.model('Invitation', InvitationSchema, 'invitations');
