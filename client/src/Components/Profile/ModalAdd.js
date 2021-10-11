import React, { Component } from 'react';
import { Card, CardHeader, Divider, Grid, TextField, Box, CardContent, Button } from '@mui/material';
import { connect } from 'react-redux'
import { BiPlusMedical } from 'react-icons/bi';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import { GiCancel } from 'react-icons/gi'
import axios from 'axios';

class ModalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeFrom: Date.now(),
            timeTo: Date.now(),
        }
    }

    descriptionShift = ""
    timeFrom = "00:00 AM"
    timeTo = "00:00 PM"

    // Handle user
    hanhleCancel = (e) => {
        this.props.changeAddStatus();
    }

    changeTimeFrom = (e) => {
        var hourse = e.getHours()
        const minutes = e.getMinutes()
        if (hourse >= 12) {
            hourse = hourse - 12;
            this.timeFrom = hourse.toString() + ":" + minutes.toString() + " PM"
        } else {
            this.timeFrom = hourse.toString() + ":" + minutes.toString() + " AM"
        }
        console.log(this.timeFrom);
        this.setState({
            timeFrom: e,
        })
    }

    changeTimeTo = (e) => {
        var hourse = e.getHours()
        const minutes = e.getMinutes()
        if (hourse >= 12) {
            hourse = hourse - 12;
            this.timeTo = hourse.toString() + ":" + minutes.toString() + " PM"
        } else {
            this.timeTo = hourse.toString() + ":" + minutes.toString() + " AM"
        }
        console.log(this.timeTo);
        this.setState({
            timeTo: e,
        })
    }

    blurDiscription = (e) => {
        this.descriptionShift = e.target.value;
    }


    // Tạo code để xác nhận
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
    
    // Call API
    addShift = () => {
        var value = this.state.timeTo - this.state.timeFrom;
        value = (value / 60 / 60 / 1000);
        var data = {
            id: this.makeCode(6),
            value: value,
            description: this.descriptionShift,
            from: this.timeFrom,
            to: this.timeTo,
        }
        if (data) {
            this.props.addShift(data);
            axios.post(`http://localhost:5000/api/add-shift`, {
                email: this.props.infoUser.email,
                data: data,
            })
                .then(res => {
                    console.log('Thành Công');
                })
                .catch(err => {
                    console.log('thất bại');
                })
            this.props.changeAddStatus();
        }
    }

    render() {
        return (
            <form style={{ zIndex: '10', minWidth: '500px', width: '600px', justifyContent: 'center', marginTop: '10%' }} autoComplete="off" noValidate>
                <Card>
                    <CardHeader style={{ color: 'blue', backgroundColor: '#efeeef' }} title="Create shift" />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    fullWidth
                                    onBlur={(e) => this.blurDiscription(e)}
                                    label="Shift description"
                                    required
                                    type="text"
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3}>
                                        <TimePicker
                                            label="Time"
                                            value="Mon Oct 11 2021 07:00:00 GMT+0700 (Giờ Đông Dương)"
                                            value={this.state.timeFrom}
                                            onChange={(newValue) => this.changeTimeFrom(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                        <TimePicker
                                            label="Time"
                                            value={this.state.timeTo}
                                            onChange={(newValue) => this.changeTimeTo(newValue)}
                                            renderInput={(params) => <TextField onChange={(e) => this.changeTime(e)} {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', p: 2 }}>
                        <Button style={{ backgroundColor: 'yellowgreen' }} onClick={() => this.addShift()} variant="contained" startIcon={<BiPlusMedical />}>
                            Xác nhận
                        </Button>
                        <Button style={{ backgroundColor: 'red' }} onClick={(e) => this.hanhleCancel(e)} variant="contained" startIcon={<GiCancel />}>
                            Hủy
                        </Button>
                    </Box>
                </Card>
            </form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        addStatus: state.addStatus,
        infoUser: state.infoUser,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeAddStatus: () => {
            dispatch({
                type: "CHANGE_ADD_STATUS",
            });
        },
        addShift: (data) => {
            dispatch({
                type: "ADD_SHIFT",
                newShift: data,
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);