import React from 'react';
import { Grid, Card, CardHeader, Divider, CardContent, Box, Modal, Button } from '@mui/material';
import { red, blue , lightBlue } from '@mui/material/colors';
import { CgDanger } from 'react-icons/cg'
import { useSelector, useDispatch } from 'react-redux'

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
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Grid container spacing={2}>
            <Grid item md={12} sm={12}  >
                <Card>
                    <CardHeader style={{ color: !darkmode ? '#0091ea' :'white', backgroundColor: !darkmode ? '#efeeef' :'#455a64'}} title="Control" />
                    <Divider></Divider>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12}  >
                                <Button style={{ width: '100%', backgroundColor: blue[600], color: 'white' }} size='medium'>Select All</Button>
                            </Grid>
                            <Grid item md={12} sm={12}  >
                                <Button style={{ width: '100%', backgroundColor: red[400], color: 'white' }} size='medium'>
                                    <CgDanger style={{ fontSize: '1.6rem', paddingRight: '5px' }}></CgDanger>
                                    Delete Selected
                                </Button>
                            </Grid>
                            <Grid item md={12} sm={12}  >
                                <Button style={{ width: '100%', backgroundColor: red[400], color: 'white' }} size='medium'>
                                    <CgDanger style={{ fontSize: '1.6rem', paddingRight: '5px' }}></CgDanger>
                                    Delete deleted invoice
                                </Button>
                            </Grid>
                            <Grid item md={12} sm={12}  >
                                <Button onClick={handleOpen} style={{ width: '100%', backgroundColor: red[600], color: 'white' }} size='medium'>
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
                    <h2 style={{textAlign:'center'}} id="parent-modal-title">Are you sure to delete them all?</h2>
                    <Grid  container spacing={2}>
                        <Grid style={{ justifyContent: 'center', display: 'flex' }} item md={6} sm={6}  >
                            <Button style={{color: 'white', backgroundColor: red[500]}}>DELETE</Button>
                        </Grid>
                        <Grid style={{ justifyContent: 'center', display: 'flex' }}  item md={6} sm={6}  >
                            <Button onClick={() => setOpen(false)} style={{ backgroundColor: lightBlue[100]}}>CANCEL</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Grid>
    );
}

export default ControlReciept;