/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema,
    util = require('platform-common').util;


/**
 * Site Schema
 */

var OrderSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    subject: String,
    body: String,
    amount: Number,
    deal_time: {
        type: Date,
        get: util.getDateTime,
        default: Date.now
    },
    status: Number,
    ebank: Number
});
OrderSchema.virtual('isfinish')
    .get(function() {
        if (this.status == 1) {
            return true;
        } else {
            return false;
        }
    });

OrderSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        })
            .exec(cb);
    },
    list: function(options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria)
        // .populate('logs.operator')
        .sort({
            'deal_time': -1
        }) // sort by date
        .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    }

}

mongoose.model('Order', OrderSchema);