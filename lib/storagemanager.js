/**!
 * StorageManager
 * 用于管理文件系统存储.
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var path = require('path');
var fsModule = require('fs');

var Q = require('q');
var fs = require('platform-common').fs;
var util = require('platform-common').util;

Q.longStackSupport = true;

function validation(source) {
    if (!util.isString(source)) {
        return new Error('argument not a String.');
    }
    if (~source.indexOf('..')) {
        return new Error('no safed');
    }
}

/**
 * 存储管理器
 * options :
 *         root, 存储根目录
 */
function StorageManager(options) {
    if (!(this instanceof StorageManager)) {
        return new StorageManager(options);
    }
    var self = this;
    self.root = options.root;
}

StorageManager.prototype.getRoot = function() {
    return this.root;
};

StorageManager.prototype.get = function(bucket, options) {
    var self = this;
    var root = self.root;
    options.root = options.root || '';
    var d = Q.defer();
    var invalid = validation(options.file);
    if (invalid) {
        d.reject(invalid);
    } else {
        var filePath = path.normalize(path.join(self.root, options.root, bucket, options.file));
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, {
                'encoding': options.encoding
            }, function(err, data) {
                if (err) {
                    return d.reject(err);
                }
                d.resolve(data);
            });
        } else {
            d.resolve('');
        }
    }
    return d.promise;
};

StorageManager.prototype.createReadStream = function(bucket, options) {
    var self = this;
    var root = self.root;
    options.root = options.root || '';
    var invalid = validation(options.file);
    if (invalid) {
        throw invalid;
    }
    var filePath = path.normalize(path.join(self.root, options.root, bucket, options.file));
    if (!fs.existsSync(filePath)) {
        fs.createFileSync(filePath);
    }
    return fs.createReadStream(filePath, options);
};

StorageManager.prototype.createWriteStream = function(bucket, options) {
    var self = this;
    var root = self.root;
    options.root = options.root || '';
    var invalid = validation(options.file);
    if (invalid) {
        throw invalid;
    }
    var filePath = path.normalize(path.join(self.root, options.root, bucket, options.file));
    var dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirsSync(dir);
    }
    return fs.createWriteStream(filePath, options);
};

// TODO: 只读取了目录下的文件,子目录中的没有读取, 应该做一个递归.
// TODO: 目前不支持查询src
StorageManager.prototype.list = function(bucket) {
    var self = this;
    var d = Q.defer();
    var invalid = validation(bucket);
    if (invalid) {
        throw invalid;
    } else {
        var filePath = path.normalize(path.join(self.root, bucket));
        if (!fs.existsSync(filePath)) {
            fs.mkdirsSync(filePath);
        }
        fsModule.readdir(filePath, function(err, files) {
            if (err) {
                return d.reject(err);
            }
            if (!util.isArray(files)) {
                return d.reject(new Error('不存在文件夹.'));
            }
            // 过滤隐藏文件
            files = util.filter(files, function(file) {
                if (file.charAt(0) !== '.') {
                    return file;
                }
            });

            //var files = util.map(files, function(file, index){
            //    return path.join(self.root, bucket,file);
            //});

            d.resolve(files);
        });
    }
    return d.promise;
};

/**
 * 将内容持久化存储
 * @param  {String} bucket  网站bucket
 * @param @optional   {Object} options
 *                          root:  目录结构
 *                          file: 文件内容
 * @param  {String} data    文件内容
 * @return {Boolean}        为TRUE表示成功
 */
StorageManager.prototype.put = function(bucket, options, data) {
    var self = this;
    var d = Q.defer();
    var root = options.root || '';
    var invalid = validation(options.file);
    if (invalid) {
        d.reject(invalid);
    } else {
        var filePath = path.normalize(path.join(self.root, root, bucket, options.file));
        if (data) {
            fs.outputFile(filePath, data, function(err) {
                if (err) {
                    return d.reject(err);
                }
                d.resolve(true);
            });
        } else {
            fs.createFile(filePath, function(err) {
                if (err) {
                    return d.reject(err);
                }
                d.resolve(true);
            });
        }
    }
    return d.promise;
};

StorageManager.prototype.del = function(bucket, options) {
    var self = this;
    var d;
    options.root = options.root || '';
    var invalid = validation(options.file);
    if (invalid) {
        d.reject(invalid);
    } else {
        var filePath = path.normalize(path.join(self.root, options.root, bucket, options.file));
        d = Q.defer();
        fs.remove(filePath, function(err) {
            if (err) {
                return d.reject(err);
            }
            d.resolve(true);
        });
    }
    return d.promise;
};

StorageManager.prototype.createBucket = function(bucket, options) {
    var self = this;
    var d;
    options = options || {};
    options.root = options.root || '';
    var invalid = validation(bucket);
    if (invalid) {
        d.reject(invalid);
    } else {
        var filePath = path.normalize(path.join(self.root, options.root, bucket));
        d = Q.defer();
        fs.mkdirs(filePath, function(err) {
            if (err) {
                return d.reject(err);
            }
            d.resolve(true);
        });
    }
    return d.promise;
};

var srcManager = new StorageManager({
    'root': '/data/am-new/src'
});
var buildManager = new StorageManager({
    'root': '/data/am-new/built'
});
var compileManager = new StorageManager({
    'root': '/data/am/compiled'
});
var releaseManager = new StorageManager({
    'root': '/data/am-new/release'
});

module.exports.srcStorageMgr = srcManager;
module.exports.buildStorageMgr = buildManager;
module.exports.compileStorageMgr = compileManager;
module.exports.releaseStorageMgr = releaseManager;
