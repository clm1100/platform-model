/**!
 * Allmobilize Model
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

/**
 * Product dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var SuccessCaseSchema = new Schema({
    siteName: String,//网站名称
    siteUrl: String,//网址地址
    sitePicUrl: String,//案例图
    createdAt: {//创建时间
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
});

/**
 * Methods
 */
SuccessCaseSchema.methods = {

};

SuccessCaseSchema.statics = {
    load: function (options, cb) {
        this.findOne(options).exec(cb);
    },
    list: function (options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria)
            .sort({
                'createdAt': -1
            })
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    },
    listByIds: function (ids, cb) {
        this.find({
            _id: {
                $in: ids
            }
        }, {
            _id: -1
        }).toArray().exec(cb);
    }
};


module.exports = mongoose.model('SuccessCase', SuccessCaseSchema, 'successCase');
