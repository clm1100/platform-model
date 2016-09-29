/**!
 * ProjectMeta
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;

var ProjectMetaSchema = new Schema({
    siteID: String,
    key: String,
    value: String,
    autoload: {
        type: Boolean,
        default: true,
    }
});

module.exports = mongoose.model('ProjectMeta', ProjectMetaSchema, 'projectmetas');