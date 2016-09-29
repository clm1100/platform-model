/**!
 * Allmobilize Model
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

/**
 * Package dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var PackageSchema = new Schema({
    siteHost: String,
    siteID: {
        type: String,
        unique: true
    },
    projectName: {
        type: String
    },
    version: {
        type: String,
        default: 'v3'
    },
    devices: {
        type: Array,
        default: ['phone', 'tablet']
    },
    domains: {
        type: String,
        default: '{}'
    },
    // script: {
    //     type: String,
    //     default: 'script.js'
    // },
    // style: {
    //     type: String,
    //     default: 'style.less'
    // },
    resource: {
        images: Array,
        styles: Array,
        scripts: Array
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    pages: {
        //type: String,
        //default: '{}'
        /**
         * device: [
         *     {
         *         'index': time,
         *         '_id': page._id
         *     }
         * ]
         */
        phone: Array,
        tablet: Array,
        desktop: Array,
        tv: Array
    },
    helpers: {
        type: String,
        default: '// 自定义API中的函数是在本项目下所有模块中都可以共用。用法如下：\r\n// 在这里定义一个函数，例如 getHost: function() { return window.location.host; } ，\r\n// 在数据采集代码中通过 context._helpers 调用这个函数，例如 context._helpers.getHost()  \r\n\r\n{\r\n  getHost : function() {\r\n    return window.location.host;\r\n  }\r\n}\r\n'
    },
    pageOptions: {
        openLinkInSameWindow: {
            type: String,
            default: 'false'
        },
        removeStyle: {
            type: String,
            default: 'true'
        },
        cleanImg: {
            type: String,
            default: 'false'
        },
        cleanTable: {
            type: String,
            default: 'false'
        },
        cleanFrame: {
            type: 'String',
            default: 'false'
        },
        cleanEmbed: {
            type: 'String',
            default: 'false'
        }
    },
    preferences: {
        type: String,
        default: '{}'
    },
    meta: {
        compiledCreated: {
            type: Boolean,
            default: false
        },
        srcCreated: {
            type: Boolean,
            default: false
        },
        releaseCreated: {
            type: Boolean,
            default: false
        },
        stagingCreated: {
            type: Boolean,
            default: false
        }
    }
});


/**
 * Methods
 */
PackageSchema.methods = {

};

PackageSchema.statics = {
    load: function(options, cb) {
        this.findOne(options).exec(cb);
    },
    list: function(options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria).exec(cb);
    }

};


module.exports = mongoose.model('Package', PackageSchema, 'packages');