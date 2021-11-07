
const {getCurrentDateTimeString} = require('../helper/DateTime');
//db models
const Employee = require('../models/employee');
const ShiftType = require('../models/shiftType');
const ShiftAssign = require('../models/shiftAssign');
const TimeKeeping = require('../models/timeKeeping');
const NextWeekTimeKeeping = require('../models/nextWeekTimeKeeping');
class EmployeeTab {
    //shift Assign
    getEmployee = async (req, res) => {
        var filter = typeof req.body.filter === 'object' ? req.body.filter : JSON.parse(req.body.filter);
        Employee.find(filter)
            .exec()
            .then((data) => {
                console.log(data)
                res.status(200).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                        data,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    }
    createEmployee = async (req, res) => {
        const employee = req.body.employee;
        const id = req.body.employee._id;
        const employees = new Employee({ 
            _id :{
                employeeID : id.employeeID,
                storeID  : id.storeID,
            },
            managerID: employee.managerID,
            password: employee.password,
            firstName: employee.firstName, 
            lastName: employee.lastName,
            phoneNumber: employee.phoneNumber,
            dateOfBirth: employee.dateOfBirth,
            email: employee.email,
            address: employee.address,
            cardID: employee.cardID,
            startDate: employee.startDate,
        });
        employees.save()
        .then((data) => {        
            res.status(200).send(
            JSON.stringify({
                token : res.locals.newToken,
                email : res.locals.decoded.email,
                data,
                })
            )})
        .catch((err) => {
            res.status(404).send(err);
        })
    }

    updateEmployee = async (req, res) => {
        const employee = req.body.employee;
        const id = req.body.employee._id;
        Employee.findOneAndUpdate({ 
            
                "_id.employeeID" : id.employeeID,
                "_id.storeID"  : id.storeID,
            },
            {$set:{
            managerID: employee.managerID,
            password: employee.password,
            firstName: employee.firstName, 
            lastName: employee.lastName,
            phoneNumber: employee.phoneNumber,
            dateOfBirth: employee.dateOfBirth,
            email: employee.email,
            address: employee.address,
            cardID: employee.cardID,
            startDate: employee.startDate,
        }}
        ,{
            returnOriginal: false,
        },
        function(err, doc){
            if(err){
                res.status(404).send(err);
            }
            else{
        res.status(200).send(
                JSON.stringify({
                    token : res.locals.newToken,
                    email : res.locals.decoded.email,
                    data : doc,
                })
            )}
        });
    }

    deleteEmployee = async (req, res) => {
        var employee = req.body.employee;


        Employee.delete({storeID:employee.storeID , employeeID:employee.employeeID})
        .then((data) => {
            console.log(data);
            res.status(200).send(
                JSON.stringify({
                    email: res.locals.decoded.email,
                    token: res.locals.newToken,
                    data,
                })
            );
        })
        .catch((err) => {
            res.status(404).send(err);
        });;     
    }

    getEmployeeDelete = async (req, res) => {
        var filter = typeof req.body.filter === 'object' ? req.body.filter : JSON.parse(req.body.filter);
        
        Employee.findDeleted(filter)
            .exec()
            .then((data) => {
                console.log(data)
                res.status(200).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                        data,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    }
    restoreEmployee = async (req, res) => {
        var employee = req.body.employee;
        Employee.restore ({storeID:employee.storeID , employeeID:employee.employeeID})
        .then((data) => {
            res.status(200).send(
                JSON.stringify({
                    email: res.locals.decoded.email,
                    token: res.locals.newToken,
                    data,
                })
            );
        })
        .catch((err) => {
            res.status(404).send(err);
        });
    }
    deleteEmployeeforever = async (req, res) => {
        const employee = req.body.employee;

        Employee.findOneAndDelete(
            {storeID:employee.storeID , 
            employeeID:employee.employeeID})
        .then((data) => {
            res.status(200).send(
                JSON.stringify({
                    email: res.locals.decoded.email,
                    token: res.locals.newToken,
                    data,
                })
            );
        })
        .catch((err) => {
            res.status(404).send(err);
        });;     
    }




    getShiftAssign = async (req, res) => {
    };

    createShiftAssign = async (req, res) => {

    };

    deleteShiftAssign = async (req, res) => {

    };
    //

    //timekeeping
    getTimeKeeping = async (req, res) => {

    };

    createTimeKeeping = async (req, res) => {

    };

    updateTimeKeeping = async (req, res) => {

    };

    deleteTimeKeeping = async (req, res) => {

    };


    //
};

module.exports = new EmployeeTab();