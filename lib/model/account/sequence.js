/**!
 * Allmobilize Model - Recharge
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Sequence = require('../../schema').account.Sequence;
var Q = require('q');

//不经常 那些工具类
var SequenceModel = module.exports = Sequence;

/**
 * 去判断当前的 sequence 中 是否有sites ID
 */
SequenceModel.find({tableName: 'sites'}).exec(function (err, result) {
    //如果没有这条记录 则添加
    if (!result || result.length == 0) {
        var sequenceModel = new SequenceModel();
        sequenceModel.tableName = 'sites';
        sequenceModel.save()
        console.log('在Sequence 表中 添加 sites 记录');
    }
});

/**
 * 得到 这个表名 的 idsequecnce
 * @param tableName
 */
SequenceModel.getSequenceId = function (tableName) {
    var d = Q.defer();
    Sequence.findAndModify({tableName: tableName}, [], { $inc: { currentIdValue: 1 } }, {new: true}, function (err, result) {
        if (err) {
            d.reject(err);
        }
        d.resolve(result.currentIdValue);
    })
    return d.promise;
};