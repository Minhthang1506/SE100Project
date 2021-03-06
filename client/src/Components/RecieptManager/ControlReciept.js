import React from 'react';
import { Grid, Card, CardHeader, Divider, CardContent, Box, Modal, Button } from '@mui/material';
import { red, blue, lightBlue } from '@mui/material/colors';
import { CgDanger } from 'react-icons/cg'
import { useSelector, useDispatch } from 'react-redux'
import {TiArrowBack} from 'react-icons/ti'
import axios from 'axios'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};


function ControlReciept(props) {
    const dispatch = useDispatch()
    const darkmode = useSelector(state => state.statusDarkmode)
    const statusSelectAll = useSelector(state => state.statusSelectAll)
    const infoUser = useSelector(state => state.infoUser)
    const listRecieptDelete = useSelector(state => state.listRecieptDelete)
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [typeDelete, setTypeDelete] = React.useState('');
    const [typeRestone, setTypeRestone] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        if (typeDelete === "DELETE_MAHD_SELECTED_RECIEPT") {
            await axios.post('http://localhost:5000/api/sell-product/delete-receipt-selected', {
                token: localStorage.getItem('token'),
                email: infoUser.email,
                listMAHD: listRecieptDelete,
            })
                .then(res => {
                    if (res.data.status === 1) {
                        localStorage.setItem('token', res.data.token)
                        dispatch({
                            type: typeDelete,
                            listMAHD: listRecieptDelete,
                        })
                        dispatch({
                            type: "HIDE_ALERT",
                        })
                        dispatch({
                            type: "SHOW_ALERT",
                            message: 'Delete success',
                            typeMessage: 'success',
                        })
                        dispatch({
                            type: "RESET_MAHD_RECIEPT",
                        })
                    }
                })
                .catch(err => {
                    dispatch({
                        type: "CHANGE_LOGIN_STATUS",
                    });
                    dispatch({
                        type: "HIDE_ALERT",
                    })
                    dispatch({
                        type: "SHOW_ALERT",
                        message: 'Login timeout, signin again',
                        typeMessage: 'warning',
                    })
                })
            
        } else if (typeDelete === "DELETE_MAHD_INVOICE_RECIEPT") {
            await axios.post('http://localhost:5000/api/sell-product/delete-invoice-receipt', {
                token: localStorage.getItem('token'),
                email: infoUser.email,
            })
                .then(res => {
                    if (res.data.status === 1) {
                        localStorage.setItem('token', res.data.token)
                        dispatch({
                            type: typeDelete,
                        })
                        dispatch({
                            type: "HIDE_ALERT",
                        })
                        dispatch({
                            type: "SHOW_ALERT",
                            message: 'Delete success',
                            typeMessage: 'success',
                        })
                    }
                })
                .catch(err => {
                    dispatch({
                        type: "CHANGE_LOGIN_STATUS",
                    });
                    dispatch({
                        type: "HIDE_ALERT",
                    })
                    dispatch({
                        type: "SHOW_ALERT",
                        message: 'Login timeout, signin again',
                        typeMessage: 'warning',
                    })
                })
            
        } else if (typeDelete === "DELETE_ALL_RECIEPT") {
            await axios.post('http://localhost:5000/api/sell-product/delete-all-receipt', {
                token: localStorage.getItem('token'),
                email: infoUser.email,
            })
                .then(res => {
                    if (res.data.status === 1) {
                        localStorage.setItem('token', res.data.token)
                        dispatch({
                            type: typeDelete,
                        })
                        dispatch({
                            type: "HIDE_ALERT",
                        })
                        dispatch({
                            type: "SHOW_ALERT",
                            message: 'Delete success',
                            typeMessage: 'success',
                        })
                    }
                })
                .catch(err => {
                    dispatch({
                        type: "CHANGE_LOGIN_STATUS",
                    });
                    dispatch({
                        type: "HIDE_ALERT",
                    })
                    dispatch({
                        type: "SHOW_ALERT",
                        message: 'Login timeout, signin again',
                        typeMessage: 'warning',
                    })
                })
            
        } else if (typeDelete === 'RESTONE_ALL_RECIEPT') {
            await axios.post('http://localhost:5000/api/sell-product/restone-all-receipt', {
                token: localStorage.getItem('token'),
                email: infoUser.email,
            })
                .then(res => {
                    if (res.data.status === 1) {
                        localStorage.setItem('token', res.data.token)
                        dispatch({
                            type: typeDelete,
                        })
                        dispatch({
                            type: "HIDE_ALERT",
                        })
                        dispatch({
                            type: "SHOW_ALERT",
                            message: 'Restone success',
                            typeMessage: 'success',
                        })
                    }
                })
                .catch(err => {
                    dispatch({
                        type: "CHANGE_LOGIN_STATUS",
                    });
                    dispatch({
                        type: "HIDE_ALERT",
                    })
                    dispatch({
                        type: "SHOW_ALERT",
                        message: 'Login timeout, signin again',
                        typeMessage: 'warning',
                    })
                })
        }
        dispatch({
            type: 'CHANGE_SELECT_ALL_STATUS'
        })
        dispatch({
            type:"RESET_STATUS_SELECT_ALL"
        })
        handleClose();
    }

    const DeleteSelect = () => {
        if (listRecieptDelete.length === 0) {
            dispatch({
                type: "HIDE_ALERT",
            })
            dispatch({
                type: "SHOW_ALERT",
                message: 'You have not selected any invoices yet',
                typeMessage: 'warning',
            })
        } else {
            setTypeDelete("DELETE_MAHD_SELECTED_RECIEPT")
            setMessage("Are you sure to delete the selected?")
            setTypeRestone(false);
            handleOpen();
        }

    }

    const RestoneAll = () => {
        setTypeDelete("RESTONE_ALL_RECIEPT")
        setMessage("Are you want to restone all receipt?")
        setTypeRestone(true);
        handleOpen();
    }

    const DeleteInvoice = () => {
        setTypeDelete("DELETE_MAHD_INVOICE_RECIEPT")
        setMessage("Are you sure to delete invoice?")
        setTypeRestone(false);
        handleOpen();
    }

    const DeleteAll = () => {
        setTypeDelete("DELETE_ALL_RECIEPT")
        setMessage("Are you sure to delete ALL?")
        setTypeRestone(false);
        handleOpen();
    }

    const changeStatus = () => {
        dispatch({
            type: "CHANGE_SELECT_ALL_STATUS"
        })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={12} sm={12}  >
                <Card>
                    <CardHeader style={{ color: !darkmode ? '#0091ea' : 'white', backgroundColor: !darkmode ? '#efeeef' : '#455a64' }} title="Control" />
                    <Divider></Divider>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12}  >
                                <Button onClick={() => changeStatus()} style={{ width: '100%', backgroundColor: blue[600], color: 'white' }} size='medium'>
                                    {statusSelectAll ? 'Turn off select all' : 'Select All'}
                                </Button>
                            </Grid>
                            <Grid item md={12} sm={12}  >
                                <Button onClick={() => RestoneAll()} style={{ width: '100%', backgroundColor: '#00bfa5', color: 'white' }} size='medium'>
                                    <TiArrowBack style={{ fontSize: '1.6rem', paddingRight: '5px' }}></TiArrowBack>
                                    Restore All
                                </Button>
                            </Grid>
                            <Grid item md={12} sm={12}  >
                                <Button onClick={() => DeleteSelect()} style={{ width: '100%', backgroundColor: red[400], color: 'white' }} size='medium'>
                                    <CgDanger style={{ fontSize: '1.6rem', paddingRight: '5px' }}></CgDanger>
                                    Delete Selected
                                </Button>
                            </Grid>
                            <Grid style={{display:'none'}} item md={12} sm={12}  >
                                <Button onClick={() => DeleteInvoice()} style={{ width: '100%', backgroundColor: red[400], color: 'white' }} size='medium'>
                                    <CgDanger style={{ fontSize: '1.6rem', paddingRight: '5px' }}></CgDanger>
                                    Delete deleted invoice
                                </Button>
                            </Grid>
                            <Grid  item md={12} sm={12}  >
                                <Button onClick={() => DeleteAll()} style={{ width: '100%', backgroundColor: red[600], color: 'white' }} size='medium'>
                                    <CgDanger style={{ fontSize: '1.6rem', paddingRight: '5px' }}></CgDanger>
                                    Delete All
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 style={{ textAlign: 'center', fontSize: '1.4rem', marginBottom: '15px' }} >{message}</h2>
                    <Divider />
                    <Grid style={{ marginTop: '5px' }} container spacing={2}>
                        <Grid style={{ justifyContent: 'center', display: 'flex' }} item md={6} sm={6}  >
                            <Button onClick={() => handleDelete()} style={{ color: 'white', backgroundColor: typeRestone? '#00bfa5' : red[500] }}>{typeRestone ? 'RESTONE' : 'DELETE'}</Button>
                        </Grid>
                        <Grid style={{ justifyContent: 'center', display: 'flex' }} item md={6} sm={6}  >
                            <Button onClick={() => setOpen(false)} style={{ backgroundColor: lightBlue[100] }}>CANCEL</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Grid>
    );
}

export default ControlReciept;