import React, { Component } from 'react';
import { Card, CardHeader, Divider, Grid, TextField, Box, CardContent, Button } from '@mui/material';
import { connect } from 'react-redux'
import { BiPlusMedical, BiEdit } from 'react-icons/bi';
import Stack from '@mui/material/Stack';
import { GiCancel } from 'react-icons/gi'
import axios from 'axios';

class ConfirmModal extends Component {
    constructor(props) {
        super(props);
    }
    confirm = () => {
        // Thực hiện các lệnh xử lý tại đây
        this.props.changeConfirmStatus();
    }

    cancel = () => {
        this.props.changeConfirmStatus();
    }
    render() {
        console.log(this.props.objectEditShift);
        return (
            <form style={{ zIndex: '10', minWidth: '500px', width: '600px', justifyContent: 'center', marginTop: '10%' }} autoComplete="off" noValidate>
                <Card>
                    <CardHeader style={{ color: 'blue', backgroundColor: '#efeeef' }} title="Confirm" />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12}>
                                {
                                    this.props.deleteStatus ? 
                                    (<div>Are you sure to delete this good?</div>)
                                    :
                                    (<div>Are you sure to edit this good?</div>)
                                }
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Stack spacing={3}>
                                   
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', p: 2 }}>
                        <Button style={{ backgroundColor: 'yellowgreen' }} onClick={() => this.confirm()} variant="contained" startIcon={<BiPlusMedical />}>
                            Xác nhận
                        </Button>
                        <Button style={{ backgroundColor: 'red' }} onClick={(e) => this.cancel(e)} variant="contained" startIcon={<GiCancel />}>
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
        confirmStatus: state.confirmStatus,
        deleteStatus: state.deleteStatus,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeConfirmStatus: () => {
            dispatch({
                type: "CHANGE_CONFIRM_STATUS",
            });
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);