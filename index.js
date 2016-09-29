/**!
 * Allmobilize Model Module
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var debug = require('debug')('platform-model');
var mongoose = require('mongoose');
var Connection = mongoose.Connection;
var util = require('platform-common').util;
var Models = require('./lib');

module.exports.connection = mongoose.connection;
module.exports.mongo = mongoose.mongo;
/**
 * 数据库连接方法.
 * 参数请参照mongoose的connection方法
 * @param  {String}   uri
 * @param  {Object}   options
 * @param  {Function} callback
 */
module.exports.connect = function(uri, options, callback) {
    if (util.isFunction(options)) {
        callback = options;
        options = {};
    } else {
        options = options || {}
    }
    callback = callback || function(err) {
        if (err) {
            throw err;
        }
    };
    options.server = {
        auto_reconnect: true,
        socketOptions: {
            keepAlive: 1,
            socketTimeoutMS: 3600000
        }
    };
    if (util.isArray(uri)) {

        if (options.read_secondary === undefined) {
            options.read_secondary = true;
        }
        var connectionString = [];
        uri.forEach(function(url) {
            connectionString.push(url + '/' + options.database);
        });
        options.replset = {
            strategy: 'ping'
        };

        uri = connectionString.join(',');
    }

    mongoose.connect(uri, options, function(err) {
        if (!err) {
            var conn = mongoose.connection;
            var t;
            conn.on('open', function() {
                t = setInterval(function() {
                    conn.db.executeDbCommand({
                        'ping': 0
                    }, function(err, response) {
                        if (err) return console.log('mongodb 心跳检测失败. %s', err.message);
                        var doc = response.documents[0];
                        err = 1 === doc.ok ? null : console.log('mongodb 心跳检测失败.', response);

                    });
                }, 60 * 1000);
            });

            conn.on('close', function() {
                if (t) {
                    clearInterval(t);
                }
            });
        }
        callback.apply(this, arguments);
    });
};

/**
 * 加载Model
 * @param  {String} Model的name 需加上namespace
 * @return {Model}
 */
module.exports.loadModel = function(name) {
    var ns = name.split('.');
    return Models[ns[0]][ns[1]];
};

/**
 * 数据库连接关闭
 * @param  {} callback [description]
 * @return {[type]}            [description]
 */
module.exports.close = function(callback) {
    return mongoose.disconnect(callback);
};

module.exports.StorageManager = require('./lib/storagemanager');
module.exports.BlobManager = require('./lib/blobmanager');
