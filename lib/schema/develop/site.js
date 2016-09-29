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
var loadModel = require('platform-model').loadModel;
var SellRecordModel = require('../market/sellRecord');

var SequenceModel = require('../../model/account/sequence');
var Q = require('q');
var AUTH_VENDOR_LIST = require('platform-common/vendor');

// TODO: 写入数据库
var SiteStatus = {
    50: '待插代码',
    60: '待审核',
    70: '审核失败',
    80: '待开发',
    100: '开发中',
    110: '预览待确认', //用户确认
    120: '待上线',
    90: '已上线'
};

var Site = {
    paid: { //表示是否已经支付
        type: Boolean,
        default: false
    },
    type: { //网站类型
        type: Number,
        default: 1
    },
    vas: { //传给 Ben 那边需要的数据
        upyun: {
            status: {
                type: Number,
                default: 10 //20 打开图片压缩  10 关闭
            },
            bucket_name: {
                type: String
            },
            provider: {
                type: String
            },
            allow: {//允许的图片域名的正则表达式
                type: String
            },
            deny: { //图片压缩黑名单
                type: String
            },
            quality: { // 又拍云图片压缩质量， 1-100，默认75
                type: Number,
                default: 75
            },
            retina: { // 是否支持视网膜屏分辨率，如果为1， 则使用视网膜分辨率
                type: Number,
                default: 0
            }

        },
        analytics: {
            aaID: { //统计中用到的 id 自增
                type: Number
            },
            status: { //统计的开关,表示是否开启 10 为关
                type: Number,
                default: 20
            },
            geo: { //是否打开地理位置信息统计 1 为开
                type: Number,
                default: 0
            },
            sm: { //是否打开营销统计功能  1 为开
                type: Number,
                default: 1
            }
        },
        qing: {
            status: {
                type: Number,
                default: 20 //20 打开轻应用  10 关闭
            },
            qingID: {
                type: String
            }
        }

    },
    name: String, //网站名称
    host: { //网站host
        // unique: true,
        type: String
    },
    user: { //创建网站的人
        type: Schema.ObjectId,
        ref: 'User'
    },
    siteID: { //网站的siteID
        unique: true,
        type: String
    },
    status: { //网站的状态
        type: Number,
        //TODO: 放到数据库字典
        default: 50
    },
    developer: { //开发这个网站的人
        type: Schema.ObjectId,
        ref: 'User'
    },
    owner: { //以前的站长
        type: Schema.ObjectId,
        ref: 'User'
    },
    checkcode: String, //密码 加密需要用到的
    createdAt: { //创建时间
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    },
    completedAt: { //完成时间
        type: Date,
        get: util.dateFormat()
    },
    ip: { //siteip
        type: String
    },
    ide: { //ide 需要用到的数据
        type: {
            type: String,
            default: 'dev'
        },
        location: {
            type: Array,
            default: ['cn', 'hk']
        },
        cms: {
            type: Boolean,
            default: false
        },
        market: {
            type: Boolean,
            default: false
        }
    },
    suspend: {
        type: Number,
        default: 0 //0表示没禁用，1表示禁用
    },
    defaultoff: {
        type: Number,
        default: 0 //0表示默认启用  1 表示默认不启用转码功能  // 自动转码过来的网站才需要开启这个值. 1 PC版本  0 手机版
    },
    noconvert: {
        type: Number, // 0开启, 1关闭
        default: 0
    },
    auto: { //自动转码中 需要的对象
        status: { //自动转码的状态
            type: Number
        }
    },
    lastActivetyTime: { //这个网站最后活跃的时间
        type: String
    },
    versions: {
        ide: {
            type: Number,
            default: 5
        },
        amui: {
            type: String,
            default: '1.0'
        },
        compiler: {
            type: Number,
            default: 4
        }
    },
    source: { //这个网站的来源
        type: String
    },
    meta: {
        app: {
            webAppDifferent: { //web app 和 手机图片 是否一样 true 不一样
                type: Boolean
            },
            appId: {
                type: String //这个网站生成App的Id
            },
            appName: {
                type: String //这个网站生成App的Name
            },
            appCreated: {
                type: Boolean //网站的App 是否已经创建
            },
            appEmail: {
                type: String //网站的App 提示的邮箱
            },
            appIcon: {
                type: String //网站的App icon 地址
            },
            appWebIcon: {
                type: String //网站的App Webicon 地址
            },
            appStartPage: {
                type: String //网站的App startPage 地址
            },
            appAndroidUrl: {
                type: String //网站的App android 地址
            },
            appIOSUrl: {
                type: String //网站的App ios 地址
            },
            appPackType: {
                type: Number //app的打包类型 ,0:打全部包，1：只打ios,2:只打android，
            },
            appStatus: {//0 未生成 1提交中 2 提交失败 3 正在生成 4 生成成功 5 生成失败
                type: Number,
                default: 0
            },
            appCreateTime: { //app的创建时间
                type: Date,
                get: util.dateFormat()
            },
            appMode: { // app 的生成模式 0:正式,1:测试
                type: Number, //app的打包状态
                default: 0
            },
            appFailCount: {  //生成app 失败的次数
                type: Number,
                default: 0
            }
        },
        notEditable: { //为 true 表示此网站不能修改
            type: Boolean
        },
        previewTime: { //合作商的网站 预览时间
            type: Date
        },
        thirdPartyServices: { // key 为服务名称, value为服务的具体信息.
            'mobilize': {
                on: Boolean,
                updateTime: Date
            },
            'autosite': {
                on: Boolean,
                callCount: 0,
                updateTime: Date
            },
            'CDN360': {
                on: Boolean,
                updateTime: Date
            }
        },
        globalColor: {
            type: String
        },
        pushTime: {//表示此网站的推送时间
            type: String//推送时间
        },
        remark: {
            type: String//网站的备注
        },
        sendAnalyticsEmail: {//给这个网站发送统计数据的邮箱
            type: String
        },
        collaborationInfo: {//网站合作信息, 一键进入IDE ,记录来源等信息
            source: String//一键开启IDE 的来源

        },
        lostFountPreviewTime: { //网站的失物招领 预览的时间
            type: Date
        },
        analyticsCode: {//  like: <script></script> 统计代码
            type: String
        }

    },
    isDelete: { //表示这个网站是否已经删除, true 表示删除
        type: Boolean
    },
    isPackage: { //表示这个网站是否要打包,例如中国政府网,为privateCloud 提供 true 打包
        type: Boolean
    },
    testServer: { //增加私有部署 测试服务器字段
        type: String
    },
    mobilizeStatus: {
        type: Boolean,
        default: true
    },
    lastMobilizeStatusChangeDate: {
        type: Date,
        get: util.dateFormat(),
        default: Date.now
    }
};

