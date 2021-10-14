import React, { Component } from 'react';
import { Card, CardHeader, Divider, Grid, TextField, Box, CardContent, Button } from '@mui/material';
import { connect } from 'react-redux'
import { BiPlusMedical, BiEdit } from 'react-icons/bi';
import Stack from '@mui/material/Stack';
import { GiCancel } from 'react-icons/gi'
import axios from 'axios';

class AddTypeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeFrom: this.props.editShiftStatus ? `Mon Oct 11 2021 ${this.props.objectEditShift.from} GMT+0700 (Giờ Đông Dương)` : Date.now(),
            timeTo: this.props.editShiftStatus ? `Mon Oct 11 2021 ${this.props.objectEditShift.to} GMT+0700 (Giờ Đông Dương)` : Date.now(),
        }
    }

    descriptionShift = ""
    timeFrom = "00:00 AM"
    timeTo = "00:00 PM"
    salary = 10000

    // Handle user
    hanhleCancel = (e) => {
        this.props.changeAddStatus();
        if (this.props.editShiftStatus) {
            this.props.changeEditShiftStatus();
        }
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
    blurSalary = (e) => {
        this.salary = e.target.value;
    }

    addType = () => {
        this.props.changeAddStatus();
    }

    cancel = () => {
        this.props.changeAddStatus();
    }

    render() {
        console.log(this.props.objectEditShift);
        return (
            <form style={{ zIndex: '10', minWidth: '500px', width: '600px', justifyContent: 'center', marginTop: '10%' }} autoComplete="off" noValidate>
                <Card>
                    <CardHeader style={{ color: 'blue', backgroundColor: '#efeeef' }} title="Add type" />
                    <Divider />
                    <CardContent>
                        <Grid 
                            container 
                            spacing={2}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            <Grid item md={2} xs={12}>
                                TypeName
                            </Grid>
                            <Grid item md={10} xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    fullWidth
                                    defaultValue={(this.props.editShiftStatus ? this.props.objectEditShift.description : "")}
                                    onBlur={(e) => this.blurDiscription(e)}
                                    required
                                    type="text"
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Stack spacing={3}>
                                   
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', p: 2 }}>
                        {this.props.editShiftStatus ? (
                            <Button 
                                style={{ backgroundColor: 'yellowgreen' }} 
                                // onClick={() => this.editShift()}
                                onClick={() => this.cancel()}
                                variant="contained" 
                                startIcon={<BiEdit />}
                            >
                                Cancel
                            </Button>
                            ) : (
                            <Button 
                                style={{ backgroundColor: 'yellowgreen' }} 
                                // onClick={() => this.addShift()} 
                                onClick={() => this.addType()}
                                variant="contained" 
                                startIcon={<BiPlusMedical />}
                            >
                                Xác nhận
                            </Button>
                        )}
                        <Button 
                            style={{ backgroundColor: 'red' }} 
                            // onClick={() => this.editShift()}
                            onClick={() => this.cancel()}
                            variant="contained" 
                            startIcon={<GiCancel />}
                        >
                            Cancel
                        </Button>
                        {/* <Button style={{ backgroundColor: 'red' }} onClick={(e) => this.hanhleCancel(e)} variant="contained" startIcon={<GiCancel />}>
                            Hủy
                        </Button> */}
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
        editShiftStatus: state.editShiftStatus,
        objectEditShift: state.objectEditShift,
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
        },
        changeEditShiftStatus: () => {
            dispatch({
                type: "CHANGE_EDIT_SHIFT_STATUS",
            })
        },
        updateShift: (data) => {
            dispatch({
                type: "OBJECT_UPDATE_SHIFT",
                data: data,
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTypeModal);