
const {getCurrentDateTimeString} = require('../helper/DateTime');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeKeeping = new Schema({
    _id: {
        realDate: Date,
        dateInWeek: String,
        storeID: String,
        shiftType: {
            _id: {
                shiftID: String,
                storeID: String,
            },
            name: String,
            timeFrom: String,
            timeEnd: String,
            salary: Number,
        },
        employee: {
            _id: {
                employeeID: String,
                storeID: String,
            },
            managerID: String,
            password: String,
            firstName: String,
            lastName: String,
            phoneNumber: String,
            dateOfBirth: Date,
            email: String,
            address: String,
            cardID: String,
            startDate: Date,
            endDate: Date,
        },
    },
    alternatedEmployee: {
        _id: {
            employeeID: String,
            storeID: String,
        },
        managerID: String,
        password: String,
        firstName: String,
        lastName: String,
        phoneNumber: String,
        dateOfBirth: Date,
        email: String,
        address: String,
        cardID: String,
        startDate: Date,
        endDate: Date,
    },
    isPaidSalary: Boolean,
});

module.exports = mongoose.model('TimeKeeping', TimeKeeping);