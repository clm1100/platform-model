/**!
 * Allmobilize Schema Loader
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

// require('./account/session');

// account
var account = module.exports.account = {};
account.User = require('./account/user');
account.Invitation = require('./account/invitation');
account.Admin = require('./account/admin');
account.Wallet = require('./account/wallet');
account.Recharge = require('./account/recharge');
account.Log = require('./account/log');
account.Sequence = require('./account/sequence');
account.ForgetPassword = require('./account/forgetPassword');
account.ZhidaRecord = require('./account/zhida-record');
account.TradeLog = require('./account/tradeLog');
account.ActiveUsers = require('./account/activeUsers');

// develop
var develop = module.exports.develop = {};
develop.Site = require('./develop/site');
develop.Page = require('./develop/page');
develop.Widget = require('./develop/widget');
develop.Package = require('./develop/package');
develop.SiteLostFound = require('./develop/siteLostFound');
develop.SiteComment = require('./develop/siteComment');


// market
var market = module.exports.market = {};
market.Shop = require('./market/shop');
market.Product = require('./market/product');
market.SellRecord = require('./market/sellRecord');
market.AdvertiseImage = require('./market/advertiseImage');
market.SuccessCase = require('./market/successCase');
market.ProductComment = require('./market/productComment');
market.Order = require('./market/order');
market.RequireFeedback = require('./market/requireFeedback');
market.CustomerRegister = require('./market/customerRegister');
market.BugFeedback = require('./market/bugFeedback');
market.ApplyUse = require('./market/applyUse');
market.Partner = require('./market/partner');

// cms meta
var cms = module.exports.cms = {};
cms.Project = require('./cms/project');
cms.ProjectMeta = require('./cms/projectmeta');
cms.LoginLogs = require('./cms/loginlogs');

// auto
var auto = module.exports.auto = {};
auto.AutoManage = require('./auto/autoManage');
