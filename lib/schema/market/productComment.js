/**!
 * Allmobilize Model
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

var ProductCommentSchema = new Schema({

    comment: {//商品的评价
        type: String,
        trim: true},
    createdAt: {//评价的创建时间
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    product: { //这个商品
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {//评价这个商品的用户
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sellRecords: {
        type: Schema.Types.ObjectId, //这个评论所对应的购买记录
        ref: 'SellRecord'
    },
    averageLevel: {//这个商品的评星
        type: Number,
        default: 3
    }
});


/**
 * Methods
 */
ProductCommentSchema.methods = {

};

ProductCommentSchema.statics = {
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


module.exports = mongoose.model('ProductComment', ProductCommentSchema, 'productComment');
