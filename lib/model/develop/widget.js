/**!
 * Allmobilize Model - Widget
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var Widget = require('../../schema').develop.Widget;
var util = require('platform-common').util;

var WidgetModel = module.exports = util.extend({
    _schema: Widget
}, Base);

//extend
WidgetModel.getUsedGroupByType = function() {
    var p = Widget.aggregate({
        '$group': {
            '_id': '$type',
            'count': {
                '$sum': 1
            }
        }
    }).sort({
        'count': -1
    }).exec();
    return Q.when(p);
};

WidgetModel.getChildren = function(criteria) {
    var self = this;
    var p = self._schema.find(criteria).populate('children').exec();
    return Q.when(p);
};

WidgetModel.getByIds = function(ids) {
    return Q.when(Widget.find({
        '_id': {
            $in: ids
        }
    }).populate('children').exec());
};

WidgetModel.getWidgetsPerPage = function(criteria) {
    var p = Widget.aggregate([{
        $match: criteria
    }, {
        $group: {
            _id: "$pageID",
            count: {
                $sum: 1
            },
        }
    }, {
        $group: {
            _id: null,
            avg: {
                $avg: "$count"
            }
        }
    }]).exec();
    return Q.when(p);
};
//todo : 优化速度
WidgetModel.getWidgetsPerSite = function(criteria) {
    var p = Widget.aggregate([{
        $match: criteria
    }, {
        $group: {
            _id: "$siteID",
            count: {
                $sum: 1
            },
        }
    }, {
        $group: {
            _id: null,
            avg: {
                $avg: "$count"
            }
        }
    }]).exec();
    return Q.when(p);
};

WidgetModel.getWidgetsPercent = function(criteria) {
    var o = {};
    o.scope = {
        sum: 0
    };
    o.query = criteria;
    o.jsMode = true;
    o.map = function() {
        sum++;
        emit(this.type, {
            count: 1
        });
    };

    o.reduce = function(k, vals) {
        var val = {
            count: 0
        };
        vals.forEach(function(v) {
            val.count += v.count;
        });
        return val;
    };

    o.finalize = function(k, val) {
        val.percent = ((val.count / sum) * 100).toFixed(4) + "%" //百分比
        return val;
    };

    var p = Widget.mapReduce(o).then(function(result) {
        result.sort(function(a, b) {
            if (a.value.count == b.value.count) {
                return 0;
            }
            return a.value.count < b.value.count ? 1 : -1;
        });
        return result;
    });

    return Q.when(p);
};