const jwt = require("jsonwebtoken"); // authentication & authorization
const PRIVATE_KEY = require("../privateKey"); // temp private key
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");
const Manager = require("../models/manager"); // db model
const Store = require("../models/store"); //
const ShiftType = require("../models/shiftType");
const ShiftAssign = require("../models/shiftAssign");
const ReturnProduct = require("../models/returnProduct");
const Receipt = require("../models/receipt");
const Product = require("../models/product");
const Employee = require("../models/employee");
const Coupon = require("../models/coupon");
const {JWTVerify} = require("../helper/JWT");

class meProfile {
    AuthVerify (req, res, next) {
        const token  = req.header('authorization');
        token = token.split(' ')[1];
        if(!token) return res.status(401).send('Access Denied')
        jwt.verify(token,PRIVATE_KEY, (err,data) => {
            res.data = data;
            next();
        })
        if(err){
            return res.status(400).send('Invalid token')
        }
    
    }
    verifySignIn = async (req, res) => {
        const data = req.body
        accessToken = jwt.sign(...data, PRIVATE_KEY, {expiresIn: 900})
        res.json(accessToken)
    }
        
    Profile = async (req, res) => {
        const manager = Manager.find({_id : req.body.email})
        const store = Store.find({_id :req.body._id})
        res.status(200).send(
            JSON.stringify({
                data:{manager,store}
            })
        )
    }
    updateProfileData = async (req, res) =>{
        const idcheck = req.body._id
        const email = req.body.email;   
        const newfirstName = req.body.firstName;
        const newlastName = req.body.lastName;
        const newphoneNumber = req.body.phoneNumber;
        const newAddress = req.body.address;
        const newProvince = req.body.province;
        const newDistrict = req.body.district;
        const newstoreName = req.body.storeName;
        Manager.findOne({ _id: email })
            .exec()
            .then((data) => {
                if (data) {
                    throw new Error();
                }  else {
                    const newManager = new Manager({
                        _id: email,
                        name: newstoreName
                    });

                    newManager
                        .save()
                }
            })
            .catch((err) => {
                Store.findOneAndUpdate(
                    {
                        _id: email,
                    },
                    {$set:{
                        name: newstoreName,
                    }},
                    {
                        returnOriginal: false,
                    },
                    function(err, doc){
                        if(err){
                            console.log("Something wrong when updating data!");
                        }
                    
                        console.log(doc);
                    });
            });

        Manager.findOneAndUpdate(
            {
                email: email,
            },
            {$set:{
                lastName:newlastName,
                firstName:newfirstName,
                phoneNumber:newphoneNumber,
                address:newAddress,
                province:newProvince,
                district:newDistrict,
                storeID: email,
            }},
            {
                returnOriginal: false,
            },
            function(err, doc){
                if(err){
                    console.log("Something wrong when updating data!");
                }
            
                console.log(doc);
            });
}
    addShift = async (req, res) => {
        const idUserJwt = req.body.data.idUser;
        const idShift = req.body.data.id;
        const newSalary = req.body.data.salary
        const name = req.body.data.description
        const from = req.body.data.from
        const to = req.body.data.to

        const newShift = new ShiftType({
            _id:  { shiftID : idShift,
                storeID : idUserJwt,
                 },
                name: name,
                timeFrom : from,
                timeEnd : to,
                salary: newSalary,
                    });

                newShift.save()
                }
 
    updateShift = async (req, res) => {
        const idUser = req.body.idUser
        const idShift = req.body.id
        const newSalary = req.body.salary
        const name = req.body.description
        const from = req.body.from
        const to = req.body.to
        const obj = {
            storeID : idUser,
            shiftID : idShift,
        }
        ShiftType.findOneAndUpdate(
            {shiftID : idShift,storeID : idUser,},
            {$set:{
                name: name,
                timeFrom : from,
                timeEnd : to,
                salary: newSalary,
            }},{
                returnOriginal: false,
            },
            function(err, doc){
                if(err){
                    console.log("Something wrong when updating data!");
                }
            
                console.log(doc);
            });
    }
    deleteShift = async (req, res) => {
        const idUser = req.body.idUser
        const idShift = req.body.id
        ShiftType.findOneAndDelete(
            {shiftID : idShift,storeID : idUser,},
            function(err, doc){
                if(err){
                    console.log("Something wrong when updating data!");
                }
            
                console.log(doc);
            });
    }
    changePassword = async (req, res) => {
        const email = req.body.email;
        const newPassword = req.body.newPass;

        Manager.findOneAndUpdate(
            {
                email: email,
            },
            {
                password: newPassword,
            },
            {
                returnOriginal: false,
            }
        )
            .then((data) => {
                if (data) {
                    res.send(
                        JSON.stringify({
                            status: STATUS.SUCCESS,
                            message: MESSAGES.RESET_PASSWORD_SUCCESS,
                        })
                    );
                } else {

                    Manager.findOne({ email: email }).then((data) => {
                        if (data) {
                            res.send(
                                JSON.stringify({
                                    status: STATUS.FAILURE,
                                    message: MESSAGES.EMAIL_USED_GG,
                                })
                            );
                        } else {
                            res.send(
                                JSON.stringify({
                                    status: STATUS.FAILURE,
                                    message: MESSAGES.EMAIL_ERROR,
                                })
                            );
                        }
                    })
                }
            })
            .catch((err) => {
                res.send(
                    JSON.stringify({
                        status: STATUS.FAILURE,
                        message: err.message,
                    })
                );
            });

    };
    
}
module.exports = new meProfile();