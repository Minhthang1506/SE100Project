import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Link,
    NavLink
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Login.css';


class Login extends Component {
    hash = () => {
        var bcrypt = require('bcryptjs');
        var pass = "lngthinphc"
        var hash = bcrypt.hashSync(pass, 12)
        var verified = bcrypt.compareSync("lngthinphc", hash);
        return hash + verified;
    }

    render() {
        return (
            <div className="Login">
                <div className="form-login">
                    <div className="auth-form">
                        <div className="auth-form__container">
                            <div className="auth-form__header">
                                <div className="auth-form__heading">Đăng nhập</div>
                                <NavLink onclick="" to="/register" className="auth-form__switch-btn">Đăng ký</NavLink>
                            </div>
                        </div>
                        <div className="auth-form__body">
                            <form action method="post" id="login-form">
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input className="form-control" onblur="" name="email" rules="required|email" id="email" placeholder="VD: abc@gmail.com" type="text" />
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                    <input className="form-control" onblur="" name="password" rules="required|min:6" id="password" placeholder="Nhập mật khẩu" type="password" />
                                    <span className="form-message" />
                                </div>
                                <div className="auth-form__support">
                                    <span className="auth-form__support-forget">Quên mật khẩu</span>
                                    <span className="auth-form__help-separate" />
                                    <span className="auth-form__support-need-support">Cận trợ giúp?</span>
                                </div>
                                <div className="auth-form__btn">
                                    <div onClick={() => this.props.changeLoginStatus()} className="auth-form__btn-log-in">Đăng nhập</div>
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