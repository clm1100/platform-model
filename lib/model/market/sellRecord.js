/**!
 * Allmobilize Model - Page
 * @author: mh / zp@yunshipei.com
 *
 * Copyright (c) 2014-3 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var SellRecord = require('../../schema').market.SellRecord;
var util = require('platform-common').util;

var SellRecordModel = module.exports = util.extend({
    _schema: SellRecord
}, Base);

//find then sort by criteria
SellRecordModel.findBySort = function(criteria) {
    var a = this._schema.find(criteria.query).sort(criteria.sort).exec();
    return Q.when(a);
};

// SellRecordModel.addLog = function(id, action, user, log) {
//     var a = this._schema.findById(id).then(function(item) {
//         item.log.push({
//             action: action,
//             name: user.name,
//             email: user.email,
//             more: log
//         });
//         return SellRecordModel.save(item);
//     });
//     return Q.when(a);
// }
