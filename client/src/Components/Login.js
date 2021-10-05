import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    NavLink
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Login.css';
import { BsFillEnvelopeFill, BsLockFill } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import Avatar from '@mui/material/Avatar'
import { IconContext } from "react-icons";
import { GoogleLogin } from 'react-google-login';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: "543752153590340",
            clientId: "826925109796-mi95l41fi57bdlolpvnfdg5bpt9oc81h.apps.googleusercontent.com",
            email: "",
            password: "",
        }
    }

    // Hash password
    hash = (pass) => {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(pass, 12)
        // verified so sánh 
        var verified = bcrypt.compareSync("lngthinphc", hash);
        return hash;
    }


    // Login with google
    onLoginSuccess = (res) => {
        const form = document.getElementById('login-form');
        const mail = document.getElementById('email');
        const password = document.getElementById('password');
        password.value = '';
        mail.value = res.profileObj.googleId;
        form.submit();
    }

    onFailureSuccess = (res) => {
        console.log("login faild", res);
    }


    // Check để thay đổi trạng thái đã login hay chưa
    isLoginCheck = (e) => {
        if (this.blurEmail() && this.blurPassword()) {
            console.log("abc");
            const form = document.getElementById('login-form');
            const password = document.getElementById('password');
            password.value = this.state.password;
            form.submit();
            this.props.changeLoginStatus();
        }
    }


    // Handle user : blur , change in input
    blurEmail = () => {
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const event = document.querySelector('#email');
        const elementValue = event.value;
        const formGroup = event.parentElement.parentElement;
        this.setState({
            email: elementValue,
        })
        if (elementValue === "") {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Please enter this field";
            return false;
        } else if (!regex.test(elementValue)) {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Email is not in the correct format";
            return false;
        } else {
            formGroup.classList.remove('invalid');
            formGroup.querySelector('.form-message').innerText = "";
            return true;
        }
    }


    blurPassword = () => {
        const e = document.getElementById('password');
        const elementValue = e.value;
        const formGroup = e.parentElement.parentElement;
        this.setState({
            password: this.hash(elementValue),
        })
        if (elementValue === "") {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Please enter this field"
            return false;
        } else if (e.value.length < 6) {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Enter at least 6 characters";
            return false;
        } else {
            formGroup.classList.remove('invalid');
            formGroup.querySelector('.form-message').innerText = "";
            return true;
        }
    }

    changeInput = (e) => {
        const formGroup = e.target.parentElement.parentElement;
        formGroup.classList.remove('invalid');
        formGroup.querySelector('.form-message').innerText = "";
    }


    render() {
        const enterPress = this.isLoginCheck;
        document.onkeydown = function(e){
            switch (e.which) {
                case 13:
                    enterPress(e);
                    break;
                default:
                    break;
            }
        }
        return (
            <div className="Login">
                <div className="form-login">
                    <div className="auth-form">
                        <Avatar className="auth-form__avatar">
                            <IconContext.Provider value={{ color: "blue", size: "3em", className: "global-class-name" }}>
                                <BiUser></BiUser>
                            </IconContext.Provider>
                        </Avatar>
                        <div className="auth-form__container">
                            <div className="auth-form__header">
                                <div className="auth-form__heading">Login</div>
                                <NavLink to="/register" className="auth-form__switch-btn">Register <FiChevronRight className="auth-form__arrow-return"></FiChevronRight></NavLink>
                            </div>
                        </div>
                        <div className="auth-form__body">
                            <form action="/login-submit" method="POST" id="login-form">
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-custom">
                                        <span><BsFillEnvelopeFill className="input-custom-icon" /></span>
                                        <input className="form-control" onChange={(e) => this.changeInput(e)} onBlur={() => this.blurEmail()} name="email" rules="required|email" id="email" placeholder="VD: abc@gmail.com" type="text" />
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-custom">
                                        <span>
                                            <BsLockFill className="input-custom-icon" ></BsLockFill>
                                        </span>
                                        <input className="form-control" onChange={(e) => this.changeInput(e)} onBlur={(e) => this.blurPassword(e)} name="password" rules="required|min:6" id="password" placeholder="Emter password" type="password" />
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="auth-form__support">
                                    <span className="auth-form__support-forget">
                                        <NavLink onclick="" to="/forgot" className="auth-form__switch-btn">Forgot password</NavLink>
                                    </span>
                                    <span className="auth-form__help-separate" />
                                    <span className="auth-form__support-need-support">Need help?</span>
                                </div>
                                <div className="auth-form__support">
                                    <GoogleLogin
                                        className="auth-form__support-google"
                                        clientId={this.state.clientId}
                                        buttonText="Login with Google"
                                        onSuccess={this.onLoginSuccess}
                                        onFailure={this.onFailureSuccess}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                </div>
                                <div className="auth-form__btn">
                                    <NavLink to="/home" id="navlink" onClick={(e) => this.isLoginCheck(e)} className="auth-form__btn-log-in auth-form__switch-btn">Sign In</NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLogin: state.loginStatus,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeLoginStatus: () => {
            dispatch({
                type: "CHANGE_LOGIN_STATUS",
            });
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);