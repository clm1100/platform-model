/**!
 * Allmobilize Model - Admin
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Base = require('../base');
var Admin = require('../../schema').account.Admin;
var util = require('platform-common').util;

// TODO: 这种继承有些问题.
var AdminModel = module.exports = util.extend({
    _schema: Admin
}, Base);

//extend

AdminModel.load = function (id, cb) {
    Admin.findOne({ _id: id }).exec(cb);
};
AdminModel.count = function (options) {
    return Admin.count(options);
};

AdminModel.loadByEmail = function (email, cb) {
    Admin.findOne({ email: email }).exec(cb);
};

AdminModel.list = function (options, cb) {
    var criteria = options.criteria || {};
    criteria['$nor'] = [
        { email: 'admin@yunshipei.com' }
    ];
    Admin.find(criteria).sort({ 'createdTime': -1 }).limit(options.perPage).skip(options.perPage * options.page).exec(cb);
}
