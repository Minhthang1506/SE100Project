import React, { Component } from 'react';
import '../CSS/Login.css'
import {
    NavLink
} from "react-router-dom";
import { connect } from 'react-redux';
import Avatar from '@mui/material/Avatar'
import { IconContext } from "react-icons";
import { FiChevronLeft } from "react-icons/fi";
import { BsFillEnvelopeFill, BsLockFill, BsCodeSlash } from "react-icons/bs";
import { FiUserPlus } from "react-icons/fi";
import { FaPhoneSquare } from "react-icons/fa";
import emailjs from 'emailjs-com';
var bcrypt = require('bcryptjs');


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            tel: "",
            code: "",
            statusSendCode: true,
        }
    }

    // Send code tới người dùng
    sendCode = (a = this.makeCode(6)) => {
        this.setState({
            code: a,
        })
        emailjs.init("user_K1g5N5hUDI0rjsa1uRoI4");
        emailjs.send("gmail_main", "template_plasdgf", {
            To_mail: `${this.state.email}`,
            code: `${a}`,
        })
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
            }, (err) => {
                console.log('FAILED...', err);
            });
    }

    // status SignUp 
    SignUp = (e) => {
        if (this.blurEmail() && this.blurCode() && this.blurPassword() && this.blurRePassword() && this.blurTel()) {
            this.props.changeLoginStatus();
            console.log("Tài khoản: " + this.state.email);
            console.log("Mật khẩu: " + this.state.password);
            console.log("Code: " + this.state.code);
            console.log("Tel: " + this.state.tel);
            e.stopPropagation();
        } else {
            e.preventDefault();
        }
    }

    // Tạo mã code cho người dùng xác nhận
    makeCode = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    // Hashpassword
    hash = (pass) => {
        var hash = bcrypt.hashSync(pass, 12)
        return hash;
    }

    // Hashpass -> pass : trả về true, false
    hashReturn = (rePass) => {
        var verified = bcrypt.compareSync(rePass, this.state.password);
        return verified;
    }

    // Handle user : blur, change in input
    blurEmail = () => {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const e = document.getElementById('email');
        const elementValue = e.value;
        const formGroup = e.parentElement.parentElement;
        this.setState({
            email: elementValue,
        })
        if (elementValue === "") {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Please enter this field";
            this.setState({
                statusSendCode: true,
            })
            return false;
        } else if (!regex.test(elementValue)) {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Email is not in the correct format";
            this.setState({
                statusSendCode: true,
            })
            return false
        } else {
            formGroup.classList.remove('invalid');
            formGroup.querySelector('.form-message').innerText = "";
            this.setState({
                statusSendCode: false,
            })
            return true;
        }
    }

    blurCode = () => {
        const e = document.getElementById('code');
        const elementValue = e.value;
        const formGroup = e.parentElement.parentElement;
        if (this.state.code === "") {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Please press Send Code"
            return false
        } else if (elementValue === "") {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Enter code here"
            return false
        } else if (elementValue !== this.state.code) {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Code is incorrect"
            return false
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

    blurRePassword = () => {
        const e = document.getElementById('re-password')
        const elementValue = e.value;
        const formGroup = e.parentElement.parentElement;
        if (elementValue === "") {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Please enter this field";
            return false;
        } else if (!this.hashReturn(elementValue)) {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Re-password not correct";
            return false;
        } else {
            formGroup.classList.remove('invalid');
            formGroup.querySelector('.form-message').innerText = "";
            return true
        }
    }

    blurTel = () => {
        const e = document.getElementById('tel');
        const elementValue = e.value;
        const formGroup = e.parentElement.parentElement;
        const regex = /^\d+$/;
        this.setState({
            tel: elementValue,
        })
        if (elementValue === "") {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Please enter this field";
            return false;
        } else if (!regex.test(elementValue)) {
            formGroup.className = 'invalid form-group'
            formGroup.querySelector('.form-message').innerText = "Phone is not in the correct format";
            return false;
        } else {
            formGroup.classList.remove('invalid');
            formGroup.querySelector('.form-message').innerText = "";
            return true;
        }
    }

    changeInput = (e) => {
        const elementValue = e.target.value;
        const formGroup = e.target.parentElement.parentElement;
        formGroup.classList.remove('invalid');
        formGroup.querySelector('.form-message').innerText = "";
    }

    render() {
        return (
            <div className="Login">
                <div className="form-register">
                    <div className="auth-form">
                        <Avatar className="auth-form__avatar">
                            <IconContext.Provider value={{ color: "blue", size: "3em", className: "global-class-name" }}>
                                <FiUserPlus></FiUserPlus>
                            </IconContext.Provider>
                        </Avatar>
                        <div className="auth-form__container">
                            <div className="auth-form__header">
                                <div className="auth-form__heading">Register</div>
                                <NavLink to="/login" className="auth-form__switch-btn"> <FiChevronLeft className="auth-form__arrow-return"></FiChevronLeft>Login</NavLink>
                            </div>
                        </div>
                        <div className="auth-form__body">
                            <form action="/home" method="post" id="login-form">
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-custom">
                                        <span><BsFillEnvelopeFill className="input-custom-icon" /></span>
                                        <input className="form-control" onChange={(e) => this.changeInput(e)} onBlur={() => this.blurEmail()} name="email" rules="required|email" id="email" placeholder="VD: abc@gmail.com" type="text" />
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="code" className="form-label">Code</label>
                                    <div className="input-custom">
                                        <span><BsCodeSlash className="input-custom-icon" /></span>
                                        <input className="form-control" onChange={(e) => this.changeInput(e)} onBlur={() => this.blurCode()} name="code" rules="required|email" id="code" placeholder="Ex: ABC321" type="text" />
                                        <button type="button" disabled={this.state.statusSendCode} onClick={() => this.sendCode()} class="btn btn-primary disabel send-code">Send code</button>
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-custom">
                                        <span>
                                            <BsLockFill className="input-custom-icon" ></BsLockFill>
                                        </span>
                                        <input className="form-control" onChange={(e) => this.changeInput(e)} onBlur={() => this.blurPassword()} name="password" rules="required|min:6" id="password" placeholder="Emter password" type="password" />
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="re-password" className="form-label">Password</label>
                                    <div className="input-custom">
                                        <span>
                                            <BsLockFill className="input-custom-icon" ></BsLockFill>
                                        </span>
                                        <input className="form-control" onChange={(e) => this.changeInput(e)} onBlur={() => this.blurRePassword()} name="re-password" id="re-password" placeholder="Emter re-password" type="password" />
                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Tel</label>
                                    <div className="input-custom">
                                        <span>
                                            <FaPhoneSquare className="input-custom-icon" ></FaPhoneSquare>
                                        </span>
                                        <input className="form-control" onBlur={(e) => this.blurTel(e)} onChange={(e) => this.changeInput(e)} name="tel" rules="required" id="tel" placeholder="Ex: 0303030303" type="tel" />

                                    </div>
                                    <span className="form-message" />
                                </div>
                                <div className="register-description">Bằng cách ấn vào nút
                                    <span className="register-description__keyword">“ĐĂNG KÝ”</span>
                                    , tôi đồng ý với
                                    <span className="register-description__keyword">Điều Khoản Sử Dụng</span> và
                                    <div className="register-description__keyword"> Chính Sách Bảo Mật</div>
                                </div>
                                <div className="auth-form__btn">
                                    <NavLink to="/home" onClick={(e) => this.SignUp(e)} className="auth-form__btn-log-in auth-form__switch-btn">Sign Up</NavLink>
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