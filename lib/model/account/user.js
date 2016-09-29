/**!
 * Allmobilize Model - User
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

var Q = require('q');

var Base = require('../base');
var User = require('../../schema').account.User;
var util = require('platform-common').util;

var UserModel = module.exports = util.extend({
    _schema: User
}, Base);

//extend
UserModel.exists = function (email) {
    if (!email) {
        return true;
    }
    var promise = this._schema.find({
        email: email
    }).count().exec();

    return Q.when(promise).then(function (result) {
        return result !== 0;
    });
};

UserModel.login = function () {

};


UserModel.loadWallet = function (user) {
    var WalletModel = require('./wallet');
    if (!user.wallet) {
        return WalletModel.newWallet(user);
    } else {
        return WalletModel.findOne({
            _id: user.wallet
        });
    }
};

UserModel.changePassword = function (user) {
    return UserModel.update({
        '_id': user._id.toString()
    }, {
        '$set': {
            /* jshint camelcase: false */
            'hashed_password': user.hashed_password
        }
    }).then(function (result) {
        return !!result.numberAffected;
    });
};

UserModel.qLoad = function (id) {
    var a = this._schema.findOne({
        _id: id
    }).populate('developer')
        .populate('user')
        .populate('owner')
        .exec();
    return Q.when(a);
};
/**
 * 加载用户的邮箱
 * @param email
 * @param cb
 */
UserModel.loadByEmail = function (email) {
    return Q.when(User.findOne({ email: email }).exec());
};

/**
 * 用户分页显示
 * @param options
 * @returns {*}
 */
UserModel.qList = function (options) {
    var criteria = options.criteria || {};
    var a = User.find(criteria)
        .sort({ 'createdTime': -1 })
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec();
    return Q.when(a);
};