/**
 * Site Schema
 */
var SiteSchema = new Schema(Site);

/**
 * Virtuals
 */


/**
 * Validations
 */
SiteSchema.path('name')
    .validate(function(name) {
        return name.length;
    }, '名称不能为空');


/**
 * Pre-save hook
 */
SiteSchema.pre('save', function(next) {
    var UserModel = require('../../model/account/user');
    var self = this;
    if (this.user && this.user._id) {
        this.user = this.user._id;
    }

    if (this.developer && this.developer._id) {
        this.developer = this.developer._id;
    }

    if (!this.siteID) {
        this.siteID = util.generalSiteID(this.host);
    }
    this.vas = this.vas || {};
    this.vas.upyun = this.vas.upyun || {};
    if (!this.vas.upyun.bucket_name) {
        this.vas.upyun.bucket_name = util.generalBucketName(this.siteID, this.host);
    }

    if (!this.checkcode) {
        this.checkcode = this.encryptCheckcode(this._id.toString());
    }
    if (this.host) {
        this.host = util.getHost(this.host);
    }
    //初始化piwik中需要的 idsite
    SequenceModel.getSequenceId('sites')
        .then(function(idsite) {
            self.vas.analytics = self.vas.analytics || {};
            self.vas.analytics.aaID = idsite;
        })
        .then(function() {
            if (self.source) return;
            return UserModel.findOne('_id', self.user).then(function(user) {
                var vendor = AUTH_VENDOR_LIST.AUTH_MAP.EMAIL[user.email];
                if (vendor) {
                    self.source = vendor.name;
                }
            });
        })
        .done(next, next);
});

SiteSchema.post('save', function() {
    // var isNew = ((new Date() - this._doc.createdAt) <= 1000);
    // if (isNew) {
    //     util.projectInitial(this.siteID);
    // }
});

/**
 * Methods
 */
SiteSchema.methods = {
    checkChangeSiteID: function(newSiteID) {
        return this.siteID !== newSiteID;
    },
    checkChangeStatus: function(user, status) {
        if (status === SiteStatus.ToAudit) {
            return this.CSTToAudit(user);
        }
        if (status === SiteStatus.AuditFail) {
            return this.CSTAuditFail(user);
        }
        if (status === SiteStatus.ToDev) {
            return this.CSTToDev(user);
        }
        if (status === SiteStatus.Success) {
            return this.CSTSuccess(user);
        }
        return false;
    },
    CSTToAudit: function(user) {
        return (user && ((this.status === SiteStatus.ToInstallCode) || ((this.status === SiteStatus.AuditFail) && user.isAdmin)));
    },
    CSTAuditFail: function(user) {
        return (this.status === SiteStatus.ToAudit && user && user.isAdmin);
    },
    CSTToDev: function(user) {
        return (this.status === SiteStatus.ToAudit && user);
    },
    CSTSuccess: function(user) {
        return (this.status === SiteStatus.ToDev && user);
    },
    encryptCheckcode: function(checkcode) {
        // TODO: 问题
        return util.md5(checkcode, 'admin@yunshipei.com');
    }
};

SiteSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('developer')
            .populate('user')
            .populate('owner')
            .exec(cb);
    },
    loadByUser: function(user, cb) {
        this.findOne({
            user: user
        }).populate('developer')
            .populate('user')
            .populate('owner')
            .exec(cb);
    },
    loadByHost: function(host, cb) {
        this.findOne({
            host: host
        }).populate('developer')
            .populate('user')
            .populate('owner')
            .exec(cb);
    },
    loadByCheckCode: function(checkcode, cb) {
        this.findOne({
            checkcode: checkcode
        }).populate('developer')
            .populate('user')
            .populate('owner')
            .exec(cb);
    },
    loadBySiteID: function(siteID, cb) {
        this.findOne({
            siteID: siteID
        }).exec(cb);
    },
    list: function(options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria)
            .sort({
                'createdAt': -1
            })
            .populate('developer')
            .populate('user')
            .populate('owner')
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    },
    qList: function(options) {
        var criteria = options.criteria || {};
        var a = this.find(criteria)
            .sort({'createdAt': -1})
            .populate('developer')
            .populate('user')
            .populate('owner')
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec();
        return Q.when(a);
    },
    qCount: function(options) {
        var a = this.find(options).count().exec();
        return Q.when(a);
    }
};

module.exports = mongoose.model('Site', SiteSchema, 'sites');
