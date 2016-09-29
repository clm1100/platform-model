/**!
 * Project
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var ProjectSchema = new Schema({
    siteID: String,
    name: String,
    versions: {
        type: Object,
        default: {
            'amui': 2.0,
            'cms': 1.0
        }
    },
    host: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Project', ProjectSchema, 'projects');