/**!
 * Project Model
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var Project = require('../../schema').cms.Project;
var util = require('platform-common').util;

var ProjectModel = module.exports = util.extend({
    _schema: Project
}, Base);