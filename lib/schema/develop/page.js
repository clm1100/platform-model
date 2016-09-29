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
var Q = require('q');

/**
 * Page Schema
 */
var PageSchema = new Schema({
    name: String,
    siteID: String,
    regex: String,
    redirectTo: {
        type: String
    },
    realUrl: String,
    expressionType: {
        type: String,
        default: 'regex'
    },
    type: {
        type: String,
        default: 'page'
    },
    head: {
        type: String,
        default: '<meta charset="utf-8">\r\n<title>{{title}}</title>'
    },
    footer: {
        type: String
    },
    deletedWidgets: [{
        type: Schema.Types.ObjectId,
        ref: 'Widget'
    }],
    widgets: [{
        type: Schema.Types.ObjectId,
        ref: 'Widget'
    }], //[_module_id1,_module_id2,_module_id3]
    createdDate: {
        type: Date,
        default: Date.now
    }
});


/**
 * Methods
 */
PageSchema.methods = {
    'getPages': function() {
        return JSON.parse(this.pages);
    },
    'setPages': function(pages) {
        return JSON.stringify(pages);
    }

};

PageSchema.statics = {
    load: function(options, cb) {
        this.findOne(options).exec(cb);
    },
    delete: function(options, cb) {
        this.delete(options).exec(cb);
    },
    list: function(options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria).exec(cb);
    },
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


module.exports = mongoose.model('Page', PageSchema, "pages");