import React, { Component } from 'react';
import { TextField } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel, Button, Modal, Grid, Card, CardHeader} from '@mui/material';
import { Image } from 'cloudinary-react';
import axios from 'axios';
import '../../CSS/GoodManager.css';
import { connect } from 'react-redux';
import GoodImage from '../../img/good-example.jpg';
import AddTypeModal from './AddTypeModal';
import { withStyles } from '@material-ui/styles';
import { AiFillPlusCircle} from "react-icons/ai";
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CancelIcon from '@mui/icons-material/Cancel';



var productTypes =[
     'food', 'detergent', 'cuisine'
];


var typeSet = [
    'foot', 'king'
];
const StyledTextField = withStyles((theme) => ({
    root: {
      "& .MuiInputBase-root": {
        height: 36,
        "& input": {
          textAlign: "right",
          marginLeft: '4px',
        }
      }
    }
  }))(TextField);

class GoodImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSelect: "null",
            type:'none',
            url: 'http://res.cloudinary.com/databaseimg/image/upload/v1634117795/ubvxisehhpvnu2lbqmeg.png',
            currentDateTime: new Date('2014-08-18T21:11:54'),
            change: true,
        }; 
        
    }
    handleAdd(){
        this.props.changeAddTypeStatus();
        this.props.setAddTypeStatus();
    }
    imgUrl= 'none';
    dateTime= Date.now();

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
                    this.imgUrl=res.data.url;
                    this.setState({
                        change: 'true'
                    });
                })
                .catch(err => {
                    console.log("Thất bại");
                })

        }

    }
    changeTimeFrom = (e) => {
        this.dateTime=e;
    }
    
    importGood = () => {
        const data = {
            token: localStorage.getItem('token'),
            product: {
                _id: {
                    productID: document.querySelector('input[name="goodID"]').value,
                    importDate: Date(this.dateTime),
                },
                name: document.querySelector('input[name="goodName"]').value,
                quantity: document.querySelector('input[name="goodQuantity"]').value,
                remain: document.querySelector('input[name="goodQuantity"]').value,
                importPrice: document.querySelector('input[name="originalPrice"]').value,
                sellPrice: document.querySelector('input[name="sellPrice"]').value,
                expires: document.querySelector('input[name="expiredDate"]').value,
                imgUrl: this.imgUrl,
                unit: document.querySelector('input[name="unit"]').value,
            }
        }
        axios.post(`http://localhost:5000/api/product`, data)
            .then(res => {
                console.log("Save success");
                console.log(data._id.importDate)
            })
            .catch(err => {
                console.log(err);
            })
        console.log(data);
    }
    
    render() {
        return(
            <div 
                style={{ 
                    height: 600, width: '100%', overflowY: 'scroll', backgroundColor: 'rgb(221,235,255)'   
                }}
            >   
                <div className="good-import-header"></div>
                <Grid className="import-container" container spacing={2}>
                    <Grid item md={3}  
                        style={{
                            display: 'flex', 
                            justifyContent:'center', 
                            flexDirection:'column',
                            alignItems:'center',
                            paddingLeft: '30px'
                        }}
                    >   
                        <label className="profile-header__avatar" for="profile-header-update-avatar" style={{ overflow: 'hidden', marginTop: '15px ' }}>
                            <Image style={{width: '240px',height: '240px', padding: '10px' }} cloudName="databaseimg" publicId={this.imgUrl=='none' ? 'http://res.cloudinary.com/databaseimg/image/upload/v1634358564/b9wj5lcklxitjglymxqh.png' : this.imgUrl}></Image>
                        </label>
                        {/* Ẩn đi */}
                        <input id="profile-header-update-avatar" type="file" style={{ display: 'none' }} accept="image/png, image/jpeg" onChange={(e) => this.profileImageChange(e)}></input>
                    </Grid>
                    <Grid item md={9}>

                        <Card 
                            style={{
                                marginRight: '18px',
                            }}
                        >
                            <CardHeader style={{ color: 'blue', backgroundColor: '#efeeef' , textAlign: 'center'}} title="ADD GOOD" />
                            <Grid container md={12}>
                                <Grid item md={6} 
                                    className='input-item'
                                >
                                    <div 
                                        className="input-label"
                                        style={{
                                            width: '116px'
                                        }}
                                    >
                                        ID
                                    </div>
                                    <StyledTextField
                                        classname='input-box' 
                                        type="text" 
                                        // class="input-val" 
                                        style = {{width: '100%'}} 
                                        fullWidth 
                                        size="small" 
                                        name="goodID" 
                                        variant="outlined" 
                                    />
                                </Grid>
                                <Grid item md={6} 
                                    className='input-item'
                                    style={{
                                        marginLeft: 0,
                                        paddingLeft: 0
                                    }}
                                >
                                    <div className="input-label" style={{width: 128}}>Import Date</div>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            renderInput={(params) => <StyledTextField 
                                                                        {...params} 
                                                                        classname='input-box'
                                                                        name="importDateTime"
                                                                        style = {{width: '70%', marginRight: 20}} 
                                                                        fullWidth 
                                                                    />}
                                            value={this.dateTime}
                                            onChange={(newValue) => {
                                                this.changeTimeFrom(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                
                                <Grid item md={6} 
                                    className='input-item'
                                >
                                    <div className="input-label"style={{width: '114px'}}>Name</div>
                                    <StyledTextField
                                        classname='input-box'   
                                        type="text" 
                                        // class="input-val" 
                                        style = {{width: '100%'}} 
                                        fullWidth
                                        size="small"
                                        name="goodName" 
                                        variant="outlined" 
                                    />
                                </Grid>
                                <Grid item md={3}
                                    className='input-item'
                                    style={{padding: '0px', marginLeft: '0px'}}
                                >
                                    <div 
                                        className="input-label" 
                                        style={{width: '100px'}}
                                    >
                                        Quantity
                                    </div>
                                    <StyledTextField
                                        style = {{width: '60%'}} 
                                        fullWidth
                                        name="goodQuantity" 
                                        variant="outlined"
                                        type="number" 
                                    />
                                </Grid>
                                <Grid item md={3}
                                    className='input-item'
                                    style={{
                                        paddingRight: 24
                                    }}
                                >
                                    <div 
                                        className="input-label"
                                        style={{
                                            marginLeft: 0,
                                            paddingLeft: 4
                                        }}
                                    >
                                        Unit
                                    </div>
                                    <StyledTextField
                                        classname='input-box'
                                        style = {{width: '100%', marginLeft: '4px'}} 
                                        fullWidth
                                        name="goodQuantity" 
                                        variant="outlined"
                                        type="text" 
                                        name="unit" 
                                    />
                                </Grid>
                                <Grid item md={6}
                                    className='input-item'
                                >
                                    <div className="input-label" style={{width: 128}}>Original Price</div>
                                    <StyledTextField
                                        classname='input-box'
                                        style = {{width: '60%', marginLeft: '4px', marginRight:'8px'}} 
                                        fullWidth
                                        name="originalPrice" 
                                        variant="outlined"
                                        type="number" 
                                    />
                                    đ
                                </Grid>
                                <Grid item md={6}
                                    className='input-item'
                                    style={{padding: '0px', marginLeft: '0px', paddingRight: 24}}
                                >
                                    <div 
                                        className="input-label"
                                        style={{width: '96px'}}
                                    >
                                        Sell Price
                                    </div>
                                    <StyledTextField
                                        classname='input-box'
                                        style = {{width: '80%', marginLeft: '4px',marginRight:'8px'}} 
                                        fullWidth
                                        name="sellPrice" 
                                        variant="outlined"
                                        type="number" 
                                    />
                                    đ
                                </Grid>
                                <Grid item md={7} 
                                    className='input-item'
                                >
                                    <div className="input-label" style={{width: 132}}>Expired Date</div>
                                    <StyledTextField
                                        classname='input-box'   
                                        type="date" 
                                        style = {{width: '70%'}} 
                                        fullWidth
                                        size="small"
                                        name="expiredDate" 
                                        variant="outlined" 
                                    />
                                </Grid>
                                <Grid item md={10}
                                    className='input-item'
                                >
                                    <div 
                                        className="input-label"
                                        style={{width:132}}
                                    >
                                        Product Type
                                    </div>
                                    <FormControl sx={{ minWidth: 120 }}>
                                        {/* <InputLabel id="select-filled-label">Type</InputLabel> */}
                                        <Select
                                            value={this.state.type}
                                            onChange={(event) => {
                                                this.setState({type: event.target.value});
                                                if(!typeSet.includes(event.target.value))
                                                {
                                                    typeSet.push(event.target.value);
                                                }
                                            }}
                                            style={{
                                                height: 36,
                                            }}
                                        >
                                            {
                                                productTypes.length== 0 ? <MenuItem value={'none'}>None</MenuItem>
                                                : productTypes.map((type) =>
                                                    <MenuItem value={type}>{type}</MenuItem>
                                                )
                                            }   
                                        </Select> 
                                    </FormControl>
                                    <Button onClick={() => this.handleAdd()}>
                                        <AiFillPlusCircle
                                            size={28}
                                            style={{
                                                fontSize: 28,
                                                margin: 0,
                                                padding: 0,
                                                width: 28,
                                                height: 28
                                            }}    
                                        />
                                    </Button>
                                    <div className='all-type-container'>
                                            {
                                                Array.from(typeSet).map((type) =>
                                                    <div className='type-container'>
                                                        
                                                        <CancelIcon
                                                            className='close-icon'
                                                            size={10}
                                                            onClick={() => {
                                                                typeSet = typeSet.filter(function(item) {
                                                                    return item != type;
                                                                })
                                                                console.log(typeSet);
                                                                this.setState({type: 'none'});
                                                            }}
                                                
                                                        />
                                                        <span className='type-title'>
                                                            {type}
                                                        </span>
                                                    </div>
                                                    
                                                )
                                            }
                                        </div>
                                </Grid>
                                {/* <Grid item md={10}
                                    className='input-item'
                                >

                                </Grid> */}
                                <Grid item md={2}
                                    className='input-item'
                                >
                                    <Button variant="contained" onClick={() => this.importGood()}>
                                        Import
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item sm={12} md={12} >
                        
                    </Grid>
                </Grid> 
                    
                {this.props.addTypeStatus ? (
                    <div className="modal-add">
                        <div onClick={() => {this.props.changeAddTypeStatus();}} className="modal-overlay"></div>
                        <AddTypeModal></AddTypeModal>
                    </div>
                ): null}
            </div>
        );        
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        addTypeStatus: state.addTypeStatus,
        infoUser: state.infoUser,
        isAddTypeStatus: state.isAddTypeStatus,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeAddTypeStatus: () => {
            dispatch({
                type: "CHANGE_ADD_TYPE_STATUS",
            });
        },
        updateAvatar: (avatar) => {
            dispatch({
                type: "UPDATE_AVATAR",
                avatar: avatar
            })
        },
        setAddTypeStatus: () => {
            dispatch({
                type: "SET_ADD_TYPE_STATUS",
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodImport);