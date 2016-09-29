/**!
 * BlobManager
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

var Azure = require('azure');
var blobService = Azure.createBlobService(
    'yspcms', // 存储帐户名称
    '+5DONt1QZStG7JSYQF2ajDkz2GfYSYaTWsQROyyJmMg5O+KXm53qjDLL0s+GUdkUhW2DiTx2kfK4VWG6/7CUcg==', // 访问密钥
    'http://yspcms.blob.core.chinacloudapi.cn/' // Azure Blob Host
);

/**
 * 存储管理器
 * options :
 *         prefix, 存储根目录
 */
function BlobManager(options) {
    if (!(this instanceof BlobManager)) {
        return new BlobManager(options);
    }
    var self = this;
    self.prefix = options.prefix;
}

BlobManager.prototype.getBucketName = function(bucket) {
    return [this.prefix, '-', bucket].join('');
};

BlobManager.prototype.getPrefix = function() {
    return this.prefix;
};

BlobManager.prototype.createReadStream = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var invalid = validation(options.file);
    if (invalid) {
        throw invalid;
    }
    return blobService.getBlob(bucket, options.file);
};

BlobManager.prototype.createWriteStream = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var invalid = validation(options.file);
    if (invalid) {
        throw invalid;
    }
    return blobService.getBlob(bucket, options.file);
};

BlobManager.prototype.putFromFile = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var d = Q.defer();
    var invalid = validation(options.file);
    if (invalid) return d.reject(invalid);

    blobService.putBlockBlobFromFile(bucket, options.file, options.path, function(err) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(true);
    });

    return d.promise;
};

BlobManager.prototype.putFromStream = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var d = Q.defer();
    var invalid = validation(options.file);
    if (invalid) return d.reject(invalid);

    blobService.putBlockBlobFromStream(bucket, options.file, options.stream, function(err) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(true);
    });

    return d.promise;
};

BlobManager.prototype.putFromText = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var d = Q.defer();
    var invalid = validation(options.file);
    if (invalid) return d.reject(invalid);

    blobService.createBlockBlobFromText(bucket, options.file, options.text, function(err) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(true);
    });

    return d.promise;
};

BlobManager.prototype.getContent = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var d = Q.defer();
    var invalid = validation(options.file);
    if (invalid) return d.reject(invalid);

    blobService.getBlobToText(bucket, options.file, function(err, content) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(content);
    });

    return d.promise;
};

BlobManager.prototype.del = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var d = Q.defer();
    var invalid = validation(options.file);
    if (invalid) return d.reject(invalid);
    blobService.deleteBlob(bucket, options.file, function(err) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(true);
    });

    return d.promise;
};

BlobManager.prototype.listBlobs = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var d = Q.defer();
    blobService.listBlobs(bucket, function(err, blobs) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(util.map(blobs, function (blob) {
            return blob.name;
        }));
    });

    return d.promise;
};

BlobManager.prototype.createBucket = function(bucket, options) {
    var self = this;
    bucket = self.getBucketName(bucket);
    var d = Q.defer();
    blobService.createContainerIfNotExists(bucket, function(err) {
        if (err) {
            return d.reject(err);
        }
        d.resolve(true);
    });

    return d.promise;
};

var srcManager = new BlobManager({
    prefix: 'src'
});

module.exports.srcBlobMgr = srcManager;