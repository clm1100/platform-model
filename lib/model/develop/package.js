/**!
 * Allmobilize Model - Package
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var Package = require('../../schema').develop.Package;
var util = require('platform-common').util;

var PageModel = require('./page');
var WidgetModel = require('./widget');

var PackageModel = module.exports = util.extend({
    _schema: Package
}, Base);

//extend
PackageModel.fetch = function(siteID, pageID) {
    // pageID 可选, 如果有pageID, 则只加载单page.
    var result = {};
    return PackageModel.findOne('siteID', siteID).then(function(pkg) {
        result.pkg = pkg;
        if (pageID) {
            return PageModel.find({
                '_id': pageID
            });
        }
        return PageModel.findPageByPackage(pkg);
    }).then(function(pages) {
        var widgetIds = [];
        util.each(pages, function(page) {
            widgetIds = util.union(widgetIds, page.widgets);
        });
        result.pages = pages;
        return WidgetModel.find({
            '_id': {
                $in: widgetIds
            }
        });
    }).then(function(widgets) {
        result.widgets = widgets;
        return result;
    });
};

PackageModel.storagesCreated = function(siteID, storageName) {
    var updateOperation = {
        '$set': {}
    };
    storageName = storageName || 'compiled';
    updateOperation['$set']['meta.' + storageName + 'Created'] = true;
    return PackageModel.update({
        siteID: siteID
    }, updateOperation);
};

PackageModel.appendChildren = function(siteID, device, pageIDs) {
    if (!util.isArray(pageIDs)) {
        pageIDs = [pageIDs];
    }
    var opt = {
        $pushAll: {}
    };
    opt.$pushAll['pages.' + device] = pageIDs;
    return this.update({
        siteID: siteID
    }, opt);
};
// TODO: 优化
Package.loadProject = function(siteID, device) {
    return PackageModel.findOne('siteID').then(function(pkg) {
        return pkg;
    }).then(function(pkg) {
        return Q.all([
            PageModel.findPageByPackage(pkg, device),
            WidgetModel.find('siteID', siteID)
        ]).spread(function(pages, widgets) {
            var ref = {};
            var widgetRef = {};
            var promises = [];
            util.each(pages, function(page) {
                ref[page._id] = page;
            });
            util.each(widgetRef, function(widget) {
                widgetRef[widget._id] = widget;
            });
            util.each(pkg.pages, function(_pages, device) {
                pkg.pages[device] = util.map(_pages, function(page) {
                    page = ref[page.toString()];
                    page.widgets = util.map(page.widgets, function(widget) {
                        widget = widgetRef[widget]; // 一级Widget
                        widget.children = util.map(widget.children, function(containerWidget) {
                            // 容器
                            containerWidget = widgetRef[containerWidget];
                            return util.map(containerWidget.children, function(childWidget) {
                                // 子Widget
                                return widgetRef[childWidget];
                            });
                            return containerWidget;
                        });
                        return widget;
                    });
                    return page;
                });
            });
            return pkg;
        });
    });
};