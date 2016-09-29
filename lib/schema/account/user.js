/* jshint camelcase: false */

/**!
 * Allmobilize Model
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('platform-common').util;
var CONSTANTS = require('platform-common').constants;
var request = require('request');

/**
 * User Schema
 */
var UserSchema = new Schema({
    name: String,//用户名称
    tel: String,//用户电话
    qq: String,//QQ
    extra: String,//另外的名称
    invitation: String,//应该是邀请码
    industry: {//用户的行业,金融投资 等
        type: Array,
        default: []
    },
    source: String,
    company: String,//公司
    companyAbbr: String,//公司简称
    companyAddress: String,//公司地址
    invoiceTitle: String,//发票抬头
    remark: String,//备注
    email: {//邮箱
        type: String,
        trim: true,
        unique: true,
        lowercase: true
    },
    url: {
        type: String,
        trim: true
    },
    desc: String,//描述
    hashed_password: String,//密码
    salt: String,//加密用
    status: {//用户状态  启用,未启用等 20 启用
        type: Number,
        default: 20
    },
    level: {//用户的级别 站长  代理商 金牌代理商等
        type: Number,
        default: 500  //现在默认为开发者
    },
    rank: {//用户的 等级设置 一级代理商 等
        type: String,
        default: '000'
    },
    parent: {//自己的代理商 id
        type: Schema.ObjectId,
        ref: 'User'
    },
    province: String,//省份
    city: String,//城市
    createdTime: {//创建时间
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    invoice: {//发票信息
        title: {//发票抬头
            type: String
        },
        address: {//地址
            type: String
        }
    },
    wallet: {//用户的钱包
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    preferences: {//用户的一些特性等 用户配置
        type: String,
        default: '{}'
    },
    betaLevel: {
        type: Number,
        default: 10 // 用户 测试的等级
    },
    userIdentity: {//用户的身份 0 是开发者 1 企业用户
        type: Number,
        default: 0//默认是开发者 0
    },
    userLevel: { //用户的等级, 是免费的 还是 付费用户
        type: Number
        //默认是开发者 10 免费的
    },
    registerTime: {//真正注册时间
        type: Date,
        get: util.dateFormat()
    },
    registerSource: {//注册用户的来源
        type: String
    },
    thirdPartyServices: {
        //天翼第三方
        chinanet: {
            openId: String //它是用户的唯一标识，根据APPID以及天翼账号用户标识生成，即不同的APPID下，同一个天翼账号用户标识生成的OpenID是不一样的
        },
        //微信登录
        wechat: {
            openId: String //普通用户标识，对该公众帐号唯一
        },
        github: {
            id: String //github 的用户标识
        },
        weibo: {
            id: String //weibo 的用户标识
        },
        qq: {
            id: String //qq 的用户标识
        }
    }
});

/**
 * Virtuals
 */

UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.salt || this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

//TODO: 写入数据库字典表
var statusName = {
    "10": "站长",
    "500": "开发者",
    "1000": "合作伙伴",
    "10000": "金牌合作伙伴"
};
//TODO: 写入数据库字典表
var status = {
    SiteMaster: 10,
    SiteDeveloper: 500,
    Partner: 1000,
    GoldPartner: 10000
};
UserSchema.virtual('levelName').get(function() {
    return statusName[this.level];
});

UserSchema.virtual('isGoldPartner').get(function() {
    return status.GoldPartner === this.level;
});

UserSchema.virtual('isDeveloper').get(function() {
    return status.SiteDeveloper === this.level;
});

UserSchema.virtual('isPartner').get(function() {
    return status.Partner === this.level;
});

UserSchema.virtual('isSubUser').get(function() {
    return !!this.parent;
});

UserSchema.virtual('isSiteMaster').get(function() {
    return status.SiteMaster === this.level;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('name').validate(function(name) {
    return name.length;
}, '名称不能为空');

UserSchema.path('email').validate(function(email) {
    return email.length;
}, '邮件地址不能为空');

UserSchema.path('hashed_password').validate(function(hashed_password) {
    return hashed_password.length;
}, '密码不能为空');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    var self = this;
    if (!this.isNew) {
        return next();
    } else {
        if (process.env.NODE_ENV === 'production') {
            request({
                method: 'post',
                url: CONSTANTS.URL.ide + 'project/clone',
                form: {
                    'siteID': 'demo1',
                    'newSiteID': util.generalSiteID('web.demo.yunshipei.com', self.email),
                    'newHost': 'web.demo.yunshipei.com',
                    'creator': self._id.toString(),
                    'projectName': '适配样例'
                }
            }, function(err, res, body) {
                if (err) {
                    return console.error(err);
                }
                if (res.statusCode === 200) {
                    console.log('demo create successful! ==========================');
                    console.log(body);
                } else {
                    console.log('demo create failure! ==========================');
                }
            });
        } else {
            console.log('==========================创建适配样例 ==========================');
        }
    }

    // if (this.email.indexOf('@yunshipei.com') !== -1) {
    //     this.betaLevel = 1000;
    // }

    if (!validatePresenceOf(this.password)) {
        next(new Error('无效的密码'));
    } else {
        next();
    }
});

/**
 * Methods
 */
UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: function(password) {
        return util.encrypt(password, this.salt);
    },
    isEnable: function() {
        // TODO: 写入数据库字典表
        if (this.status === 20) {
            return true;
        }
        return false;
    },
    isGoldPartnerSon: function(oldUserLevel) {
        // TODO: 写入数据库字典表
        return (oldUserLevel !== status.GoldPartner) && (this.level === status.GoldPartner) && this.parent;
    },
    isPartnerSon: function(oldUserLevel) {
        // TODO: 写入数据库字典表
        return (oldUserLevel !== status.Partner) && (this.level === status.Partner) && this.parent;
    },
    doSiteMasterToDeveloper: function(_level) {
        // TODO: 写入数据库字典表
        return (this.level === status.SiteDeveloper) && (_level === status.SiteMaster);
    },
    doEnable: function(oldUserStatus) {
        // TODO: 写入数据库字典表
        return (oldUserStatus === 10 || oldUserStatus === 30) && (this.status === 20);
    },
    doDisable: function(oldUserStatus) {
        // TODO: 写入数据库字典表
        return (oldUserStatus === 20) && (this.status === 30);
    },
    doChangeGoldPartnerStatus: function(oldUserStatus) {
        // TODO: 写入数据库字典表
        return (this.level === status.GoldPartner || this.level === status.Partner) && (this.status !== oldUserStatus);
    }
};

UserSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    },

    loadByEmail: function(email, cb) {
        this.findOne({
            email: email
        }).exec(cb);
    },
    listAll: function(cb) {
        this.find({}).exec(cb);
    },
    list: function(options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria)
            // .populate('logs.operator')
            .sort({
                'createdTime': -1
            }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    }
};

module.exports = mongoose.model('User', UserSchema, 'users');