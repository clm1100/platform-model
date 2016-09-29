/**!
 * Allmobilize Model
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

/**
 * SellRecord dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;
var Dictionary = require('platform-common/dictionary');

var SellRecordSchema = new Schema({
    consumer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    paymentAt: {//支付时间
        type: Date,
        get: util.dateFormat()
    },
    createdAt: {
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    completedAt: {//完成时间
        type: Date,
        get: util.dateFormat()
    },
    shop: { //关联shop，更易查询
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    amount: Number,
    name: String,
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    invoice: { //发票详情
        title: String,
        receiver: String,
        cellphone: String,
        address: String
    },
    siteInfo: { //订单备注
        host: String,
        name: String,
        requirement: String
    },
    site: {
        type: Schema.Types.ObjectId,
        ref: 'Site'
    },
    status: Number, //订单状态,
    orderID: String, //订单编号
    isComment: {  //是否已经评论
        type: Boolean,
        default: false
    }
});

SellRecordSchema.virtual('statusName').get(function () {

    var d = Dictionary.findByValue(this.status, Dictionary.TYPES.SellRecordStatus);
    return d.label;
});

/**
 * Methods
 */
SellRecordSchema.methods = {
};

SellRecordSchema.statics = {
    load: function (options, cb) {
        this.findOne(options).exec(cb);
    },
    // list: function(options, cb) {
    //     var criteria = options.criteria || {};
    //     this.find(criteria)
    //         .sort({
    //             'createdAt': -1
    //         })
    //         .populate('developer')
    //         .populate('user')
    //         .populate('owner')
    //         .limit(options.perPage)
    //         .skip(options.perPage * options.page)
    //         .exec(cb);
    // },
    list: function (options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria)
            .sort({
                'createdAt': -1
            })
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    }
};


module.exports = mongoose.model('SellRecord', SellRecordSchema, 'sellRecords');
