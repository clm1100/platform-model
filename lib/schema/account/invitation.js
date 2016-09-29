/**!
 * Allmobilize Model
 * @author: larry / ll@yunshipei.com
 *
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
var InvitationSchema = new Schema({
    key: String,
    level: {
        type: Number,
        // TODO: 状态写入数据库字典表
        default: 500
    },
    email: {
        type: String
    },
    createdTime: {
        type: Date,
        get: util.getDateTime,
        default: Date.now
    }
});

InvitationSchema.pre('save', function(next) {
    this.key = this.encryptInvitation(this._id.toString());
    next();
});

InvitationSchema.methods = {
    encryptInvitation: function(text) {
        //TODO: key 写入数据库字典表
        return util.md5(text, 'html5');
    }
};

InvitationSchema.statics = {
    load: function(_id, cb) {
        this.findOne({
            _id: _id
        }).exec(cb);
    },
    loadByKey: function(key, cb) {
        this.findOne({
            key: key
        }).exec(cb);
    },
    list: function(options, cb) {
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
