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

var ProductSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId, //所属商店
        ref: 'Shop'
    },
    title: String,
    des: String,
    detail: String,
    image: String,
    price: {
        original: {
            type: Number,
            min: 0
        },
        current: {
            type: Number,
            min: 0
        },
        renew: {
            type: Number,
            min: 0
        }
    },
    tags: [
        {
            type: String
        }
    ],
    createdAt: {
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    logo: {
        filename: String,
        originalFilename: String,
        type: {
            type: String
        },
        size: Number
    },
    recommend: {
        type: Number,
        default: 0
    },
    averageLevel: {//商品的评价
        type: Number,
        default: 5
    }
});


/**
 * Methods
 */
ProductSchema.methods = {

};

ProductSchema.statics = {
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


module.exports = mongoose.model('Product', ProductSchema, 'products');
