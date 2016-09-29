/**!
 * Allmobilize Model
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

/**
 * Widget Dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;
var Q = require('q');

/**
 * Widget Schema
 */
var WidgetSchema = new Schema({
    siteID: String,
    pageID: String,
    name: String,
    widgetOptions: {
        type: String,
        default: '{}'
    },
    id: String,
    data: String,
    hbs: String,
    type: {
        type: String,
        default: 'blank'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    palette: {
        type: Object,
        default: {}
    },
    meta: {
        auto: {
            type: Boolean
        }
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Widget'
    }],
    deletedWidgets: [{
        type: Schema.Types.ObjectId,
        ref: 'Widget'
    }],
    layout: {
        type: Boolean,
        default: false
    },
    hidden: {
        phone: {
            type: Boolean
        },
        tablet: {
            type: Boolean
        }
    }
});
WidgetSchema.statics = {
    insert: function(docs, options) {
        var d = Q.defer();
        var options = options || {};
        this.collection.insert(docs, options, function(err, records) {
            if (err) {
                return d.reject(err);
            }
            d.resolve(records);
        });
        return d.promise;
    }
};

module.exports = mongoose.model('Widget', WidgetSchema, "Widgets");
