import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import { Container, Grid, Button, CardActionArea, CardActions, CardMedia } from '@mui/material';
import { ComponentToPrint } from './ComponentToPrint';
import '../../css/SellProduct.css'
import Tabs from './Tabs'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import exampleImg from '../../img/good-example.jpg'
import { BiPlusMedical } from 'react-icons/bi';
import { connect } from 'react-redux'

class SellProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        }
    }


    handleChange = (event, newValue) => {
        this.setState({
            value: newValue,
        })
    };

    bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );

    AddProduct = () => {
        console.log("click");
    }

    componentWillMount() {
        document.title = 'Sell Product'
    }

    render() {
        return (
            <div className="sell-product" >
                <Container maxWidth="xl">
                    <Grid container spacing={2}>
                        <Grid item md={8} sm={4}  >
                            <div style={{ borderRadius: '8px', marginTop: '20px', backgroundColor: 'beige', height: 'calc(100vh - 40px)', overflow: 'hidden' }}>
                                <div style={{ overflow: 'hidden', marginBottom: '5px' }}>
                                    <Tabs></Tabs>
                                </div>
                                <Container id="choses-product" style={{ height: '94%', overflowY: 'scroll' }} maxWidth="xl">
                                    <Grid container spacing={2}>
                                        {this.props.listProduct.filter(value => {
                                            if (this.props.chooseTypeProduct === 'all') {
                                                return value;
                                            }
                                            if (value.type === this.props.chooseTypeProduct) {
                                                return value
                                            }
                                        }).map(value => (
                                            <Grid item md={3} sm={3}>
                                                <Card onClick={() => this.AddProduct()}>
                                                    <CardActionArea>
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            image={exampleImg}
                                                            alt="green iguana"
                                                        />
                                                        <CardContent style={{ padding: '5px' }}>
                                                            <Typography style={{ textAlign: 'center' }} gutterBottom variant="h6" component="div">
                                                                {value.description}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                    <CardActions style={{ justifyContent: 'center' }}>
                                                        <Button style={{ color: 'green', fontWeight: '700' }} endIcon={<BiPlusMedical></BiPlusMedical>} size="medium" color="primary">
                                                            {value.price}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Container>
                            </div>
                        </Grid>
                        <Grid item md={4} sm={4} >
                            <div style={{ borderRadius: '8px', marginTop: '20px', backgroundColor: 'beige', height: 'calc(100vh - 40px)', overflow: 'hidden', overflowX: 'hidden' }}>
                                <div id="choses-product" style={{ height: '70%', backgroundColor: 'red', margin: '10px', overflowY: 'scroll' }} >
                                    <Grid sty container spacing={0}>
                                        <Grid item md={12} sm={12}>
                                            <div style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>abc</div>
                                        </Grid>
                                        <Grid item md={12} sm={12}>
                                            <div style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px' }}>abc</div>
                                        </Grid>
                                    </Grid>
                                </div>
                                <ReactToPrint
                                    trigger={() => {
                                        return <a href="#">Print this out!</a>;
                                    }}
                                    content={() => this.componentRef}
                                />
                                <div style={{ display: 'none' }}>
                                    <ComponentToPrint ref={el => (this.componentRef = el)} />
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        listProduct: state.listProduct,
        chooseTypeProduct: state.chooseTypeProduct,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeAddStatus: () => {
            dispatch({
                type: "CHANGE_ADD_STATUS",
            });
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SellProduct);