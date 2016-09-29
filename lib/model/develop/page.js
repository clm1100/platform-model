/**!
 * Allmobilize Model - Page
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var Page = require('../../schema').develop.Page;
var util = require('platform-common').util;

var PageModel = module.exports = util.extend({
    _schema: Page
}, Base);

//extend
PageModel.findPageByPackage = function(pkg, device) {
    var d = Q.defer();
    if (!pkg) {
        d.resolve([]);
        return d.promise;
    }
    var pageIds = [];
    var enableDevice = {};

    if (util.isUndefined(device)) {
        util.each(pkg.pages, function(pages, device) {
            enableDevice[device] = true;
        });
    }

    if (util.isArray(device)) {
        util.each(device, function(dName) {
            enableDevice[dName] = true;
        });
    } else {
        pageIds = pkg.pages[device] || pageIds;
    }

    util.each(pkg.pages, function(value, key) {
        if (value.length === 0) {
            return;
        }
        if (enableDevice[key]) {
            pageIds = util.union(pageIds, value);
        }
    });

    pageIds = util.filter(pageIds, function(id) {
        return !!id;
    });

    if (pageIds.length === 0) {
        d.resolve([]);
        return d.promise;
    }
    return this.find({
        '_id': {
            $in: pageIds
        }
    });
};

PageModel.getPagesPerSite = function(criteria) {
    var p = Page.aggregate([{
        $match: criteria
    }, {
        $group: {
            _id: '$siteID',
            count: {
                $sum: 1
            },
        }
    }, {
        $group: {
            _id: null,
            avg: {
                $avg: '$count'
            }
        }
    }]).exec();
    return Q.when(p);
};

PageModel.appendChildren = function(criteria, widgets, index) {
    if (!util.isArray(widgets)) {
        widgets = [widgets];
    }
    return this.update(criteria, {
        $push: {
            widgets: {
                $each: widgets,
                $position: parseInt(index)
            }
        }
    }, {
        multi: true
    });
};