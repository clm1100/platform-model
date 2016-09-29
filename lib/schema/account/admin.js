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

/**
 * Admin Schema
 */
var AdminSchema = new Schema({
    name: String,
    tel: String,
    qq: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true
    },
    status: {
        type: Number,
        // TODO: 状态写入数据库字典表
        default: 20
    },
    url: {
        type: String,
        trim: true
    },
    desc: String,
    hashed_password: String,
    salt: String,

    logs: [{
        //对应动作名称
        action: {
            type: String,
            default: ''
        },
        // //操作人
        // operator: {
        //   type: Schema.ObjectId,
        //   ref: 'Agent'
        // },
        name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        //操作记录
        more: {
            type: String,
            default: ''
        },
        //操作时间
        createdAt: {
            type: Date,
            get: util.getDateTime,
            default: Date.now
        }
    }],
    message: [{
        cont: {
            type: String,
        },
        fromId: {
            type: String,
        },
        amount: {
            type: Number,
        },
        sentTime: {
            type: Date,
            get: util.getDateTime,
            default: Date.now
        },
        status: {
            type: Number,
            default: 0
        }
    }],
    createdTime: {
        type: Date,
        get: util.getDateTime,
        default: Date.now
    },
    preferences: {
        type: String,
        default: '{}'
    },
    recommend: {
        shops: {
            type: Array,
            default: []
        },
        products: {
            type: Array,
            default: []
        }
    }
});

/**
 * Virtuals
 */

AdminSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

AdminSchema.virtual('isAdmin').get(function() {
    return true;
});

AdminSchema.virtual('isSuperAdmin').get(function() {
    return this.email === "admin@yunshipei.com";
});


AdminSchema.virtual('isSubAdmin').get(function() {
    return this.email !== "admin@yunshipei.com";
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
AdminSchema.path('name').validate(function(name) {
    return name.length;
}, '名称不能为空');

AdminSchema.path('email').validate(function(email) {
    return email.length;
}, '邮件地址不能为空');

AdminSchema.path('hashed_password').validate(function(hashed_password) {
    return hashed_password.length;
}, '密码不能为空');

/**
 * Pre-save hook
 */
AdminSchema.pre('save', function(next) {
    if (!this.isNew) {
        return next();
    }
    if (!validatePresenceOf(this.password)) {
        next(new Error('无效的密码'));
    } else {
        next();
    }
});

/**
 * Methods
 */
AdminSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    addLog: function(action, Admin, log, callback) {
        this.logs.push({
            action: action,
            // operator: Admin._id,
            name: Admin.name,
            email: Admin.email,
            more: log
        });

        this.save(function(error) {
            callback(error)
        });
    },
    saveMessage: function(user, fromId, message, amount, callback) {
        this.message.push({
            cont: message,
            amount: amount,
            fromId: fromId,
            status: 1
        });

        this.save(function(error) {
            callback(error)
        });
    },
    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        return util.encrypt(password, this.salt);
    }
};

AdminSchema.statics = {
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


    list: function(options, cb) {
        var criteria = options.criteria || {};
        criteria['$nor'] = [{
            email: 'admin@yunshipei.com'
        }];
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

module.exports = mongoose.model('Admin', AdminSchema);

if (process.env.INIT_ADMIN) { // init
    var Admin = mongoose.model('Admin');
    Admin.findOne({
        email: 'admin@yunshipei.com'
    }, function(err, admin) {
        if (err) {
            return console.error(err);
        }
        if (!admin) {
            admin = new Admin({
                email: 'admin@yunshipei.com',
                name: '管理员'
            });
            admin.password = 'nodemobile.js';
            // TODO: 状态写入数据库字典表
            admin.status = 20;
            admin.save(function(err, admin) {
                if (err) {
                    return console.error(err);
                }
            });
        }
    });
}