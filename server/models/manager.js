
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Manager = new Schema({
    _id: String,//email
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    address: String,
    storeID: String,
});

module.exports = mongoose.model("Manager", Manager);