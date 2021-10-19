
const {getCurrentDateTimeString} = require('../helper/DateTime');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShiftAssign = new Schema({
    _id: {
        dateInWeek: String,
        storeID: String,
        shiftType: {
            type: Schema.Types.ObjectId,
            ref: "ShiftType",
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
        },
    },
    createdAt: getCurrentDateTimeString(),
});

module.exports = mongoose.model('ShiftAssign', ShiftAssign);