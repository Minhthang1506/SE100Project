import React, { Component } from 'react';
import { Card, CardHeader, Divider, Grid, TextField, Box, CardContent, Button, Alert } from '@mui/material';
import { connect } from 'react-redux'
import { BiPlusMedical, BiEdit } from 'react-icons/bi';
import Stack from '@mui/material/Stack';
import { GiCancel } from 'react-icons/gi'
import axios from 'axios';

class AddTypeModal extends Component {
    constructor(props) {
        super(props);
        this.state= {
            change: 'false'
        }
        this.loadInitialData();
    }
    storeID = "";
    typeList = [];

    getAllTypeList = () => {
        const data = {
            token: localStorage.getItem('token'),
            filter: {
                storeID: this.props.infoUser.email,
            }   
        }
        axios.get(`http://localhost:5000/api/product/type`, data)
            .then(res => {
                console.log("Get success");
            })
            .catch(err => {
                console.log(err);
                alert(err)
            })
        // Get data và lưu các tên Type vào bảng

    }
    addType = () => {
        const data = {
            token: localStorage.getItem('token'),
            productType: {
                _id:{
                    typeID: '1999',
                    // storeID: this.props.infoUser.email,
                },
                name: document.querySelector('input[name="typeName"]').value,
            }    
        }
        axios.post(`http://localhost:5000/api/product/type`, data)
            .then(res => {
                alert("Save success");
            })
            .catch(err => {
                alert(err);
            })
        // alert("Chạy được tới đây rồi")
        this.props.changeAddTypeStatus();
    }

    cancel = () => {
        this.props.changeAddTypeStatus();
    }

    sampleTypeData=
        {
            _id: {
                typeID:"11",
                storeID:"19522006@gm.uit.edu.vn"
            },
            name:"Kinggg",
        };

    handle = () => {
        if (this.props.isAddTypeStatus)
            this.addType();
        else 
            this.editType();
    }

    editType = () => {
        alert("Giờ mình sẽ edit")
        const data = {
            token: localStorage.getItem('token'),
            productType: {
                _id: {
                    typeID: this.sampleTypeData._id.typeID,
                    storeID: this.props.infoUser.email,
                }, 
                name:document.querySelector('input[name="typeName"]').value + "SHITs",
            }
        }
        alert(data.product.name)
        axios.put(`http://localhost:5000/api/product/type`, data)
            .then(res => {
                console.log("Update success");
                alert('update được rồi anh trai')
            })
            .catch(err => {
                console.log(err);
                alert("Lỗi gì cmnr")
            })
        this.props.changeAddTypeStatus();
    }
    typeName = "";
    loadInitialData = () => {
        if (this.props.isAddTypeStatus) {
            // alert('Ủa sao lại là add')
        }
        else
        {
            this.typeName = this.sampleTypeData.name;
            this.setState({change: true});
        } 
    }

    render() {
        this.getAllTypeList();
        return (
            <form style={{ zIndex: '10', minWidth: '500px', width: '600px', justifyContent: 'center', marginTop: '10%' }} autoComplete="off" noValidate>
                <Card>
                    <CardHeader 
                        style={{ color: 'blue', backgroundColor: '#efeeef', textAlign: 'center' }} 
                        title={this.props.isAddTypeStatus? "Add Type" : "Edit Type"}
                        />
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
                                    required
                                    type="text"
                                    name="typeName"
                                    defaultValue={this.typeName}
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
                        <Button 
                            style={{ backgroundColor: 'yellowgreen' }} 
                            // onClick={() => this.addShift()} 
                            onClick={() => this.handle()}
                            variant="contained" 
                            startIcon={<BiPlusMedical />}
                        >
                            Xác nhận
                        </Button>
                        <Button 
                            style={{ backgroundColor: 'red' }} 
                            // onClick={() => this.editShift()}
                            onClick={() => this.cancel()}
                            variant="contained" 
                            startIcon={<GiCancel />}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Card>
            </form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        addTypeStatus: state.addTypeStatus,
        isAddTypeStatus: state.isAddTypeStatus,
        infoUser: state.infoUser,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeAddTypeStatus: () => {
            dispatch({
                type: "CHANGE_ADD_TYPE_STATUS",
            });
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTypeModal);