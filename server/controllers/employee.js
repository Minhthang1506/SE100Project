const {
    getCurrentDateTimeString,
    getDayInWeek,
    getTimeFromTimeString,
    dateEquals,
} = require("../helper/DateTime");
//db models
const Employee = require("../models/employee");
const ShiftType = require("../models/shiftType");
const ShiftAssign = require("../models/shiftAssign");
const TimeKeeping = require("../models/timeKeeping");
const NextWeekTimeKeeping = require("../models/nextWeekTimeKeeping");
const nextWeekTimeKeeping = require("../models/nextWeekTimeKeeping");
class EmployeeTab {
    //shift Assign
    getEmployee = async (req, res) => {
        var filter =
            typeof req.body.filter === "object"
                ? req.body.filter
                : JSON.parse(req.body.filter);
        Employee.find(filter)
            .exec()
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
    };
    createEmployee = async (req, res) => {
        const employee = req.body.employee;
        const id = req.body.employee._id;
        Employee.findOne({ "_id.employeeID": id.employeeID })
        .exec()
        .then((data) =>     {
            if (data) {
                res.status(404).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                        message: "ID duplicated",
                    })
                );

            } else {
                const employees = new Employee({
            _id: {
                employeeID: id.employeeID,
                storeID: id.storeID,
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
            isEmployee: true,
            imgUrl: employee.imgUrl
        });
        employees
            .save()
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        token: res.locals.newToken,
                        email: res.locals.decoded.email,
                        data,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
            }
        })
        
    };

    updateEmployee = async (req, res) => {
        const employee = req.body.employee;
        const id = req.body.employee._id;
        Employee.findOneAndUpdate(
            {
                "_id.employeeID": id.employeeID,
                "_id.storeID": id.storeID,
            },
            {
                $set: {
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
                    imgUrl: employee.imgUrl
                },
            },
            {
                returnOriginal: false,
            },
            function (err, doc) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    res.status(200).send(
                        JSON.stringify({
                            token: res.locals.newToken,
                            email: res.locals.decoded.email,
                            data: doc,
                        })
                    );
                }
            }
        );
    };

    deleteEmployee = async (req, res) => {
        var employee = req.body.employee;
        Employee.delete({ _id: { $in: [...employee] } })
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
    };

    getEmployeeDelete = async (req, res) => {
        var filter =
            typeof req.body.filter === "object"
                ? req.body.filter
                : JSON.parse(req.body.filter);

        Employee.findDeleted(filter)
            .exec()
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
    };
    restoreEmployee = async (req, res) => {
        var employee = req.body.employee;
        Employee.restore({ _id: { $in: [...employee] } })
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
    };
    deleteEmployeeforever = async (req, res) => {
        const employee = req.body.employee;

        Employee.findOneAndDelete({ _id: { $in: [...employee] } })
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
    };

    getShiftAssign = async (req, res) => {
        var filter =
            typeof req.body.filter === "object"
                ? req.body.filter
                : JSON.parse(req.body.filter);
        ShiftAssign.find(filter)
            .exec()
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
    };

    createShiftAssign = async (req, res) => {
        const newShiftAssign = new ShiftAssign({
            ...req.body.shiftAssign,
            createdAt: new Date(),
        });

        newShiftAssign
            .save()
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
    };

    updateShiftAssign = async (req, res) => {
        const updateShiftAssign = {
            ...req.body.shiftAssign,
            createAt: getCurrentDateTimeString(),
        };

        newShiftAssign
            .save()
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
    };

    deleteShiftAssign = async (req, res) => {
        const deletedShiftAssign = req.body.shiftAssign;

        console.log("deletedShiftAssign._id", deletedShiftAssign);
        // var newI = await ShiftAssign.findOne({_id: deletedShiftAssign._id});
        // console.log("newI", newI);

        ShiftAssign.deleteOne({ _id: deletedShiftAssign._id })
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    };
    //

    //timekeeping
    getTimeKeeping = async (req, res) => {
        var filter =
            typeof req.body.filter === "object"
                ? req.body.filter
                : JSON.parse(req.body.filter);
        TimeKeeping.find(filter)
            .exec()
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
    };

    //timekeeping
    getTimeKeeping = async (req, res) => {
        var filter =
            typeof req.body.filter === "object"
                ? req.body.filter
                : JSON.parse(req.body.filter);
        TimeKeeping.find(filter)
            .exec()
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
    };

    createTimeKeeping = async (req, res) => {
        var employeeID = req.body.data.email;
        var timeString = req.body.data.time;
        var time = getTimeFromTimeString(timeString);
        var employee = await Employee.findOne({
            "_id.employeeID": employeeID,
        }).exec();
        var dateInWeek = getDayInWeek(time.toString());
        var storeID = employee._id.storeID;
        var shiftTypes = await ShiftType.find({
            "_id.storeID": storeID,
        }).exec();
        var currentShiftType = shiftTypes.find((shift) => {
            return (
                getTimeFromTimeString(shift.timeFrom) - time <= 0 &&
                getTimeFromTimeString(shift.timeEnd) - time >= 0
            );
        });
        employee = employee.toObject();
        var realDate = new Date();
        realDate = new Date(
            realDate.getFullYear(),
            realDate.getMonth(),
            realDate.getDate(),
            0,
            0,
            0
        );

        if (currentShiftType) {
            currentShiftType = currentShiftType.toObject();
            ShiftAssign.findOne({
                _id: {
                    dateInWeek,
                    storeID,
                    shiftType: {
                        _id: currentShiftType._id,
                    },
                    employee: {
                        _id: employee._id,
                    },
                },
            })
                .then((data) => {
                    if (data) {
                        NextWeekTimeKeeping.find({
                            "_id.dateInWeek": data._id.dateInWeek,
                            "_id.storeID": data._id.storeID,
                            "_id.shiftType._id": data._id.shiftType._id,
                            "_id.employee._id": data._id.employee._id,
                        }).then((result) => {
                            var currentOffDay = result.find((offDay) => {
                                return dateEquals(
                                    offDay._id.realDate,
                                    new Date()
                                );
                            });

                            if (currentOffDay) {
                                res.status(404).send(
                                    JSON.stringify({
                                        employeeID: res.locals.decoded.email,
                                        token: res.locals.newToken,
                                        message:
                                            "You is absence in this shift!",
                                    })
                                );
                            } else {
                                TimeKeeping.findOne({
                                    "_id.dateInWeek": dateInWeek,
                                    "_id.storeID": storeID,
                                    "_id.shiftType._id": currentShiftType._id,
                                    "_id.employee._id": employee._id,
                                    "_id.realDate": realDate,
                                }).then((timeKeeping) => {
                                    if (timeKeeping) {
                                        res.status(200).send(
                                            JSON.stringify({
                                                employeeID:
                                                    res.locals.decoded.email,
                                                token: res.locals.newToken,
                                                message:
                                                    "You have been Checked-in",
                                            })
                                        );
                                    } else {
                                        const newTimeKeeping = new TimeKeeping({
                                            _id: {
                                                dateInWeek,
                                                storeID,
                                                shiftType: currentShiftType,
                                                employee,
                                                realDate,
                                            },
                                            alternatedEmployee: {},
                                            isPaidSalary: false,
                                        });

                                        const db = newTimeKeeping.save();

                                        res.status(200).send(
                                            JSON.stringify({
                                                employeeID:
                                                    res.locals.decoded.email,
                                                token: res.locals.newToken,
                                                message:
                                                    "Check-in successfully!",
                                            })
                                        );
                                    }
                                });
                            }
                        });
                    } else {
                        NextWeekTimeKeeping.find({
                            "_id.dateInWeek": dateInWeek,
                            "_id.storeID": storeID,
                            "_id.shiftType._id": currentShiftType._id,
                            alternativeEmployee: {
                                _id: employee._id,
                            },
                        }).then((result) => {
                            var currentOffDay = result.find((offDay) => {
                                return dateEquals(
                                    offDay._id.realDate,
                                    new Date()
                                );
                            });

                            if (currentOffDay) {
                                TimeKeeping.findOne({
                                    "_id.dateInWeek": dateInWeek,
                                    "_id.storeID": storeID,
                                    "_id.shiftType._id": currentShiftType._id,
                                    "_id.employee._id": employee._id,
                                    "_id.realDate": realDate,
                                }).then((timeKeeping) => {
                                    if (timeKeeping) {
                                        res.status(200).send(
                                            JSON.stringify({
                                                employeeID:
                                                    res.locals.decoded.email,
                                                token: res.locals.newToken,
                                                message:
                                                    "You have been Checked-in",
                                            })
                                        );
                                    } else {
                                        const newTimeKeeping = new TimeKeeping({
                                            _id: {
                                                dateInWeek,
                                                storeID,
                                                shiftType: currentShiftType,
                                                employee,
                                                realDate,
                                            },
                                            alternatedEmployee:
                                                currentOffDay._id.employee,
                                            isPaidSalary: false,
                                        });

                                        const db = newTimeKeeping.save();

                                        res.status(200).send(
                                            JSON.stringify({
                                                employeeID:
                                                    res.locals.decoded.email,
                                                token: res.locals.newToken,
                                                message:
                                                    "Check-in successfully!",
                                            })
                                        );
                                    }
                                });
                            } else {
                                res.status(404).send(
                                    JSON.stringify({
                                        employeeID: res.locals.decoded.email,
                                        token: res.locals.newToken,
                                        message:
                                            "You is absence in this shift!",
                                    })
                                );
                            }
                        });
                    }
                })
                .catch((err) => res.status(404).send(err));
        } else {
            res.status(404).send(
                JSON.stringify({
                    employeeID: res.locals.decoded.email,
                    token: res.locals.newToken,
                    message: "Not found shift",
                })
            );
        }
    };

    updateTimeKeeping = async (req, res) => {
        var updatedTimeKeeping = req.body.updatedTimeKeeping;

        // console.log("req.body.updatedTimeKeeping.id\n", req.body.updatedTimeKeeping._id);

        var dataEmployee = {...updatedTimeKeeping._id.employee};
        dataEmployee.startDate = new Date(dataEmployee.startDate);
        dataEmployee.dateOfBirth = new Date(dataEmployee.dateOfBirth);

        const dataToSearch = {
            "_id.dateInWeek": updatedTimeKeeping._id.dateInWeek,
            "_id.storeID": updatedTimeKeeping._id.storeID,
            "_id.shiftType": updatedTimeKeeping._id.shiftType,
            "_id.employee": dataEmployee,
            "_id.realDate": new Date(updatedTimeKeeping._id.realDate),
        };
        // console.log("dataSearch", dataToSearch);
        var newI = await TimeKeeping.findOne(dataToSearch);
        console.log("newI", newI);

        TimeKeeping.findOneAndUpdate(
            { ...dataToSearch },
            {
                $set: {
                    isPaidSalary: updatedTimeKeeping.isPaidSalary,
                },
            },
            {
                returnOriginal: false,
            }
        ).then((data) => {
            res.status(200).send(
                JSON.stringify({
                    employeeID: res.locals.decoded.email,
                    token: res.locals.newToken,
                    message: "Update successfully!",
                    data,
                })
            );
        });
    };

    deleteTimeKeeping = async (req, res) => {};
    //

    // ofday
    getOffDay = async (req, res) => {
        var filter =
            typeof req.body.filter === "object"
                ? req.body.filter
                : JSON.parse(req.body.filter);
        NextWeekTimeKeeping.find(filter)
            .exec()
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
    };

    createOffDay = async (req, res) => {
        const offDay = req.body.offDay;
        offDay._id.dateInWeek = getDayInWeek(offDay._id.realDate);
        const newOffDayID = { ...offDay._id };
        delete newOffDayID.realDate;
        // console.log(newOffDayID);
        // console.log(offDay);
        ShiftAssign.findOne({ _id: newOffDayID }).then((data) => {
            if (data) {
                const shiftAssignOfAlternativeEmployee = { ...newOffDayID };
                shiftAssignOfAlternativeEmployee.employee =
                    offDay.alternativeEmployee;

                ShiftAssign.findOne({
                    _id: shiftAssignOfAlternativeEmployee,
                }).then((data) => {
                    if (data) {
                        res.status(404).send(
                            JSON.stringify({
                                email: res.locals.decoded.email,
                                token: res.locals.newToken,
                                message: "Employee is busy in this shift!",
                            })
                        );
                    } else {
                        NextWeekTimeKeeping.findOne({
                            "_id.dateInWeek": offDay._id.dateInWeek,
                            "_id.storeID": offDay._id.storeID,
                            "_id.shiftType": offDay._id.shiftType,
                            "_id.realDate": offDay._id.realDate,
                            alternativeEmployee: offDay.alternativeEmployee,
                        })
                            .then((busyEmployee) => {
                                if (busyEmployee) {
                                    res.status(404).send(
                                        JSON.stringify({
                                            email: res.locals.decoded.email,
                                            token: res.locals.newToken,
                                            message:
                                                "Employee is busy in this shift!",
                                        })
                                    );
                                } else {
                                    const newOffDay = new NextWeekTimeKeeping({
                                        ...offDay,
                                    });
                                    newOffDay
                                        .save()
                                        .then((data) => {
                                            res.status(200).send(
                                                JSON.stringify({
                                                    email: res.locals.decoded
                                                        .email,
                                                    token: res.locals.newToken,
                                                    data,
                                                })
                                            );
                                        })
                                        .catch((err) => {
                                            res.status(404).send(err);
                                        });
                                }
                            })
                            .catch((err) => {
                                res.status(404).send(err);
                            });
                    }
                });
            } else {
                res.status(404).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                        message: "Not found shift for this employee!",
                    })
                );
            }
        });
    };

    updateOffDay = async (req, res) => {};

    deleteOffDay = async (req, res) => {
        const deletedOffDay = req.body.offDay;
        deletedOffDay._id.realDate = new Date(deletedOffDay._id.realDate);
        // console.log("deletedOffDay._id", deletedOffDay._id);

        // const newI = await NextWeekTimeKeeping.findOne({
        //     "_id.dateInWeek": deletedOffDay._id.dateInWeek,
        //     "_id.storeID": deletedOffDay._id.storeID,
        //     "_id.shiftType": deletedOffDay._id.shiftType,
        //     "_id.employee": deletedOffDay._id.employee,
        //     "_id.realDate": deletedOffDay._id.realDate
        // });
        // console.log("newI", newI);
        NextWeekTimeKeeping.deleteOne({
            "_id.dateInWeek": deletedOffDay._id.dateInWeek,
            "_id.storeID": deletedOffDay._id.storeID,
            "_id.shiftType": deletedOffDay._id.shiftType,
            "_id.employee": deletedOffDay._id.employee,
            "_id.realDate": deletedOffDay._id.realDate,
        })
            .then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        email: res.locals.decoded.email,
                        token: res.locals.newToken,
                    })
                );
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    };
    //
}

module.exports = new EmployeeTab();
