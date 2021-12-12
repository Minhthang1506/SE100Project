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
    {ID:'Monday',name:'Monday'}, 
    {ID:'Tuesday',name:'Tuesday'}, 
    {ID:'Wednesday',name:'Wednesday'}, 
    {ID:'Thursday',name:'Thursday'}, 
    {ID:'Friday',name:'Friday'}, 
    {ID:'Saturday',name:'Saturday'}, 
    {ID:'Sunday',name:'Sunday'}
];

class UpdateNextWeekTimeKeepingModal extends Component {

    genID = 0;

    constructor(props) {
        super(props);
        
        this.state = {
            change: false,
            withdrawID: '',
            alterID: '',
            dayChosed: '',
            shiftID: '',
        };
        this.loadInitialData();
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

    isGreater(dateString1, dateString2){
        return (new Date(dateString1).getTime() - new Date(dateString2).getTime()) > 0;
    }

    calculateDay(dateString1, dateString2)
    {
        return (
            (new Date(dateString1)).setHours(0, 0, 0) 
                - 
            (new Date(dateString2)).setHours(0,0,0)
            )
            /(1000 * 60 * 60 * 24);
    }

    checkContraint() {
        if(!this.isGreater(document.querySelector('input[name="realDate"]').value, this.getCurrentDateTime() ))
        {
            this.props.hideAlert();
			this.props.showAlert("The input day must be greater than today","warning"); 
            return false;
        }
        // Check thử ngày nhập nhỏ hơn ngày báo nghỉ bn ngày
        if(this.props.regulation != {})
        {
            if(this.calculateDay(document.querySelector('input[name="realDate"]').value, this.getCurrentDateTime() ) < 
            this.props.regulation.lessChangeTimeKeepingDay)
            {
                console.log("Tính ngày",this.calculateDay(document.querySelector('input[name="realDate"]').value, this.getCurrentDateTime()));
                this.props.hideAlert();
			    this.props.showAlert("The input day must be greater than today at least "+ this.props.regulation.lessChangeTimeKeepingDay+" day(s)","warning");
                return false;
            }
        }
        return true;
    }
    async updateChange() {
        if(this.checkContraint() == false) return;
        // Xoá cái hiện tại đi cái đã
        const data = {
            token: localStorage.getItem('token'),   
            offDay: {
                _id: this.props.updateNextWeekTimeKeepingValue._id
            }
        }

        await axios.delete(`http://localhost:5000/api/employee/off-day`,{data: data})
          .then(res => {
          })
          .catch(err => {
            this.props.hideAlert();
            this.props.showAlert("Something happened, restart and try again","warning");
          })
        this.props.deleteNextWeekTimeKeeping(this.props.updateNextWeekTimeKeepingValue);
        console.log("Xoá được rồi");
        const dataUpdate = {
            token: localStorage.getItem('token'),
            offDay: {
                _id: {
                    dateInWeek: this.currentdayChosed,
                    storeID: this.props.infoUser.email,
                    shiftType: {
                        _id: {
                            shiftID: this.currentShipChosed,
                            storeID: this.props.infoUser.email,
                        },
                    },
                    employee: {
                        _id: {
                            employeeID: this.currentWidrawID,
                            storeID: this.props.infoUser.email,
                        },
                    },
                    realDate: document.querySelector('input[name="realDate"]').value,
                },
                alternativeEmployee: {
                    _id: {
                        employeeID: this.currentAlterID,
                        storeID: this.props.infoUser.email,
                    },
                },
            }    
        };
        console.log("dataUpdate", dataUpdate);
        await axios.post(`http://localhost:5000/api/employee/off-day`, dataUpdate)
          .then(res => {
                console.log("Save success");
                this.props.hideAlert();
				this.props.showAlert("Update absent day success","success");
                this.props.addNewChange(dataUpdate.offDay);
                console.log("nextweek", this.props.nextWeekTimeKeeping);
        })
        .catch(err => {
            this.props.hideAlert();
			this.props.showAlert(err.response.data.message,"warning");
            console.log(err);
            if(err.response.data.message)
            {
                this.props.hideAlert();
				this.props.showAlert(err.response.data.message,"warning");
            }
            // Nếu lỗi thì thêm lại
            this.props.addNewChange(this.props.updateNextWeekTimeKeepingValue);
            axios.post(`http://localhost:5000/api/employee/off-day`, {
                token: localStorage.getItem('token'),
                offDay: this.props.updateNextWeekTimeKeepingValue,
            })
            .then(res => {
                    this.props.hideAlert();
				    this.props.showAlert("Add current absent day success","success"); 
                })
                .catch(err => {
                    if(err.response.data.message)
                    {
                        this.props.hideAlert();
				        this.props.showAlert(err.response.data.message,"warning");
                    }
                    else {
                        this.props.hideAlert();
				        this.props.showAlert("Something happened, restart and try again","warning");
                    }
                });
        })
        // var indexOfData = this.findIndexCurrentNextTimeKeepingInRedux(data._id)
        // this.props.changeUpdateNextWeekTimeKeeping(data, indexOfData);

        this.props.changeUpdateNextWeekTimeKeepingStatus();
    }

    findIndexCurrentNextTimeKeepingInRedux(id)
    {
        //Đụng đến nếu sửa bảng
        var listToSearch = this.props.nextWeekTimeKeeping;
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

    realDate = '';
    currentdayChosed = '';
    currentShipChosed = '';
    currentWidrawID = '';
    loadInitialData() {
        var val = this.props.updateNextWeekTimeKeepingValue;
        this.realDate = val._id.realDate;
        if(this.realDate.indexOf('T')!=-1) this.realDate = this.realDate.substring(0, this.realDate.indexOf('T'));
        this.currentdayChosed = val._id.dateInWeek;
        this.currentShipChosed = val._id.shiftType._id.shiftID;
        this.currentWidrawID = val._id.employee._id.employeeID;
        this.currentAlterID = val.alternativeEmployee._id.employeeID;
        this.setState({
            change : !this.state.change,
            shiftID: this.currentShipChosed,
            dayChosed: this.currentdayChosed,
            withdrawID: this.currentWidrawID,
            alterID: this.currentAlterID,
        });
    }

    getDayInWeek(date) {
        const d = new Date(date);
    
        const weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
    
        return weekday[d.getDay()];
    }
    render() {
        return (
            <form style={{ zIndex: '10', width: '60%', justifyContent: 'center', marginTop: '80px'}} autoComplete="off" noValidate>
                <Card>
                    <CardHeader style={{ color: !this.props.statusDarkmode? '#0091ea' :'white', backgroundColor: !this.props.statusDarkmode? '#efeeef' :'#455a64'}} 
                    title="Update Offday" />
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
                                            style = {{width: '70%'}} 
                                            fullWidth 
                                            size="small" 
                                            variant="outlined"
                                            defaultValue={this.realDate}
                                            onChange={(event) => {
                                                console.log("new Date",event.target.value)
                                                this.currentdayChosed = this.getDayInWeek(event.target.value);
                                                this.setState({dayChosed: this.getDayInWeek(event.target.value)});
                                            }}
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
                                                value={this.currentdayChosed}
                                                onChange={(event) => {
                                                    this.currentdayChosed = event.target.value;
                                                    this.setState({dayChosed: event.target.value});
                                                }}
                                                readOnly = {true}
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
                                                value={this.currentShipChosed}
                                                onChange={(event) => {
                                                    this.currentShipChosed = event.target.value;
                                                    this.setState({shiftID: event.target.value});
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
                                            Widraw Employee
                                        </div>
                                        <FormControl sx={{ minWidth: 320 }}>
                                            {/* <InputLabel id="select-filled-label">Type</InputLabel> */}
                                            <Select
                                                value={this.currentWidrawID}
                                                onChange={(event) => {
                                                    this.currentWidrawID = event.target.value;
                                                    this.setState({withdrawID: event.target.value});
                                                }}
                                                style={{
                                                    height: 36,
                                                }}
                                            >
                                                {
                                                    this.props.listEmployee.employees.map((item) =>
                                                        <MenuItem value={item._id.employeeID}>
                                                            {item._id.employeeID + ' - ' + item.firstName + ' ' + item.lastName}
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
                                            Alter Employee
                                        </div>
                                        <FormControl sx={{ minWidth: 320 }}>
                                            {/* <InputLabel id="select-filled-label">Type</InputLabel> */}
                                            <Select
                                                value={this.currentAlterID}
                                                onChange={(event) => {
                                                    this.currentAlterID = event.target.value;
                                                    this.setState({alterID: event.target.value});
                                                }}
                                                style={{
                                                    height: 36,
                                                }}
                                            >
                                                {
                                                    this.props.listEmployee.employees.map((item) =>
                                                        !(this.currentWidrawID == item._id.employeeID) ?
                                                        <MenuItem value={item._id.employeeID}>
                                                            {item._id.employeeID + ' - ' + item.firstName + ' ' + item.lastName}
                                                        </MenuItem>
                                                        : null
                                                    )
                                                }   
                                            </Select> 
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Divider></Divider>
                                    </Grid>
                                    
                                    <Grid item md={12}
                                        className='input-item'
                                        style={{display: 'flex', justifyContent: 'space-evenly'}}
                                    >
                                        <Button variant="contained" style={{backgroundColor: 'red'}} onClick={() => this.props.changeUpdateNextWeekTimeKeepingStatus()}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" onClick={() => this.updateChange()}>
                                            Add Change
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
        addEmployeeStatus: state.addEmployeeStatus,
        confirmStatus: state.confirmStatus,
        infoUser: state.infoUser,
        listShift: state.listShift,
        listEmployee: state.listEmployee,
        nextWeekTimeKeeping: state.nextWeekTimeKeeping,
        updateNextWeekTimeKeepingValue: state.updateNextWeekTimeKeepingValue,
        regulation: state.regulationReducer,
        statusDarkmode: state.statusDarkmode,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeUpdateNextWeekTimeKeepingStatus: () => {
            dispatch({
                type: "CHANGE_UPDATE_NEXTWEEK_TIMEKEEPING_STATUS",
            });
        },
        getEmployee: (data) => {
            dispatch({
                type: "GET_EMPLOYEE",
                employees: data,
            });
        },
        addNewChange: (data) => {
            dispatch({
                type: "ADD_NEW_NEXT_WEEK_TIMEKEEPER",
                data: data,
            });
        },
        
        changeUpdateNextWeekTimeKeeping: (data, indexOfData) => {
            dispatch({
                type: "UPDATE_NEXT_WEEK_TIMEKEEPER",
                data: data,
                index: indexOfData,
            });
        },
        deleteNextWeekTimeKeeping: (data) => {
            dispatch({
              type: "DELETE_NEXT_WEEK_TIMEKEEPER",
              data: data
            });
            console.log("data", data)
          },
          showAlert: (message, typeMessage) => {
            dispatch({
                type: "SHOW_ALERT",
                message: message,
                typeMessage: typeMessage,
            })
        },
        hideAlert: () => {
            dispatch({
                type: "HIDE_ALERT",
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateNextWeekTimeKeepingModal);

               