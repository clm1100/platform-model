/**!
 * Allmobilize Model - Site
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */


var Q = require('q');

var Base = require('../base');
var Site = require('../../schema').develop.Site;
var util = require('platform-common').util;

var SellRecordsModel = require('../market/sellRecord');

var config = {
    SITE: {
        status: {
            ToInstallCode: 50,
            ToAudit: 60,
            AuditFail: 70,
            ToDev: 80,
            Deving: 100,
            SubmitDel: 110,
            ToConfirm: 120,
            Success: 90
        },
        statusName: {
            50: '待插代码',
            60: '待审核',
            70: '审核失败',
            80: '待开发',
            100: '开发中',
            110: '预览待确认', //用户确认
            120: '待上线',
            90: '已上线'
        },
        type: {
            noSale: 0, //代理商非订单网站(收费)
            lowNoSale: 1, //开发者或站长普通订单网站(不收费)
            sale: 2 //订单网站
        }
    },
    ORDER: {
        status: {
            UnPaid: 20,
            ToDev: 25,
            Deving: 30,
            SubmitDel: 35,
            ToConfirm: 40,
            Success: 45
        },
        statusName: {
            20: '待支付',
            25: '待开发',
            30: '开发中',
            35: '预览待确认', //代理商确认
            40: '待上线',
            45: '已上线'
        }
    },
    SITE2ORDER: {
        //网站 状态  对应 订单 状态
        80: 25,
        100: 30,
        110: 35,
        120: 40,
        90: 45
    }
}


var SiteModel = module.exports = util.extend({
    _schema: Site
}, Base);

/**
 * 得到mongoose的model
 * @returns {*}
 */
SiteModel.getModel = function() {
    return Site;
};


//extend
SiteModel.findBySiteID = function(siteID) {
    return this.findOne({
        'siteID': siteID
    });
}

SiteModel.changeType = function(siteID, type) {
    var self = this;
    return self.findOne('siteID', siteID).then(function(site) {
        site.ide.type = type || 'dev';
        site.status = 90;
        return self.update(site).then(function() {
            return site;
        });
    });
};
/**
 * 修改 网站的状态的时候 如果发现有 订单 则 同时去修改 订单的状态
 * @returns {Model}
 */
SiteModel.update = function() {
    console.error('网站状态 修改  参数为 ' + JSON.stringify(arguments));
    if (arguments.length == 2) {
        var siteId = arguments[0]._id;
        //保存的一些值
        var options = arguments[1];
        //表示当前的site id 有值
        if (siteId) {
            util.each(options, function(value, key) {
                //表示  中间含有 状态这个信息
                if (key === 'status') {
                    var orderStatus = config.SITE2ORDER[value]
                    if (orderStatus) {
                        //  console.log(arguments[0] +"   "+ orderStatus )
                        //表示存在 网站 状态  和 订单互相转换的值
//                        SellRecordsModel.update({ site: siteId }, { status: orderStatus }).done(function(result) { console.error("网站 对应 的 订单状态 修改成功  "); });
                        //表示当前订单 已经 完成 保存 sellrecord 的 完成时间
                        if (orderStatus == config.ORDER.status.Success) {
                            //更新网站的上线 状态
                            Q.all([
                                SiteModel.update({ _id: siteId }, { completedAt: new Date() }),
                                SellRecordsModel.update({ site: siteId }, { completedAt: new Date() })
                            ]).done(function(result) {
                                console.error("网站 完成时间 修改成功  ");
                            });
                        }
                    }
                } else if (key === 'host') {
                    // 得到host
                    options[key] = util.getHost(value);
                }
            })
        }
    }
    return Base.update.apply(this, arguments);
};
SiteModel.load = function(id, cb) {
    Site.findOne({ _id: id })
        .populate('developer')
        .populate('user')
        .populate('owner')
        .exec(cb);
};

SiteModel.getCount = function(criteria) {
    if (!criteria) criteria = {};
    criteria['isDelete'] = {$ne: true};
    return Q.when(Site.count(criteria).exec());
}

SiteModel.qList = function(options) {
    var criteria = options.criteria || {};
    //判断删除选项
    criteria['isDelete'] = {$ne: true};
    var a = Site.find(criteria)
        .sort({ 'createdAt': -1 })
        .populate('developer', 'name email')
        .populate('user', 'name email')
        .populate('owner', 'name email')
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec();
    return Q.when(a);
};
