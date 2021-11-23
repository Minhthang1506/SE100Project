import React, { Component } from 'react';
import avatarImg from '../../img/avatar_default.jpg'
import Divider from '@mui/material/Divider';
import { FaTelegramPlane } from "react-icons/fa";
import { connect } from 'react-redux'
import axios from 'axios'
import { Image } from 'cloudinary-react'

class ProfileHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSelect: "null",
        }
    }



    profileImageChange = (fileChangeEvent) => {
        this.setState({
            imageSelect: fileChangeEvent.target.files[0],
        })
        const file = fileChangeEvent.target.files[0];
        const { type } = file;
        if (!(type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg') || type.endsWith('gif'))) {
        } else {
            const formData = new FormData();
            formData.append("file", fileChangeEvent.target.files[0])
            formData.append("upload_preset", "qqqhcaa3");
            axios.post(`https://api.cloudinary.com/v1_1/databaseimg/image/upload`, formData)
                .then(res => {
                    this.props.updateAvatar(res.data.url);
                    axios.post(`http://localhost:5000/api/profile/update-avatar`, {
                        email: this.props.infoUser.email,
                        avatar: res.data.url,
                        token: localStorage.getItem('token'),
                    }).then(res => {
                        localStorage.setItem('token', res.data.token);
                        this.props.hideAlert();
                        this.props.showAlert("Update avatar success", "success");
                    }).catch(err => {
                        this.props.changeLoginStatus();
                        this.props.hideAlert();
                        this.props.showAlert("Login timeout, signin again", "warning");
                    })
                })
                .catch(err => {
                    this.props.hideAlert();
                    this.props.showAlert("System image faile", "warning");
                })

        }

    }

    render() {
        return (
            <div className="profile-header" style={{ width: '100%', height: '350px' }}>
                <label className="profile-header__avatar" for="profile-header-update-avatar" style={{ borderRadius: '100%', overflow: 'hidden', marginTop: '15px ' }}>
                    <Image style={{ width: '100px', height: '100px' }} cloudName="databaseimg" publicId={this.props.infoUser.avatar ? this.props.infoUser.avatar : avatarImg}></Image>
                </label>
                {/* Ẩn đi */}
                <input id="profile-header-update-avatar" type="file" style={{ display: 'none' }} accept="image/png, image/jpeg" onChange={(e) => this.profileImageChange(e)}></input>
                <div className="profile-header-des">
                    <h2 className="profile-header__name">
                        {this.props.infoUser.lastName + " " + this.props.infoUser.firstName}
                    </h2>
                </div>
                <div style={{ display: 'flex', fontSize: '1rem', color: "white" }}>
                    <FaTelegramPlane className="profile-header__icon-tel"></FaTelegramPlane>
                    <p className="profile-header__tel">{this.props.infoUser.tel}</p>
                </div>
                <Divider className="profile-header__divider"></Divider>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        infoUser: state.infoUser,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateAvatar: (avatar) => {
            dispatch({
                type: "UPDATE_AVATAR",
                avatar: avatar
            })
        },
        showAlert: (message, typeMessage) => {
            dispatch({
                type: "SHOW_ALERT",
                message: message,
                typeMessage: typeMessage,
            })
        },
        changeLoginStatus: () => {
            dispatch({
                type: "CHANGE_LOGIN_STATUS",
            });
        },
        hideAlert: () => {
            dispatch({
                type: "HIDE_ALERT",
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader);