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
 * Recharge Schema
 */
var RechargeSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: Number,
        default: 0
    },
    amount: Number,
    callback: String,
    createdTime: {
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },

});

RechargeSchema.virtual('isfinish').get(function() {
    if (this.status === 1) {
        return true;
    } else {
        return false;
    }
});

RechargeSchema.pre('save', function(next) {
    next();
});

RechargeSchema.methods = {};

RechargeSchema.statics = {
    load: function(_id, cb) {
        this.findOne({
            _id: _id
        }).exec(cb);
    }
};

module.exports = mongoose.model('Recharge', RechargeSchema, 'recharges');
