'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User Schema
 */
var SequenceSchema = new Schema({
    currentIdValue: {
        type: Number,
        default: 0
    },
    tableName: String
});

/**
 * 得到id 的序列器
 * @type {{findAndModify: findAndModify}}
 */
SequenceSchema.statics = {
    findAndModify: function (query, sort, doc, options, callback) {
        return this.collection.findAndModify(query, sort, doc, options, callback);
    }
};

module.exports = mongoose.model('Sequence', SequenceSchema, 'sequence');