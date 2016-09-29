/**!
 * Widget Test Case
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2014 Allmobilize Inc
 */

'use strict';

var assert = require("assert");
var models = require('../');

describe('platform_model ', function() {

    it('should connection success', function(done) {
        models.connect('mongodb://localhost:27017/platform_development', function(err) {
            assert.equal(false, !! err);
            var loadModel = require('../').loadModel;
            global.Widget = loadModel('develop.Widget');
            done();
        });
    });

    it('should group widget by type', function(done) {
        global.Widget.getUsedGroupByType().done(function(data) {
            console.log(data);
            done();
        }, done);
    });

    it('should find The children of widget', function(done) {
        global.Widget.getChildren({
            '_id': '52fdd5d8a32ef807f3000040'
        }).done(function(data) {
            assert.equal(typeof data[0].children, typeof[]);
            done();
        }, done);
    });

    it('should connection close', function(done) {
        models.close(done);
    });
});
