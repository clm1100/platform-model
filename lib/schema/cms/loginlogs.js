/**!
 * Project
 * @author: clm / liming.chen@yunshipei.com
 *
 * Copyright (c) 2016 Allmobilize Inc
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var LoginLogsSchema = new Schema({
    userid: String,
    name: String,
    createdDate: {
        type: Date,
        default: Date.now
    },   
    host: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('LoginLogs', ProjectSchema, 'loginlogs');