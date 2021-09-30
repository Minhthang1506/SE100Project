import React, { Component } from 'react';
import '../CSS/Login.css'
import {
    Link,
    NavLink
} from "react-router-dom";
import { connect } from 'react-redux';
import { BsFillEnvelopeFill, BsLockFill } from "react-icons/bs";
import { FaPhoneSquare } from "react-icons/fa";

class Register extends Component {
    render() {
        return (
            <div className="Login">
                <div className="form-login">
                    <div className="auth-form">
                        <div className="auth-form__container">
                            <div className="auth-form__header">
                                <div className="auth-form__heading">Register</div>
                                <NavLink onclick="" to="/login" className="auth-form__switch-btn">Login</NavLink>
                            </div>
                        </div>
                        <div className="auth-form__body">
                            <form action="/home" method="post" id="login-form">
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-custom">
                                        <span><BsFillEnvelopeFill className="input-custom-icon" /></span>
                                        <input className="form-control" onblur="" name="email" rules="required|email" id="email" placeholder="VD: abc@gmail.com" type="text" />
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-custom">
                                        <span>
                                            <BsLockFill className="input-custom-icon" ></BsLockFill>
                                        </span>
                                        <input className="form-control" onblur="" name="password" rules="required|min:6" id="password" placeholder="Emter password" type="password" />
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="re-password" className="form-label">Password</label>
                                    <div className="input-custom">
                                        <span>
                                            <BsLockFill className="input-custom-icon" ></BsLockFill>
                                        </span>
                                        <input className="form-control" onblur="" name="re-password" rules="required|min:6" id="re-password" placeholder="Emter re-password" type="password" />
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Tel</label>
                                    <div className="input-custom">
                                        <span>
                                            <FaPhoneSquare className="input-custom-icon" ></FaPhoneSquare>
                                        </span>
                                        <input className="form-control" onblur="" name="tel" rules="required" id="tel" placeholder="Ex: 0303030303" type="tel" />

                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="auth-form__btn">
                                    <NavLink to="/home" className="auth-form__btn-log-in auth-form__switch-btn">Sign Up</NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);