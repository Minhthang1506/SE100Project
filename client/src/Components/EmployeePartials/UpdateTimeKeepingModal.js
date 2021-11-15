import React, { Component } from 'react';
import { Card, CardHeader, Divider, Grid, TextField, 
        Box, CardContent, Button, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { connect } from 'react-redux'
import { Image } from 'cloudinary-react';
import axios from 'axios';
import '../../css/GoodManager.css';
import { withStyles } from '@material-ui/styles';

var productTypes =[
    'food', 'detergent', 'cuisine'
];

var typeSet = [];

const StyledTextField = withStyles((theme) => ({
    root: {
      "& .MuiInputBase-root": {
        height: 36,
        "& input": {
          textAlign: "right",
          marginLeft: '4px',
        }
      }
    }
  }))(TextField);

var listDayInWeek = [
    {ID:'T2',name:'Thứ hai'}, 
    {ID:'T3',name:'Thứ ba'}, 
    {ID:'T4',name:'Thứ tư'}, 
    {ID:'T5',name:'Thứ năm'}, 
    {ID:'T6',name:'Thứ sáu'}, 
    {ID:'T7',name:'Thứ bảy'}, 
    {ID:'CN',name:'Chủ nhật'}
];

class UpdateTimeKeepingModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            change: false,
            timeKeepingID: '',
            dayChosed: '',
            shiftID: '',
        };
        this.loadInitialData()
    }

    // Thêm nhân viên
    async addEmployeeToDatabase()
    {
        const data = {
            token: localStorage.getItem('token'),
            employee: {
                _id: {
                    employeeID: document.querySelector('input[name="ID"]').value,
                    storeID: this.props.infoUser.email,
                },
                managerID: this.props.infoUser.email,
                password: document.querySelector('input[name="password"]').value,
                firstName: document.querySelector('input[name="firstName"]').value,
                lastName: document.querySelector('input[name="lastName"]').value,
                phoneNumber: document.querySelector('input[name="phoneNumber"]').value,
                dateOfBirth: document.querySelector('input[name="birthDay"]').value,
                email: document.querySelector('input[name="email"]').value,
                address: document.querySelector('input[name="adress"]').value,
                cardID: document.querySelector('input[name="cardID"]').value,
                startDate: document.querySelector('input[name="startDate"]').value,
                // endDate: "2021-11-31T00:00:00.000Z",
            }   
        }
        console.log(data);
        await axios.post(`http://localhost:5000/api/employee`, data)
            .then(res => {
                console.log("Save success");
                alert("Lưu thành công")
            })
            .catch(err => {
                alert(err);
                console.log(err);
            })
    }

    // cancel = () => {
    //     this.props.changeAddNextWeekTimeKeepingStatus();
    // }

    // addEmployee = () => {
    //     this.addEmployeeToDatabase();
    //     this.props.changeAddEmployeeStatus();
    // }
    realDate = '';
    shiftID = '';
    dayChosed = '';
    timeKeepingID = '';
    loadInitialData()
    {
        console.log(this.props.updateTimeKeepingValue.state);
        this.realDate = this.props.updateTimeKeepingValue.state.realDate;
        this.shiftID = this.props.updateTimeKeepingValue.state._id.shiftType._id.shiftID;
        this.timeKeepingID = this.props.updateTimeKeepingValue.state._id.employee._id.employeeID;
        this.dayChosed= this.props.updateTimeKeepingValue.state._id.dateInWeek;
        this.setState({
            shiftID : this.props.updateTimeKeepingValue.state._id.shiftType._id.shiftID,
            dayChosed: this.props.updateTimeKeepingValue.state._id.dateInWeek,
            timeKeepingID: this.props.updateTimeKeepingValue.state._id.employee._id.employeeID,
        });
    }

    findIndexCurrentKeepingInRedux(id)
    {
        //Đụng đến nếu sửa bảng
        var listToSearch = this.props.listTimeKeeper;
        for(var i = 0 ; i < listToSearch.length ; i ++)
        {
            if(listToSearch[i]._id.dateInWeek == id.dateInWeek && 
                listToSearch[i]._id.shiftType._id.shiftID == id.shiftType._id.shiftID&& 
                listToSearch[i]._id.employee._id.employeeID == id.employee._id.employeeID)
            {
                return i;
            }
        }
        return -1;
    }

    getCurrentDateTime()
    {
        var currentDate = new Date();
        var day = (currentDate.toString().split(' '))[2];
        if(day.length < 2)
        {
            day = '0' + day;
        }
        var month = (new Date().getMonth() + 1).toString();
        if(month.length<2)
        {
            month = '0' + month;
        }
        return new Date().getFullYear() + '-' + month + '-' + day;
    }

    checkContraint() {
        if(this.dayChosed.length == 0)
        {
            alert("Chưa chọn ngày nào trong tuần");
            return false;
        }
        if(this.shiftID.length == 0)
        {
            alert("Chưa chọn ca nào");
            return false;
        }
        // console.log(this.state.timeKeepingID );
        if( this.timeKeepingID == undefined || this.timeKeepingID.length == 0)
        {
            alert("Chưa chọn nhân viên nào để chấm công"); 
            return false;
        }
        // Có CSDL thì báo xem có trùng với cái cũ ko nữa
        
        alert("Đã check hết constraint");
        return true;
    }


    UpdateChange() {
        if(this.checkContraint()==false) return;
        const data = {
            _id: {
                dateInWeek: this.dayChosed,
                storeID: this.props.infoUser.email,
                shiftType: {
                    _id: {
                        shiftID: this.shiftID,
                        storeID: this.props.infoUser.email,
                    },
                },
                employee: {
                    _id: {
                        employeeID: this.timeKeepingID,
                        storeID: this.props.infoUser.email,
                    },
                },
            },
            realDate: document.querySelector('input[name="realDate"]').value,
        };
        // axios.put(`http://localhost:5000/api/????`, data)
        //     .then(res => {
        //         console.log("Update success");
        //         alert('Đã update thành công sản phẩm')
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        this.props.updateTimeKeeper(data, this.findIndexCurrentKeepingInRedux(data._id));
        console.log(data);
        this.props.changeUpdateTimeKeepingStatus();
    }

    render() {
        return (
            <form style={{ zIndex: '10', width: '60%', justifyContent: 'center', marginTop: '80px'}} autoComplete="off" noValidate>
                <Card>
                    <CardHeader style={{ color: 'blue', backgroundColor: '#efeeef' , textAlign: 'center'}} 
                    title="Update TimeKeeper" />
                        <div 
                        style={{ 
                            width: '100%', backgroundColor: 'rgb(221,235,255)'   
                        }}
                    >   
                    <Grid className="import-container" container >
                        <Grid item md={12}>

                            <Card>
                                
                                <Grid container md={12}>
                                    <Grid item md={6} 
                                        className='input-item'
                                    >
                                        <div 
                                            className="input-label"
                                            style={{
                                                width: '116px'
                                            }}
                                        >
                                            Real Date
                                        </div>
                                        <StyledTextField
                                            classname='input-box' 
                                            type="date" 
                                            name='realDate'
                                            readOnly={true}
                                            style = {{width: '70%'}} 
                                            fullWidth 
                                            size="small" 
                                            variant="outlined"
                                            defaultValue={this.realDate}
                                        />
                                    </Grid>
                                    <Grid item md={6} 
                                        className='input-item'
                                    >
                                        <div className="input-label" style={{width: '220px'}}>
                                            Choose Day in week
                                        </div>
                                        <FormControl sx={{ minWidth: 120 }}>
                                            {/* <InputLabel id="select-filled-label">Type</InputLabel> */}
                                            <Select
                                                readOnly={true}
                                                value = {this.dayChosed}
                                                onChange={(event) => {
                                                    this.dayChosed = event.target.value;
                                                    this.setState({dayChosed: event.target.value});
                                                    // if(!typeSet.includes(event.target.value))
                                                    // {
                                                    //     typeSet.push(event.target.value);
                                                    // }
                                                    // this.setState({change: !this.state.change})
                                                }}
                                                style={{
                                                    height: 36,
                                                }}
                                            >
                                                {
                                                    listDayInWeek.map((item) =>
                                                        <MenuItem value={item.ID}>
                                                            {item.name}
                                                        </MenuItem>
                                                    )
                                                }   
                                            </Select> 
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={8} 
                                        className='input-item'
                                    >
                                        <div className="input-label" style={{width: '114px'}}>
                                            Choose Shift
                                        </div>
                                        <FormControl sx={{ minWidth: 220 }}>
                                            {/* <InputLabel id="select-filled-label">Type</InputLabel> */}
                                            <Select
                                                readOnly={true}
                                                value={this.shiftID}
                                                onChange={(event) => {
                                                    this.shiftID = event.target.value;
                                                    this.setState({shiftID: event.target.value});
                                                    // if(!typeSet.includes(event.target.value))
                                                    // {
                                                    //     typeSet.push(event.target.value);
                                                    // }
                                                    // this.setState({change: !this.state.change})
                                                }}
                                                style={{
                                                    height: 36,
                                                }}
                                            >
                                                {
                                                    this.props.listShift.length== 0 ? <MenuItem value={'none'}>None</MenuItem>
                                                    : this.props.listShift.map((shift) =>
                                                        <MenuItem value={shift._id.shiftID}>
                                                            {shift.name + ' (' + shift.timeFrom + ' - ' + shift.timeEnd + ')'}
                                                        </MenuItem>
                                                    )
                                                }   
                                            </Select> 
                                        </FormControl>

                                    </Grid>
                                    <Grid item md={12} 
                                        className='input-item'
                                    >
                                        <div className="input-label" style={{width: '220px'}}>
                                            TimeKeeping Employee
                                        </div>
                                        <FormControl sx={{ minWidth: 320 }}>
                                            {/* <InputLabel id="select-filled-label">Type</InputLabel> */}
                                            <Select
                                                readOnly={true}
                                                value={this.timeKeepingID}
                                                onChange={(event) => {
                                                    this.timeKeepingID = event.target.value;
                                                    this.setState({timeKeepingID: event.target.value});
                                                    // if(!typeSet.includes(event.target.value))
                                                    // {
                                                    //     typeSet.push(event.target.value);
                                                    // }
                                                    // this.setState({change: !this.state.change})
                                                }}
                                                style={{
                                                    height: 36,
                                                }}
                                            >
                                                {
                                                    this.props.listEmployee.employees.map((item) =>
                                                        !(this.state.alterID == item._id.employeeID) ?
                                                        <MenuItem value={item._id.employeeID}>
                                                            {item._id.employeeID + ' - ' + item.firstName + ' ' + item.lastName}
                                                        </MenuItem>
                                                        : null
                                                    )
                                                }   
                                            </Select> 
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={9}></Grid>
                                    <Grid item md={3}
                                        className='input-item'
                                    >
                                        <Button variant="contained" onClick={() => this.UpdateChange()}>
                                            Update Change
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item sm={12} md={12} >
                            
                        </Grid>
                    </Grid> 
                </div>
                </Card>
            </form>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        listTimeKeeper: state.listTimeKeeping,
        addEmployeeStatus: state.addEmployeeStatus,
        confirmStatus: state.confirmStatus,
        infoUser: state.infoUser,
        listShift: state.listShift,
        listEmployee: state.listEmployee,
        nextWeekTimeKeeping: state.nextWeekTimeKeeping,
        updateTimeKeepingValue: state.updateTimeKeepingValue,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeUpdateTimeKeepingStatus: () => {
            dispatch({
                type: "CHANGE_UPDATE_TIMEKEEPING_STATUS",
            });
        },
        getEmployee: (data) => {
            dispatch({
                type: "GET_EMPLOYEE",
                employees: data,
            });
        },
        addNewTimeKeeper: (data) => {
            dispatch({
                type: "ADD_NEW_TIME_KEEPER",
                data: data,
            });
        }, 
        updateTimeKeeper: (data, indexOfVal) => {
            dispatch({
                type: "UPDATE_TIMEKEEPER",
                data: data,
                index: indexOfVal
            });
        }, 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTimeKeepingModal);

               