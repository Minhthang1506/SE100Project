import React from 'react';
import { Typography } from '@mui/material';
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { MdImportExport } from "react-icons/md";

function ProductStatis(props) {
    const typeHeaderDashboard = useSelector(state => state.typeHeaderDashboard);
    const listReciept = useSelector(state => state.listReciept)
    const [totalMoney, setTotalMoney] = React.useState('')
    const listProduct = useSelector(state => state.listProduct.state)
    const [totalImport, setTotalImport] = React.useState('');
    // console.log("listProduct", listProduct);
    let nowTime = new Date()

    React.useEffect(() => {
        let money = 0;
        let currentMonth = nowTime.getMonth() + 1;

        if (typeHeaderDashboard == 'Today') {
            var importProduct = 0;
            for(var i = 0; i < listProduct.length; i++)
            {
                var realDate = listProduct[i]._id.importDate.substring(0,listProduct[i]._id.importDate.indexOf('T'));
                var date = realDate.split('-');
                console.log(date);
                console.log(nowTime.getDate() - 1,currentMonth,nowTime.getFullYear())
                if (date[2] == nowTime.getDate() - 1 && date[1] == currentMonth && date[0] == nowTime.getFullYear()) {
                    importProduct += parseInt(listProduct[i].quantity);
                }
            }
            setTotalImport(importProduct);
            listReciept.map(value => {
                let date = value.date.replace(/\s/g, "");
                date = date.split("/");
                if (date[0] == nowTime.getDate() && date[1] == currentMonth && date[2] == nowTime.getFullYear()) {
                    if(!value.deleted) {
                        money += value.totalFinalMoney
                    }
                }
            })
            setTotalMoney(money)
        } else if (typeHeaderDashboard == 'Yesterday') {
            var importProduct = 0;
            for(var i = 0; i < listProduct.length; i++)
            {
                var realDate = listProduct[i]._id.importDate.substring(0,listProduct[i]._id.importDate.indexOf('T'));
                var date = realDate.split('-');
                console.log(date);
                console.log(nowTime.getDate() - 1,currentMonth,nowTime.getFullYear())
                if (date[2] == nowTime.getDate() - 2 && date[1] == currentMonth && date[0] == nowTime.getFullYear()) {
                    importProduct += parseInt(listProduct[i].quantity);
                }
            }
            setTotalImport(importProduct);
            listReciept.map(value => {
                let date = value.date.replace(/\s/g, "");
                date = date.split("/");
                if (date[0] == nowTime.getDate() - 1 && date[1] == currentMonth && date[2] == nowTime.getFullYear()) {
                    if(!value.deleted){
                        money += value.totalFinalMoney
                    }
                }
            })
            setTotalMoney(money)
        } else if (typeHeaderDashboard == 'Month') {
            var importProduct = 0;
            for(var i = 0; i < listProduct.length; i++)
            {
                var realDate = listProduct[i]._id.importDate.substring(0,listProduct[i]._id.importDate.indexOf('T'));
                var date = realDate.split('-');
                console.log(date);
                console.log(nowTime.getDate() - 1,currentMonth,nowTime.getFullYear())
                if (date[1] == currentMonth && date[0] == nowTime.getFullYear()) {
                    importProduct += parseInt(listProduct[i].quantity);
                }
            }
            setTotalImport(importProduct);
            listReciept.map(value => {
                let date = value.date.replace(/\s/g, "");
                date = date.split("/");
                if (date[1] == currentMonth && date[2] == nowTime.getFullYear()) {
                    if(!value.deleted) {
                        money += value.totalFinalMoney
                    }
                }
            })
            setTotalMoney(money)
        } else if (typeHeaderDashboard == 'Year') {
            var importProduct = 0;
            for(var i = 0; i < listProduct.length; i++)
            {
                var realDate = listProduct[i]._id.importDate.substring(0,listProduct[i]._id.importDate.indexOf('T'));
                var date = realDate.split('-');
                console.log(date);
                console.log(nowTime.getDate() - 1,currentMonth,nowTime.getFullYear())
                if (date[0] == nowTime.getFullYear()) {
                    importProduct += parseInt(listProduct[i].quantity);
                }
            }
            setTotalImport(importProduct);
            listReciept.map(value => {
                let date = value.date.replace(/\s/g, "");
                date = date.split("/");
                if (date[2] == nowTime.getFullYear()) {
                    if(!value.deleted) {
                        money += value.totalFinalMoney
                    }
                }
            })
            setTotalMoney(money)
        } else if (typeHeaderDashboard == 'All') {
            var importProduct = 0;
            for(var i = 0; i < listProduct.length; i++)
            {
                importProduct += parseInt(listProduct[i].quantity);
            }
            setTotalImport(importProduct);

            listReciept.map(value => {
                if(!value.deleted) {
                    money += value.totalFinalMoney
                }
            })
            setTotalMoney(money)
        }
    }, [typeHeaderDashboard])

    return (
        <div className="dashboard-css imported-good">
            <div className="dashboard-item-img imported-good" style={{ marginBottom: '30px' }}>
                <MdImportExport className="dashboard-item-icon imported-good"></MdImportExport>
            </div>
            <Typography style={{ marginBottom: '10px' }} variant="h6">
                {totalImport.toLocaleString()}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                Import Product / Sell Product
            </Typography>
        </div>
    );
}

export default ProductStatis;