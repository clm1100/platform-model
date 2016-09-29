/**!
 * ProjectMeta Model
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var ProjectMeta = require('../../schema').cms.ProjectMeta;
var util = require('platform-common').util;

var ProjectMetaModel = module.exports = util.extend({
    _schema: ProjectMeta
}, Base);

ProjectMetaModel.findBySiteToMap = function(siteID) {
    return this.find({
        'siteID': siteID
    }).then(function(metas) {
        return util.arrayToMap(metas, 'key', 'value');
    });
};