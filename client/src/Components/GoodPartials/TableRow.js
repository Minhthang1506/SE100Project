import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Image } from 'cloudinary-react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { withStyles } from '@material-ui/styles';
import GoodImage from './goodExample.jpg';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch } from 'react-redux'
import axios from 'axios';
import { Component } from 'react';
import { connect } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

const styles = theme =>  ({
    goodTable_Cell:{
        borderWidth: '1px',
        borderColor: '#ccc',
        borderStyle: 'solid',
        height: 4,
        color: '#333'
    }
});



class GoodRow extends Component{
    constructor(props) {
        super(props);
        this.state ={
            update: false,
            change: false,
        }
        console.log('regulation', this.props.regulation)
    }
    isOpen = false;
    row = {};
    setOpen(value) {
        this.isOpen = value;
        this.setState({change: !this.state.change});
    }

    async deleteProduct(row) {
        // Xoá sản phẩm
        console.log("row", row)
        const data = {
            token: localStorage.getItem('token'),
            products:
            [
                {
                    productID: row._id.productID,
                    importDate: row._id.importDate,
                    storeID: row._id.storeID,
                }
            ]
            
        }
        axios.delete(`http://localhost:5000/api/product`,{data: data})
            .then(res => {
                alert("delete product success");
            })
            .catch(err => {
                this.props.hideAlert();
				this.props.showAlert("Something happened, restart and try again","warning");
            })
        
        // Get hết các cái join của sản phẩm
        var allJoinMatch = [];
        const data1 = {
            token: localStorage.getItem('token'),
            filter: {
                "_id.storeID": row._id.storeID,
                "_id.productID": row._id.productID,
            }   
        }
        await axios.get(`http://localhost:5000/api/product/join`, 
        {
            params: {...data1}
        })
            .then(res => {
                allJoinMatch = res.data.data;
            })
            .catch(err => {
                console.log(err);
                this.props.hideAlert();
				this.props.showAlert("Something happened, restart and try again","warning");
            })
        console.log(allJoinMatch);
        // Xoá các join liên quan đến sản phẩm
        var allProductJoin = [];
        for(var i = 0 ; i < allJoinMatch.length; i++)
        {
            allProductJoin.push({
                productID: row._id.productID,
                typeID: allJoinMatch[i]._id.typeID,
                importDate: allJoinMatch[i]._id.importDate,
                storeID: row._id.storeID,
            });
        }
        const dataJoin = {
            token: localStorage.getItem('token'),
            productJoinTypes: allProductJoin,      
        }

        console.log(dataJoin);

        await axios.delete(`http://localhost:5000/api/product/join`,{data: dataJoin})
            .then(res => {
                console.log("delete join success");
            })
            .catch(err => {
                this.props.hideAlert();
				this.props.showAlert("Something happened, restart and try again","warning");
            })
        
        console.log("this.props.data",this.props.data)
        this.props.deleteProductToRedux(this.props.data);
    }

    getTypeList(typeList)
    {
        var joinType = '';
        for(var i = 0 ; i < typeList.length; i++)
        {
            for(var j = 0 ; j < this.props.typeProduct.length; j++)
            {
                if(this.props.typeProduct[j]._id.typeID == typeList[i])
                {
                    joinType += " " + this.props.typeProduct[j].name;
                    break;
                }
            }
        }
        return joinType;
    }

