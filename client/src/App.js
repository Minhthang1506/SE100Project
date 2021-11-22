import React, { Component } from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import DirectionURL from './Router/DirectionURL';
import './css/App.css'
import { connect } from 'react-redux'
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { FiChevronRight, FiXSquare } from "react-icons/fi";

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    if (localStorage.getItem('token') && localStorage.getItem('token') !== "") {
      axios.post(`http://localhost:5000/refresh`, {
        token: localStorage.getItem('token'),
      })
        .then(res => {
          console.log("Thành công");
          console.log(res);
          if (res.status === 200) {
            if (res.data.data.isEmployee === false) {
              this.props.setRole()
              localStorage.setItem('token', res.data.token);
              this.props.updateProfile(res.data.data);
              this.props.updateRecieptUser(res.data.data.receipts)
              this.props.updateAvatar(res.data.data.manager.imgUrl ? res.data.data.manager.imgUrl : "https://res.cloudinary.com/databaseimg/image/upload/v1634091995/sample.jpg");
              this.props.updateShiftTypes(res.data.data.shiftTypes)
              this.props.changeLoginStatus();
              this.props.getEmployee(res.data.data.employees);
              // Phi
              this.props.getTimeKeeping(res.data.data.timeKeeping);
            } else {
              this.props.setRoleEmployee()
              localStorage.setItem('token', res.data.token);
              this.props.updateProfileEployee(res.data.data.employee[0], res.data.data.manager[0], res.data.data.store[0].storeName);
              this.props.updateAvatar(res.data.data.employee[0].imgUrl ? res.data.data.employee[0].imgUrl : "https://res.cloudinary.com/databaseimg/image/upload/v1634091995/sample.jpg");
              this.props.updateRecieptUser(res.data.data.receipts);
              this.props.changeLoginStatus();
              this.props.showAlert(res.data.message, "success");
            }

          }
        })
        .catch(err => {
          console.log("thất bại");
          console.log(err)
        })
    }
  }

  autoHideAlert = () => {
    setTimeout(() => this.props.hideAlert(), 4000);
  }

  render() {
    return (
      <Router>
        <DirectionURL></DirectionURL>
        {this.props.alertReducer.status ? this.autoHideAlert() : null}
        {this.props.alertReducer.status ? <Alert style={{ cursor: 'pointer' }} onClick={() => this.props.hideAlert()} className="message-error" severity={this.props.alertReducer.typeMessage}>{this.props.alertReducer.message} — check it out! <FiXSquare></FiXSquare></Alert> : null}
      </Router>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLogin: state.loginStatus,
    alertReducer: state.alert,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeLoginStatus: () => {
      dispatch({
        type: "CHANGE_LOGIN_STATUS",
      });
    },
    updateProvince: (data) => {
      dispatch({
        type: "UPDATE_DATA",
        data: data,
      })
    },
    updateRecieptUser: (data) => {
      dispatch({
        type: "UPDATE_RECIEPT_USER",
        listReciept: data,
      })
    },
    updateProfile: (data) => {
      dispatch({
        type: "UPDATA_DATA_USER",
        data: data,
      })
    },
    updateAvatar: (avatar) => {
      dispatch({
        type: "UPDATE_AVATAR",
        avatar: avatar,
      })
    },
    updateShiftTypes: (shiftTypes) => {
      dispatch({
        type: "UPDATE_DATA_SHIFT_USER",
        shiftTypes: shiftTypes,
      })
    },
    hideAlert: () => {
      dispatch({
        type: "HIDE_ALERT",
      })
    },
    getEmployee: (data) => {
      dispatch({
        type: "GET_EMPLOYEE",
        employees: data,
      });
    },
    setRole: () => {
      dispatch({
        type: "ADMIN_ROLE"
      });
    },
    updateProfileEployee: (data, data1, storeName) => {
      dispatch({
        type: "UPDATA_DATA_EMPLOYEE",
        data: data,
        data1: data1,
        storeName: storeName,
      })
    },
    setRoleEmployee: () => {
      dispatch({
        type: "EMPLOYEE_ROLE",
      });
    },
    getTimeKeeping: (data) => {
      dispatch({
        type: "GET_TIMEKEEPER",
        data: data
      });  
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

