/**!
 * Allmobilize Model Module - BaseModel
 * @author: larry / ll@yunshipei.com
 *
 * Copyright (c) 2013 Allmobilize Inc
 */

'use strict';

/**
 * BaseModel.
 * 提供一些常用的数据库查询方法.
 * 如果在这里没有找到你想要的方法,请到具体的Model类中扩展.
 * 请不要直接将mongoose中的方法对外公开.
 * 除了Model层以外,在任何地方都不允许直接调用mongoose的任何方法.
 * 也请不要在其他地方直接或间接的使用Model中没有公开的方法和特性.
 * 流程控制方面,请使用Q或者Async.
 * 所有涉及异步交互的方法均返回一个Q Promise实例. 方法注释中标识的return是指最终数据的类型.
 * by larry / ll@yunshipei.com
 */

var MongooseModel = require('mongoose').Model;
var ObjectId = require('mongoose').Types.ObjectId;

var debug = require('debug')('platform-model:BaseModel');
var Q = require('q');
var util = require('platform-common').util;

var proto = module.exports = {};

var _debug = ~ (process.env.DEBUG || '').indexOf('platform-model:BaseModel') || process.env.DEBUG === '*';

function stringify(data) {
    if (_debug) {
        return JSON.stringify(data);
    }
    return '';
}

/**
 * 查询单个Model.
 * @param  {any} id Model ID
 * @return {Model}
 */
proto.findById = function(id) {
    return this.findOne({
        '_id': id
    });
};

/**
 * 根据时间范围查询documents
 * 该接口利用了_id的构成————前个4字节是unix-like时间戳
 * 通过输入的字符串，生成十六进制的时间戳，其余位补零，进而生成OjbectId
 * 可精确到秒，并且由于_id自带索引，所以速度飞起～
 * @param  {String} start eg: '2014-7-14 10:00'
 * @param  {String} end eg: '2014-9-5 19:00'
 * @return {Array}
 */
proto.findByCreateDate = function(start, end) {
    function createObjectIdByDate(str) {
        var time = (parseInt(new Date(str) / 1000)).toString(16);
        var a = new Array(16);
        for (var i = 0, len = a.length; i < len; i++) {
            a[i] = '0';
        }
        var other = a.join('');
        return new ObjectId(time + other);
    }
    var range = {};
    if (start) {
        range.$gt = createObjectIdByDate(start);
    }
    if (end) {
        range.$lt = createObjectIdByDate(end);
    }
    return this.find({
        '_id': range
    });
};

proto.findOne = function(criteria, value) {
    if (arguments.length === 2) {
        var name = criteria;
        criteria = {};
        criteria[name] = value;
    }
    debug('find one %s', stringify(criteria));
    var self = this,
        d = Q.defer();
    self._schema.findOne(criteria, function(err, found) {
        if (err) {
            debug('find one error :%', stringify(err));
            return d.reject(err);
        }
        debug('find one found :%s', stringify(found));
        d.resolve(found);
    });
    return d.promise;
};

/**
 * 查询文档集合.
 * @param  {any} 查询条件
 * @return {Array}
 */
proto.find = function(criteria /* or attr name */ , value) {
    var self = this,
        d = Q.defer();
    if (arguments.length === 2) {
        var name = criteria;
        criteria = {};
        criteria[name] = value;
    }
    debug('find list condition: %s', stringify(criteria));
    self._schema.find(criteria, function(err, found) {
        if (err) {
            debug('find list error : %s', stringify(err));
            return d.reject(err);
        }
        debug('find list found : %s', stringify(found));
        d.resolve(found);
    });
    return d.promise;
};
/**
 * 用Q 包起来的查询
 * @param criteria
 * @param value
 * @returns {promise}
 */
proto.qfind = function(criteria, projection) {
    var self = this,
        d = Q.defer();

    self._schema.find(criteria, projection).exec(function(err, result) {
        if (err) {
            debug('find list error : %s', stringify(err));
            return d.reject(err);
        }
        debug('find list found : %s', stringify(result));
        d.resolve(result);
    });
    return d.promise;
};

/**
 * 保存或者更新
 * @param  {Model}
 * @return {Model} 入库后的Model
 */
proto.saveOrUpdate = function(model) {
    debug('save or update data : %s', stringify(model));
    var self = this,
        d = Q.defer();
    // TODO: ID为undefined时,可以直接走save的逻辑
    var promise = self.findById(model._id);
    promise.done(function(found) {
        var method = 'save';
        if (found) {
            method = 'update';
        }
        self[method](model).done(function(_return) {
            d.resolve(_return);
        }, function(err) {
            d.reject(err);
        });
    }, function(err) {
        d.reject(err);
    });
    return d.promise;
};

/**
 * 新增
 * @param  {Model} model
 * @return {Model} {Number} Model和影响行数
 */
proto.insert = proto.save = function(model) {
    debug('save data: %s', stringify(model));
    var self = this,
        d = Q.defer();
    if (!(model instanceof MongooseModel)) {
        model = new(self._schema)(model);
    }
    //util.extend(model, model);
    model.save(function(err, _return, numberAffected) {
        if (err) {
            debug('save error :%s', stringify(err));
            return d.reject(err);
        }
        debug('save success. numberAffected:%d', numberAffected);
        d.resolve({
            'data': _return,
            'numberAffected': numberAffected
        });
    });
    return d.promise;
};

/**
 * 更新
 * @param  {Model} model
 * @return {Model} {Number} Model和影响行数
 */
// TODO:这个方法重新写.
proto.update = function(criteria, model, options) {
    var self = this,
        d = Q.defer();

    if (arguments.length !== 1) {
        // TODO: 当Model传入的是一个Mongoose.Model 的时候 可能会出错.
        self._schema.update(criteria, model, options, function(err, numberAffected, _return) {
            if (err) {
                return d.reject(err);
            }
            d.resolve({
                'data': _return,
                'numberAffected': numberAffected
            });
        });
    } else if (arguments.length === 1) {
        model = criteria;
        debug('update data: %s', stringify(model));

        if (model instanceof MongooseModel) {
            model.save(function(err, _return, numberAffected) {
                if (err) {
                    debug('update error :%s', stringify(err));
                    return d.reject(err);
                }
                debug('update success. numberAffected:%d', numberAffected);
                d.resolve({
                    'data': _return,
                    'numberAffected': numberAffected
                });
            });
        } else {
            var id = model._id;
            delete model._id; // mongodb 不允许修改_ID
            self._schema.update({
                    _id: id
                },
                model,
                function(err, numberAffected, _return) {
                    if (err) {
                        debug('update error :%s', stringify(err));
                        return d.reject(err);
                    }
                    debug('update success. numberAffected:%d', numberAffected);
                    model._id = id; // 改完再赋值回去.
                    d.resolve({
                        'data': _return,
                        'numberAffected': numberAffected
                    });
                });
        }
    } else {
        d.reject(new Error('参数错误.'));
    }
    return d.promise;
};
/**
 *
 * @param  {Object} criteria
 * @param  {Object} doc
 * @param  {Object} options  可选
 * @return {Model} Model
 */
proto.findOneAndUpdate = function(criteria, doc, options) {
    var d = Q.defer();    

    if(arguments<2) {
        d.reject(new Error('参数错误.'));
    }
    this._schema.findOneAndUpdate(criteria, doc, options, function(err, result) {
        if (err) {
            return d.reject(err);
        }
        d.resolve({
            'data': result
        });
    });
    return d.promise;
};
/**
 * 删除
 * @param  {Object} or {_Id} 条件对象或者ObjectId
 * @return {Model} {Number} 被删除的Model
 */
proto.remove = function(criteria) {
    var self = this,
        d = Q.defer();
    if (!util.isObject(criteria)) { // 根据id删除
        criteria = {
            '_id': criteria
        };
    } else if (util.isArray(criteria)) {
        // 使用数组多个删除
        // TODO: unit test
        criteria = {
            '_id': {
                '$in': criteria
            }
        };
    }
    debug('remove condition :%s', stringify(criteria));
    self._schema.remove(criteria, function(err, numberAffected) {
        if (err) {
            debug('remove error :%s', stringify(err));
            return d.reject(err);
        }
        debug('remove success. numberAffected:%d', numberAffected);
        d.resolve(numberAffected);
    });
    return d.promise;
};

proto.saveCollection = function(collection) {
    var self = this;
    return Q.all(util.map(collection, function(model) {
        return self.saveOrUpdate(model);
    }));
};

// TODO: 临时解决类似问题.
proto.markModified = function(model, path) {
    if (model instanceof MongooseModel) {
        model.markModified(path);
    }
};

proto.getCount = function(criteria) {
    return Q.when(this._schema.count(criteria).exec());
};


var DEFAULT_PAGINATE_LIMIT = 20;
/**
 * 数据分页
 * @param  {Object} 条件对象
 * @param  {Number} 起始页
 * @param  {Number} 每页的区间大小
 * @param  {Boolen} 是否按时间排序
 * @return {Object}
 *        struct :
 *          total 总条数.
 *          limit 实际分页大小.
 *          start 实际当前页index
 *          pageTotal 总页数
 *          data 当前页数据
 */
// proto.paginate = function(criteria, start, limit, sortArgu, populate) {
//     var self = this,
//         currentPageNum,
//         startRowNum;
//     if (util.isNumber(criteria)) { // overload
//         limit = start;
//         start = criteria;
//         criteria = {};
//     }
//     limit = parseInt(limit) || DEFAULT_PAGINATE_LIMIT; // 默认每页20条.
//     start = parseInt(start) || 1;
//     start = start < 1 ? 1 : start; // 当起始页小于1时
//     limit = limit || DEFAULT_PAGINATE_LIMIT;
//     limit = limit < 0 ? DEFAULT_PAGINATE_LIMIT : limit; // 当分页大小小于0时 使用默认的分页大小
//     limit = limit > 100 ? 100 : limit; //当分页大小超过100时, 设置为100

//     var result = {};
//     return self.getCount(criteria).then(function(total) {

//         currentPageNum = start - 1; // 将当前页减1 用于计算起始index
//         var pageTotal = parseInt(total / limit) || 1; // 计算出总页数.
//         currentPageNum = currentPageNum > pageTotal ? pageTotal : currentPageNum; // 当当前页数大于总页数 取最后一页.
//         debug('currentPageNum: ', currentPageNum, total);
//         startRowNum = limit * currentPageNum;
//         debug('startRowNum:', startRowNum);

//         // result
//         result.total = total;
//         result.limit = limit;
//         result.start = start;
//         result.pageTotal = pageTotal;
//         result.prevable = start > 1;
//         result.nextable = (pageTotal - start) > 0;
//         if (!sortArgu) {
//             return Q.when(self._schema.find(criteria)
//                 .skip(startRowNum)
//                 .limit(limit)
//                 .populate(populate)
//                 .exec());
//         } else {
//             return Q.when(self._schema.find(criteria)
//                 .skip(startRowNum)
//                 .limit(limit)
//                 .sort({sortArgu: -1})
//                 .populate(populate)
//                 .exec());
//         }
//     }).then(function(data) {
//         result.data = data;
//         return result;
//     });
// };



proto.paginate = function(criteria, start, limit, sortArgu, populate) {
    var self = this,
        currentPageNum,
        startRowNum;
    if (util.isNumber(criteria)) { // overload
        limit = start;
        start = criteria;
        criteria = {};
    }
    limit = parseInt(limit) || DEFAULT_PAGINATE_LIMIT; // 默认每页20条.
    start = parseInt(start) || 1;
    start = start < 1 ? 1 : start; // 当起始页小于1时
    limit = limit || DEFAULT_PAGINATE_LIMIT;
    limit = limit < 0 ? DEFAULT_PAGINATE_LIMIT : limit; // 当分页大小小于0时 使用默认的分页大小
    limit = limit > 100 ? 100 : limit; //当分页大小超过100时, 设置为100

    var result = {};
    return self.getCount(criteria).then(function(total) {

        currentPageNum = start - 1; // 将当前页减1 用于计算起始index
        var pageTotal = Math.ceil(total / limit) || 1; // 计算出总页数.
        currentPageNum = currentPageNum > pageTotal ? pageTotal : currentPageNum; // 当当前页数大于总页数 取最后一页.
        debug('currentPageNum: ', currentPageNum, total);
        startRowNum = limit * currentPageNum;
        debug('startRowNum:', startRowNum);

        // result
        result.total = total;
        result.limit = limit;
        result.start = start;
        result.pageTotal = pageTotal;
        result.prevable = start > 1;
        result.nextable = (pageTotal - start) > 0;

        if (!sortArgu && !populate) {
            return Q.when(self._schema.find(criteria)
                .skip(startRowNum)
                .limit(limit)
                .exec());
        } else if (sortArgu && !populate) {
            return Q.when(self._schema.find(criteria)
                .sort(sortArgu)
                .skip(startRowNum)
                .limit(limit)
                .exec());
        } else if (!sortArgu && populate) {
            return Q.when(self._schema.find(criteria)
                .skip(startRowNum)
                .limit(limit)
                .populate(populate[0])
                .populate(populate[1])
                .populate(populate[2])
                .exec());
        } else {
            return Q.when(self._schema.find(criteria)
                .sort(sortArgu)
                .skip(startRowNum)
                .limit(limit)
                .populate(populate[0])
                .populate(populate[1])
                .populate(populate[2])
                .exec());
        }
    }).then(function(data) {
        result.data = data;
        return result;
    });
};

proto.populate = function(criteria) {
    var a = this._schema.find(criteria.query)
        .populate(criteria.popu[0])
        .populate(criteria.popu[1])
        .populate(criteria.popu[2])
        .exec();
    return Q.when(a);
}

proto.aggregate = function(criteria) {
    var a = this._schema.aggregate(criteria).exec();
    return Q.when(a);
};

proto.ObjectId = ObjectId;