    render () {
        const { classes } = this.props;
        const row = this.props.data;
        // console.log(row);
        return (
            <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell className={classes.goodTable_Cell} component="th" scope="row">{row._id.productID}</TableCell>
                <TableCell className={classes.goodTable_Cell} component="th" scope="row">{row.name}</TableCell>
                <TableCell className={classes.goodTable_Cell} align="right">{row.quantity}</TableCell>
                <TableCell className={classes.goodTable_Cell} align="right">
                <div style={{display: 'flex'}}>
                    {
                        Object.keys(this.props.regulation).length == 0 ?
                        <div>{row.sellPrice}</div> :
                        this.props.regulation.currency == 'vnd' ?
                        <div>{row.sellPrice}</div> :
                        <div>{(row.sellPrice/this.props.regulation.exchangeRate).toFixed(2)}</div>
                    }
                    
                    <div style={{marginLeft: 4}}>
                        {
                            (Object.keys(this.props.regulation).length == 0)
                                ? ' VNĐ':
                            (this.props.regulation.currency == 'vnd' ? ' VNĐ' : ' $')
                        }
                    </div>
                </div>
                </TableCell>
                <TableCell className={classes.goodTable_Cell} align="right">
                    {/* {row.importTime == null ? '' : row.importTime.substring(0,row.importTime.indexOf('T'))} */}
                    {row._id.importDate == null ? '': row._id.importDate.indexOf('T')==-1 ? row._id.importDate: row._id.importDate.substring(0,row._id.importDate.indexOf('T'))}
                </TableCell>
                <TableCell className={classes.goodTable_Cell} align="right">
                    <IconButton aria-label="expand row" size="small" onClick={() => this.setOpen(!this.isOpen)}>
                        {this.isOpen ? (<KeyboardArrowUpIcon />) : (<KeyboardArrowDownIcon />)}
                    </IconButton>
                </TableCell>
            </TableRow>
            {
                this.isOpen ?
                <TableRow>
                    <TableCell className={classes.goodTable_Cell} style={{ padding: 0, height: 100}} colSpan={8}>
                        {/* <Collapse in={open} timeout="auto" unmountOnExit> */}
                        <Collapse in={true} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Other information
                                </Typography>
                                <div style={{display: 'flex'}}>
                                    {  
                                        row.imgUrl == "none"
                                        ? <div style={{width: '100px', height: '100px', objectFit:'cover'}}><img src={GoodImage} style={{width: '100px', height: '100px', objectFit:'cover'}}/></div>
                                        
                                        : <div style={{width: '100px', height: '100px', objectFit:'cover'}}><Image style={{width: '100px', height: '100px', objectFit:'cover'}} cloudName="databaseimg" publicId={row.imgUrl}>{row.imgUrl}</Image></div>
                                    }
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.goodTable_Cell}><div style={{color: '#333'}}>Expired Day</div></TableCell>
                                                <TableCell className={classes.goodTable_Cell}><div  style={{color: '#333'}}>Original Price</div></TableCell>
                                                <TableCell className={classes.goodTable_Cell} style={{color: '#333'}}><div  style={{color: '#333'}}>Good Remain</div></TableCell>
                                                <TableCell className={classes.goodTable_Cell} style={{color: '#333'}}><div  style={{color: '#333'}}>Product Type</div></TableCell>
                                                <TableCell className={classes.goodTable_Cell} style={{color: '#333'}}><div style={{color: '#333'}}>Unit</div></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className={classes.goodTable_Cell} component="th" scope="row">
                                                    {/* {row.hidden.expires == null ? '': row.hidden.expires.substring(0,row.hidden.expires.indexOf('T'))} */}
                                                    {row.expires == null ? '': row.expires.indexOf('T') ==-1 ? row.expires : row.expires.substring(0,row.expires.indexOf('T'))}
                                                </TableCell>
                                                <TableCell className={classes.goodTable_Cell} >
                                                    <div style={{display: 'flex'}}>
                                                    {
                                                        Object.keys(this.props.regulation).length == 0 ?
                                                        <div>{row.importPrice}</div> :
                                                        this.props.regulation.currency == 'vnd' ?
                                                        <div>{row.importPrice}</div> :
                                                        <div>{(row.importPrice/this.props.regulation.exchangeRate).toFixed(2)}</div>
                                                    }
                                                        <div style={{marginLeft: 4}}>
                                                            {
                                                                (Object.keys(this.props.regulation).length == 0)
                                                                    ? ' VNĐ':
                                                                (this.props.regulation.currency == 'vnd' ? ' VNĐ' : ' $')
                                                            }
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={classes.goodTable_Cell}>{row.remain}</TableCell>
                                                <TableCell className={classes.goodTable_Cell}>{this.getTypeList(row.typeIDList)}</TableCell>
                                                <TableCell className={classes.goodTable_Cell}>{row.unit}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <div className="button-container">
                                        <Button 
                                            onClick={() => {
                                                // Truyền cái data vào trong hàm đây luôn
                                                const data = row;
                                                this.props.updateProduct(data);
                                                this.props.openUpdateModal();
                                            }}
                                            variant="contained"
                                        >
                                            Update
                                        </Button>
                                        <Button 
                                            variant="contained"
                                            onClick={() => this.deleteProduct(row)}
                                        >
                                            Delete
                                            
                                        </Button>
                                    </div>
                                </div>  
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
                : null
            }
            
            </React.Fragment>
        ); 
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        addTypeStatus: state.addTypeStatus,
        infoUser: state.infoUser,
        isAddTypeStatus: state.isAddTypeStatus,
        confirmStatus: state.confirmStatus,
        listProduct: state.listProduct,
        typeProduct: state.typeProduct,
        regulation: state.regulationReducer,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getProductToReducer: (data) => {
            dispatch({
                type: "GET_PRODUCT_AND_TYPE",
                data: data
            });
        },
        updateProduct: (data) => {
            dispatch({type: "UPDATE_GOOD_DATA", data});
        },
        openUpdateModal: (data) => {
            dispatch({ type: "CHANGE_UPDATE_GOOD_STATUS", });
        },
        deleteProductToRedux: (data) => {
            dispatch({
                type: "DELETE_PRODUCT",
                data: data,
            }); 
        },
        showAlert: (message, typeMessage) => {
            dispatch({
                type: "SHOW_ALERT",
                message: message,
                typeMessage: typeMessage,
            })
        },
        hideAlert: () => {
            dispatch({
                type: "HIDE_ALERT",
            })
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles, {withTheme: true}))(GoodRow));