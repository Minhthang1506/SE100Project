import {connect} from 'react-redux';
import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/styles';
// material
import { TableCell, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import '../../css/EmployeeManager.css';

//icon
import { IoIosAdd,} from "react-icons/io";
import {  AiFillCloseCircle} from "react-icons/ai";
// ----------------------------------------------------------------------
const styles = theme =>  ({
    goodTable_Cell: {                                     
        borderWidth: '1px',
        borderColor: '#ccc',
        borderStyle: 'solid',
        height: '80px',
    } 
})

class FixedCalendarCell extends Component {
  isOpen=false;

  constructor(props) {
    super(props);
    this.state= {
      change: false
    }
  }

 

  handleChange() {
    this.isOpen = !this.isOpen;
    this.setState({change : !this.state.change})
  }

  getEmployeeNameByID(employeeID)
  {
      for(var i = 0 ; i < this.props.listEmployee.employees.length; i++)
      {
          var currentEmployee = this.props.listEmployee.employees[i];
          if(currentEmployee._id.employeeID==employeeID)
          {
            return currentEmployee.firstName;
          }
      }
      return "Can't get name";
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

  async addThisShiftAssign(employeeID)
  {
      const data = {
          token: localStorage.getItem('token'),
          shiftAssign: {
            _id: {
              dateInWeek: "Monday",
              storeID: this.props.infoUser.email,
              shiftType: {
                  _id: {
                      shiftID: this.props.shiftID,
                      storeID: this.props.infoUser.email,
                  },
              },
              employee: {
                  _id: {
                      employeeID: employeeID,
                      storeID: this.props.infoUser.email,
                  },
              },
            },
          }
          
      }
      await axios.post(`http://localhost:5000/api/employee/shift-assign`, data)
        .then(res => {
            alert("Lưu thành công")
        })
        .catch(err => {
            alert(err);
            console.log(err);
        })
      this.handleChange();
      this.props.AddShiftAssign(data.shiftAssign);
  }

  removeShift(employeeID)
  {
    const data1 = {
        token: localStorage.getItem('token'),
        shiftAssign: {
          _id: {
            dateInWeek: this.props.dayIndex,
            storeID: this.props.infoUser.email,
            shiftType: {
                _id: {
                    shiftID: this.props.shiftID,
                    storeID: this.props.infoUser.email,
                },
            },
            employee: {
                _id: {
                    employeeID: employeeID,
                    storeID: this.props.infoUser.email,
                },
            },
          }
      },
    }
      axios.delete(`http://localhost:5000/api/employee/shift-assign`,{data: data1})
      .then(res => {
          alert("success");
      })
      .catch(err => {
          alert(err);
      })
      const data = {
          _id: {
            dateInWeek: this.props.dayIndex,
            storeID: this.props.infoUser.email,
            shiftType: {
                _id: {
                    shiftID: this.props.shiftID,
                    storeID: this.props.infoUser.email,
                },
            },
            employee: {
                _id: {
                    employeeID: employeeID,
                    storeID: this.props.infoUser.email,
                },
            },
        },
      }
      
      console.log("data", data);
      this.props.RemoveShiftAssign(data);
      
  }

  findShiftInShiftAssign()
  {
      var listShiftAssign = this.props.listShiftAssign;
      for(var i = 0 ; i < listShiftAssign.length ; i++)
      {
          if(this.props.shiftID == listShiftAssign[i]._id.shiftType._id.shiftID && 
            this.props.dayIndex == listShiftAssign[i]._id.dateInWeek)
            { 
                return true;
            }
      }
      return false;
  }

  render() {
    const { classes } = this.props;
    return (
        <TableCell 
            className={classes.goodTable_Cell} 
            style={{
                position: 'relative',
                backgroundColor: !this.findShiftInShiftAssign() ?'#ff6057': '#b3cde0',
                height: '80px',
            }}
            // ref={this.myRef}    
        >
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    width: 22,
                    height: 22,
                    textAlign: 'center'
                }}
                className='add-employee-to-shift-button'
            >
                <IoIosAdd 
                    size={30}
                    style={{
                        position: 'absolute',
                        right: -4,
                        top: -3,
                    }}
                    color='#0096FF'
                    onClick={() => this.handleChange()}
                >    
                </IoIosAdd>
                
            </div>
            {
              this.props.listShiftAssign.map((item) => 
                (
                  ( this.props.shiftID == item._id.shiftType._id.shiftID && this.props.dayIndex == item._id.dateInWeek )
                  ? <div style={{
                            backgroundColor: "#fff", 
                            padding: 10, 
                            maxWidth: 100,
                            position: 'relative',
                            marginBottom: 4
                            }}
                    >
                      <span>
                          {item._id.employee._id.employeeID + ' - ' 
                          + this.getEmployeeNameByID(item._id.employee._id.employeeID)}
                      </span>
                      <AiFillCloseCircle
                          style={{
                            color: 'red',
                            position: 'absolute',
                            right: 0, 
                            top: 0,
                          }} 
                          size={20}
                          onClick={() => this.removeShift(item._id.employee._id.employeeID)}
                      ></AiFillCloseCircle>
                    </div>
                  : null
                )
                
              )
            }
            {
              this.isOpen 
              ? 
              <List 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 20,
                  zIndex: 10,
                  maxHeight: 100,
                  overflowY: 'auto',
                  width: 140,
                  backgroundColor: '#fff',
                }}
              >
                {
                  this.props.listEmployee.employees.map((item) =>
                    <ListItem disablePadding height={30} onClick={() => this.addThisShiftAssign(item._id.employeeID)}>
                        <ListItemButton>
                            <ListItemText>
                                {item._id.employeeID + ' - ' + item.firstName}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                  )
                }
              </List>
              : null
            }

        </TableCell>
    );
  }
  
}
const mapStateToProps = (state, ownProps) => {
  return {
      listEmployee: state.listEmployee,
      listShiftAssign: state.listShiftAssign,
      infoUser: state.infoUser,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    AddShiftAssign: (data) => {
      dispatch({
          type: "ADD_NEW_SHIFT_ASSIGN",
          data: data,
      });
    },
    RemoveShiftAssign: (data) => {
      dispatch({
          type: "DELETE_SHIFT_ASSIGN",
          data: data,
      });
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles, {withTheme: true}))(FixedCalendarCell));