/**!
 * Allmobilize Model
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

/**
 * Shop dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var ShopSchema = new Schema({
    name: String,
    company: String,
    companyAbbr: String,
    desc: String,//公司简介
    province: String,
    city: String,
    tel: {
        type: String,
        trim: true,
        lowercase: true
    },
    qq: {
        type: String,
        trim: true,
        lowercase: true
    },
    industry: {
        type: Array,
        default: []
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    owner: {
        type: Schema.Types.ObjectId, //所属人
        ref: 'User'
    },
    data: { //店铺资料上传
        index: String,
        agreement: String
    },
    volume: Number,
    createdAt: {
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    banner: String,
    logo: String,
    status: {
        type: Number,
        default: 10 //最开始的状态
    },
    recommend: {
        type: Number,
        default: 0
    }
});

/**
 * Methods
 */
ShopSchema.methods = {

};

ShopSchema.statics = {
    load: function(options, cb) {
        this.findOne(options).exec(cb);
    },
    list: function(options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria)
            .sort({
                'createdAt': -1
            })
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    },
    listByIds: function(ids, cb) {
        this.find({
            _id: {
                $in: ids
            }
        }, {
            _id: -1
        }).toArray().exec(cb);
    }

};


module.exports = mongoose.model('Shop', ShopSchema, 'shops');