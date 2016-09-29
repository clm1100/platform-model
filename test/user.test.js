/**!
 * user test
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

/**
 * Module dependencies.
 */
var assert = require("assert");
//var should = require('should');
var models = require('../');
var config = require('./config');
var Q = require('q');

describe('platform_model ', function() {

    it('should connection success', function(done) {
        models.connect(config.uri, function(err) {
            assert.equal(false, !! err);
            var loadModel = require('../').loadModel;
            global.User = loadModel('account.User');
            global.Wallet = loadModel('account.Wallet');
            global.Page = loadModel('develop.Page');
            global.Package = loadModel('develop.Package');

            var Site = loadModel('develop.Site'),
                Package = loadModel('develop.Package'),
                Page = loadModel('develop.Page'),
                Widget = loadModel('develop.Widget');
            var siteID = 'discuzdefault';
            // 查询sites
            var sitePromise = Site.findOne('siteID', siteID);
            // 查询package
            var packagePromise = Package.findOne('siteID', siteID);
            // 查询pages
            var pagePromise = Page.find('siteID', siteID);
            // 查询widgets
            var widgetPromise = Widget.find('siteID', siteID);
            Q.all([
                sitePromise,
                packagePromise,
                pagePromise,
                widgetPromise
            ]).spread(function(site, pkg, pages, widgets) { //fulfilled
                assert.ok(site.siteID && pkg.siteID && pages.length && widgets.length);
                done();
            }).done(null, done);
        });
    });

    it('should find user by id', function(done) {
        //var Models = models(config.uri);
        var promise = global.User.findById('525f936a4bb1fd2c7b000018');
        promise.done(function(found) {
            assert.equal('罗黎', found.name);
            done();
        }, done);
    });

    it('should find one user', function(done) {
        //var Models = models(config.uri);
        var promise = global.User.findOne('_id', '525f936a4bb1fd2c7b000018');
        promise.done(function(found) {
            assert.equal('罗黎', found.name);
            done();
        }, done);
    });

    it('should find user by name', function(done) {
        //var Models = models(config.uri);
        var promise = global.User.find('name', '罗黎');
        promise.done(function(found) {
            assert.equal(found.length, 1);
            done();
        }, done);
    });

    it('should save a User', function(done) {
        //var Models = models(config.uri);
        var larry = {
            'name': 'larry',
            'password': '123456',
            'test': '111'
        };
        var promise = global.User.saveOrUpdate(larry);
        promise.done(function(result) {
            assert.equal(1, result.numberAffected);
            done();
        }, done);
    });

    it('should save a Wallet', function(done) {
        //var Models = models(config.uri);
        var zheng1 = {
            balance: 100.1,
            freeze: 100.2
        };
        var promise = global.Wallet.saveOrUpdate(zheng1);
        promise.done(function(result) {
            assert.equal(1, result.numberAffected);
            done();
        }, done);
    });

    it('should update a Wallet', function(done) {
        //var Models = models(config.uri);

        var findPromise = global.Wallet.find({
            balance: 100.1
        });
        findPromise.done(function(found) {
            var zheng1 = found[0];
            global.zheng1 = zheng1;
            // console.log(zheng1);
            assert.equal(1, found.length);
            assert.equal(100.1, zheng1.balance);
            assert.equal(100.2, zheng1.freeze);
            global.Wallet.increaseFreeze(zheng1._id, 100.1).done(function(result) {
                // console.log(result);
                assert.equal(1, result.numberAffected);
                global.Wallet.decreaseFreeze(zheng1._id, 100.1).done(function(result) {
                    // console.log(result);
                    assert.equal(1, result.numberAffected);
                    global.Wallet.increaseBalance(zheng1._id, 100.1).done(function(result) {
                        assert.equal(1, result.numberAffected);
                        global.Wallet.decreaseBalance(zheng1._id, 100.1).done(function(result) {
                            assert.equal(1, result.numberAffected);
                            done();
                        }, done);
                    }, done);
                }, done);
            }, done);
        }, done);
    });

    it('should remove a Wallet', function(done) {
        // var zheng1 = {
        //     balance: 100.1,
        //     freeze: 100.2
        // };
        var zheng1 = {
            _id: global.zheng1._id
        };
        var promise = global.Wallet.remove(zheng1);
        promise.done(function(numberAffected) {
            assert.equal(true, !! numberAffected);
            done();
        }, done);
    });

    it('should update a User', function(done) {
        //var Models = models(config.uri);
        var larry = {
            'name': 'larry',
            'email': '123321123@qq.com'
        };

        var findPromise = global.User.find({
            'name': 'larry'
        });
        findPromise.done(function(found) {
            assert.equal(1, found.length);
            larry._id = found[0]._id;
            assert.equal(false, !! found[0].email);
            var promise = global.User.saveOrUpdate(larry);
            promise.done(function(result) {
                assert.equal(1, result.numberAffected);
                var f = global.User.findById(larry._id);
                f.done(function(_result) {
                    assert.equal(larry.email, _result.email);
                    done();
                }, done);
            }, done);
        }, done);

    });

    it('should update a User by email', function(done) {
        //var Models = models(config.uri);
        var criteria = {
            'email': '123321123@qq.com'
        };

        global.User.update(criteria, {
            'email': 'bshy522@gmail.com'
        }).done(function(result) {
            assert.equal(1, result.numberAffected);
            global.User.findOne('email', 'bshy522@gmail.com').done(function(found) {
                assert.equal('bshy522@gmail.com', found.email);
                done();
            });
        }, done);
    });

    it('should remove a User', function(done) {
        //var Models = models(config.uri);
        var larry = {
            'name': 'larry'
        };
        var promise = global.User.remove(larry);
        promise.done(function(numberAffected) {
            assert.equal(true, !! numberAffected);
            done();
        }, done);
    });

    it('should find page by package', function(done) {
        //var Models = models(config.uri);
        var siteID = 'discuzdefault';
        global.Package.findOne('siteID', siteID).then(function(pkg) {
            return global.Page.findPageByPackage(pkg);
        }).done(function(pages) {
            assert.ok(pages.length);
            done();
        }, done);
    });

    it('should fetch all info by package', function(done) {
        //var Models = models(config.uri);
        var siteID = 'discuzdefault';
        global.Package.fetch(siteID).then(function(pkg) {
            return global.Page.findPageByPackage(pkg);
        }).done(function(pages) {
            assert.ok(pages.length);
            done();
        }, done);
    });

    it('should find paginate', function(done) {
        global.User.paginate().done(function(pageInfo) {
            //console.log(pageInfo);
            assert.equal(pageInfo.limit, 20);
            assert.equal(pageInfo.data.length, pageInfo.limit);
            done();
        }, done);
    });

    it('should connection close', function(done) {
        models.close(done);
    });
});