import { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import GoodTable from './GoodPartials/GoodTable';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import SearchBar from './GoodPartials/SearchBar';
import {connect} from 'react-redux'
import AddTypeModal from './GoodPartials/AddTypeModal';
import '../css/GoodManager.css';
import ConfirmModal from './GoodPartials/ConfirmModal';
import UpdateGoodModal from './GoodPartials/UpdateGoodModal';
import EditTypeModal from './GoodPartials/EditTypeModal';
import AddGoodModal from './GoodPartials/AddGoodModal';
import axios from 'axios';
import UpdateTypeModal from './GoodPartials/UpdateTypeModal';
import XLSX from 'xlsx';
import excelLogo from './GoodPartials/excelLogo.png';
import { inputAdornmentClasses } from '@material-ui/core';
import GoodTableDisplay from './GoodPartials/GoodTableDisplay';
import ExcelInstruction from './GoodPartials/ExcelInstruction';
import { Container, Grid, Card, CardHeader, Divider, CardContent} from '@mui/material';
import SortByTable from './GoodPartials/SortByTable';
import TypeManager from './GoodPartials/TypeManager';
import { BiPlusMedical, BiEdit } from 'react-icons/bi';
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { BsCardList } from "react-icons/bs";
class GoodManager extends Component {
    constructor(props) {
        super(props);
        this.loadAllType(); 
        this.loadAllGood();
    }

    async loadAllGood() {
        var resultProduct = [];
        const data = {
            token: localStorage.getItem('token'),
            filter: {
                "_id.storeID": this.props.infoUser.email,
            }
        }
        await axios.get(`http://localhost:5000/api/product/`, {
            params: { ...data }
        })
            .then(res => {
                resultProduct = res.data.data;
            })
            .catch(err => {
                console.log(err);
                this.props.hideAlert();
                this.props.showAlert("Something happened, restart and try again","warning");
            })
        // Get h???t t??? c??i productjoinType
        var result = [];
        const data1 = {
            token: localStorage.getItem('token'),
            filter: {
                "_id.storeID": this.props.infoUser.email,
            }   
        }
        await axios.get(`http://localhost:5000/api/product/join`, {
            params: { ...data1 }
        })
            .then(res => {
                result = res.data.data;
                localStorage.getItem('token', res.data.token);
            })
            .catch(err => {
                console.log(err);
                this.props.hideAlert();
                this.props.showAlert("Something happened, restart and try again","warning");
            })
        // L???y c??c c??i jointype
        var joinTypeInfor = [];
        for (let i = 0; i < result.length; i++) {
            joinTypeInfor.push(result[i]);
        }
        // console.log("joinTypeInfor", joinTypeInfor);

        var listProductInfor = [];
        for (let i = 0; i < resultProduct.length; i++) {
            var typeIDList = [];
            var joinType = '';
            for (var j = 0; j < joinTypeInfor.length; j++) {
                if (resultProduct[i]._id.productID && joinTypeInfor[j]._id.productID &&
                    resultProduct[i]._id.productID === joinTypeInfor[j]._id.productID) 
                {
                    typeIDList.push(joinTypeInfor[j]._id.typeID);
                    joinType = joinType + ' ' + this.getTypeNamebyTypeID(joinTypeInfor[j]._id.typeID);
                }
            }

            listProductInfor.push(
                {
                    ...resultProduct[i],
                    typeIDList: typeIDList,
                    joinType: joinType
                });
        }
        this.props.getProductToReducer(listProductInfor);
    }

    getTypeNamebyTypeID (typeID) {
        var typeName="Null";
        for(var i = 0; i < this.props.typeProduct.length;i++)
        {   
            if(this.props.typeProduct[i]._id.typeID == typeID)
            {
                typeName = this.props.typeProduct[i].name;
                break;
            }
        }
        return typeName;
    }

    async loadAllType() {
        var result = [];
        const data = {
            token: localStorage.getItem('token'),
            filter: {

                "_id.storeID": this.props.infoUser.email,
            }   
        }

        await axios.get(`http://localhost:5000/api/product/type`, 
        {
            params: {...data}
        })
            .then(res => {
                result = res.data.data;
            })
            .catch(err => {
                console.log('bug when get types', err);
                this.props.hideAlert();
				this.props.showAlert("Something happened, restart and try again","warning");
            })
        this.props.getProductType(result);
    }
    handleAdd() {
        this.props.changeAddTypeStatus();
        this.props.setAddTypeStatus();
    }
    handleConfirm(){
        this.props.changeConfirmStatus();
        this.props.unsetDelete();
    }
    handleConfirmDelete(){
        this.props.changeConfirmStatus();
        this.props.setDeleteConfirm();
    }
    handleUpdateGood() {
        this.props.changeUpdateGoodStatus();
    }
    handleEditType() {
        this.props.changeEditTypeStatus();
    }

    componentWillMount() {
        document.title = 'Product Manager'
    }   

    uploadExcel(e){
        e.preventDefault();
        var f;
        try {
            // console.log("e", e.target.files[0]);
            f = e.target.files[0];
        }
        catch(e) {
            console.log(e);
            return;
        } 

        var name = f.name;
        const reader = new FileReader();
        var dataExcel;
        // Ch??? n??y ?????c file excel g?? ????, gi??? x??? l?? c??i data l???y ra th??i
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_csv(ws, {header:1});
            // console.log("data", data);
            dataExcel = data;
            this.handleExcelData(dataExcel);
        };
        reader.readAsBinaryString(f);
        // Reset t??n file m???i khi ?????c
        document.querySelector('#upload-excel').value = '';

        
    }

    handleExcelData(excelData) {
        // chia c??c c???t theo row
        var rows = excelData.split('\n');
        console.log("N???i dung file", rows);
        if(rows.length  <= 2)
        {
            this.props.hideAlert();
			this.props.showAlert("The file is invalid because it doesn't has header and data!","warning");
            return false;
        }
        // X??? l?? c??c th??ng tin ??? tr?????ng header
        var rowSample=
            ["Product ID","Name","Quantity","Unit","Expired Date",
            "Currency","Original Price","SellPrice","ProductType"];
        var rowSplit = rows[0].split(',');
        if(rowSample.length != rowSplit.length)
        {
            this.props.hideAlert();
			this.props.showAlert("The header is invalid. It is different from the template or has data out of the table!","warning");   
            return false;
        }
        for(var i = 0 ; i < rowSample.length ; i++)
        {
            if(rowSample[i] != rowSplit[i]) {
                this.props.hideAlert();
				this.props.showAlert("the header is different from the template","warning");
                return false;
            }
        }
        var columnName = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        var allRows = [];
        // X??? l?? l???n l?????t c??c d??? li???u ??? t???ng ??.
        for(var i2 = 1; i2 < rows.length - 1; i2++)
        {
            var dataRows = rows[i2].split(',');
            if(dataRows.length < 9)
            {
                this.props.hideAlert();
				this.props.showAlert("The line " + (i2+1) + ' in the excel file is lack of data' ,"warning");
                return false;
            }

            if(dataRows.length > 9)
            {
                this.props.hideAlert();
				this.props.showAlert("The line " + (i2+1) + ' in the excel file is has more data than the template or has the cell contains ","' ,"warning");
                return false;
            }
            for(var j = 0; j < dataRows.length; j++)
            {
                if(dataRows[j]=='')
                {
                    this.props.hideAlert();
				    this.props.showAlert("The line " + (i2+1) + ' with column ' + columnName[j] +' in the excel file is '+
                    +'lack of data' ,"warning");
                    return false;
                }
            }
            // L???y d??? li???u ???? c?? t???o th??nh object v?? b???t ?????u check xong constraint
            var newRow = {
                name: dataRows[1],
                quantity: dataRows[2],
                unit: dataRows[3],
                expiredDate: dataRows[4],
                currency: dataRows[5],
                originalPrice: dataRows[6],
                sellPrice: dataRows[7],
                productTypeName: dataRows[8]
            }
            // Check c??c constraint v?? quy ?????nh ??? ????y tr?????c khi add v??o listObject
            if(this.checkConstraintOfExcelObject(newRow, i2) == false) return false;
            if(this.checkRegulationOfExcelObject(newRow, i2) == false) return false;
            allRows.push(newRow);
            
        } 
        
        console.log("T???t c??? d??? li???u", allRows);
        // X??? l?? sau khi ???? l???y ???????c c??c excel Object
        this.addProductsFromExcel(allRows);
    }

    checkAllNumber(stringToCheck)
    {
        var number=[1,2,3,4,5,6,7,8,9,0];
        for(var i = 0; i < stringToCheck.length ; i++)
        {
            var isFound = false;
            for(var j = 0; j < number.length ;j++)
            {
                if(number[j]==stringToCheck[i])
                {
                    isFound = true;
                    break;
                }
            }
            if(!isFound) return false; 
        }
        return true;
    }

    checkAllDoubleNumber(stringToCheck) {
        var number=['1','2','3','4','5','6','7','8','9','0','.'];
        for(var i = 0; i < stringToCheck.length ; i++)
        {
            var isFound = false;
            for(var j = 0; j < number.length ;j++)
            {
                if(number[j]==stringToCheck[i])
                {
                    isFound = true;
                    break;
                }
            }
            if(!isFound) return false; 
        }
        return true;
    }

    isLeafYear(year) {
        if(year % 400 == 0) return true;
        if(year % 100 == 0) return false;
        if(year % 4 == 0) return true;
        else return false;
    }

    toDateString(dateStringToConvert)
    {
        var days = dateStringToConvert.split('/');
        if(days.length !=3) return "";
        // Check m???t s??? c??i ??i???u ki???n v??? th??ng
        if(!this.checkAllNumber(days[0]) || parseInt(days[0]) > 12 || parseInt(days[0]) < 1 )
        {
            return "";
        } 
        // Check m???t s??? ??i???u ki???n v??? n??m
        if(!this.checkAllNumber(days[2]) || parseInt(days[2]) <= 0 )
        {
            return "";
        }
        // Check c??c ??i???u ki???n v??? ng??y 
        var dayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if(parseInt(days[0]) < 1 || parseInt(days[0]) > 31)
        {
            return "";
        }
        var dayOfCurrrentMonth = dayInMonth[parseInt(days[0])];
        if(parseInt(days[0]) == 2)
        {
            if(this.isLeafYear(parseInt(days[2])))
            {
                dayOfCurrrentMonth = 29;
            }
        }
        if(parseInt(days[0]) > dayOfCurrrentMonth)
        {
            return "";
        }
        // N??y l?? tr?????ng h???p l?? t?????ng nh???t lu??n r???i
        return '20' + days[2] + '-' + days[0] + '-' + days[1]; 
    }

    checkConstraintOfExcelObject(newRow, index) {
        // check quantity
        try {
            if(parseInt(newRow.quantity) <= 0 || this.checkAllNumber(newRow.quantity)==false)
            {
                this.props.hideAlert();
				this.props.showAlert("The number of product in line "+ (index + 1) +" is invalid","warning");
                return false;
            }
        }
        catch(e)
        {
            this.props.hideAlert();
			this.props.showAlert("The number of product in line "+ (index + 1) +" is invalid","warning");
            return false;
        }

        try {
            if(parseFloat(newRow.originalPrice) <= 0 || this.checkAllDoubleNumber(newRow.originalPrice)==false)
            {
                this.props.hideAlert();
			    this.props.showAlert("Import price of product in line "+ (index + 1) +" is invalid","warning");
            }

        }
        catch (e){
            this.props.hideAlert();
			this.props.showAlert("Import price of product in line "+ (index + 1) +" is invalid","warning");
            return false;
        }

        try {
            if(parseFloat(newRow.sellPrice) <= 0 || this.checkAllDoubleNumber(newRow.sellPrice)==false)
            {
                this.props.hideAlert();
			    this.props.showAlert("Sell price of product in line "+ (index + 1) +" is invalid","warning");
                return false;
            }

        }
        catch (e){
            this.props.hideAlert();
            this.props.showAlert("Sell price of product in line "+ (index + 1) +" is invalid","warning");
            return false;
        }

        try {
            if(this.toDateString(newRow.expiredDate)=="")
            {
                this.props.hideAlert();
                this.props.showAlert("Expired day of product in line "+ (index + 1) +" is invalid","warning");
                return false;
            }
        }
        catch(e)
        {
            this.props.hideAlert();
            this.props.showAlert("Expired day of product in line "+ (index + 1) +" is invalid","warning");
            return false;
        }
        // Check ng??y h???t h???n l???n h??n ng??y nh???p l?? ng??y hi???n t???i
        try{
            // console.log("In th??? ng??y hi???n t???i", new Date().getTime())
            if(new Date().getTime() - new Date(this.toDateString(newRow.expiredDate)).getTime() >=0)
            {
                this.props.hideAlert();
                this.props.showAlert("Expired day of product in line "+ (index + 1) +" must be greater than the import day","warning");
                return false;
            }
        }
        catch(e) {
            this.props.hideAlert();
            this.props.showAlert("Expired day of product in line "+ (index + 1) +" must be greater than the import day","warning");
            return false;
        }
        // Check gi?? g???c ph???i nh??? h??n gi?? b??n
        if ( parseFloat(newRow.sellPrice) - parseFloat(newRow.originalPrice) <=0.0) 
        {
            this.props.hideAlert();
            this.props.showAlert("Sell price of product in line "+ (index + 1) +" must be greater than the import price","warning");
            return false;
        }
        // Check c??i ????n v??? ti???n
        if ( newRow.currency != '$' && newRow.currency !='VN??') 
        {
            this.props.hideAlert();
            this.props.showAlert("Currency of product in line "+ (index + 1) +" must be either '$' or 'VN??'","warning");
            return false;
        }
        // Check xong h???t c??c constraint;
        return true;
    }

    calculateDay(dateString1, dateString2)
    {
        return (
            (new Date(dateString1)).setHours(0, 0, 0) 
                - 
            (new Date(dateString2)).setHours(0,0,0)
            )
            /(1000 * 60 * 60 * 24);
    }

    getCurrentDateTimeString()
    {
        var currentDate = new Date();
        var day = (currentDate.toString().split(' '))[2];
        if(day.length < 2)
        {
            day = '0' + day;
        }
        var month = (new Date().getMonth() + 1).toString();
        if(month.length<2)
        {
            month = '0' + month;
        }
        return new Date().getFullYear() + '-' + month + '-' + day;
    }

    checkRegulationOfExcelObject(newRow, index) {
        if(Object.keys(this.props.regulation).length == 0) return true;
        try {
            if(
                this.props.regulation.minExpiredProduct > 
                this.calculateDay(this.toDateString(newRow.expiredDate), this.getCurrentDateTimeString())
            )
            {
                this.props.hideAlert();
				this.props.showAlert('The expiration date in line '  + (index+1) 
                + ' must be at least ' +this.props.regulation.minExpiredProduct + ' day(s) older than the import date',"warning");
                return false;
            }
        }
        catch(e){
            this.props.hideAlert();
			this.props.showAlert("Some error happened in checking regulation of import day and expire day","warning");
            return false;
        }
        return true;
    }

    // Th??m c??c s???n ph???m v??o c?? s??? d??? li???u:
    addProductsFromExcel(excelObject){ 
        var allTypes = [];
        var allProducts = [];
        var allJoins = [];

        var allProductsforRedux = [];
        // ID b???t ?????u ????nh ??? ????y:
        var genIDProductStart = 0;
        var listProductInfor = this.props.listProduct.state;
        if(listProductInfor.length > 0)
        {
            genIDProductStart = parseInt(listProductInfor[listProductInfor.length-1]._id.productID) + 1;
        } 
        
        var currentgenIDTypeStart = 0;
        var listTypeInfor = this.props.typeProduct;
        console.log("listTypeInfor", listTypeInfor);
        if(listTypeInfor.length>0)
        {
            currentgenIDTypeStart = parseInt(listTypeInfor[listTypeInfor.length-1]._id.typeID) + 1;
        } 

        var excecuteListType = [];
        // Ch???y t???ng c??i object ????? t???o c??i product, c??i type v?? c??i join
        for(var i = 0; i < excelObject.length; i++)
        {
            // T??ch ri??ng t???ng c??i product
            var currentProduct = {
                _id: {
                    productID: genIDProductStart + i,
                    importDate: this.getCurrentDateTimeString(),
                    storeID: this.props.infoUser.email,
                },
                name: excelObject[i].name,
                quantity: excelObject[i].quantity,
                remain: excelObject[i].quantity,
                importPrice: (excelObject[i].currency == 'VN??') ?
                    excelObject[i].originalPrice :
                    excelObject[i].originalPrice * this.props.regulation.exchangeRate,
                sellPrice: (excelObject[i].currency == 'VN??') ?
                    excelObject[i].sellPrice :
                    excelObject[i].sellPrice * this.props.regulation.exchangeRate,
                expires: this.toDateString(excelObject[i].expiredDate),
                imgUrl: 'none',
                unit: excelObject[i].unit,
            }
            allProducts.push(currentProduct);
            // T??ch ri??ng t???ng c??i type c???a c??i currentProduct
            var currentTypes = excelObject[i].productTypeName.split(' || ');
            // console.log("currentTypes", currentTypes)

            // T??m ki???m c??c c??i trong listTypeInfor v?? trong c??i executeListType
            var currentProductRedux = currentProduct;
            var typeIDList = [];

            for(var k = 0; k < currentTypes.length ; k ++)
            {
                var indexFound = -1;
                // T??m ki???m trong c??c lo???i c?? s???n
                for(var j = 0 ; j < listTypeInfor.length; j++)
                {
                    if(currentTypes[k] == listTypeInfor[j].name)
                    {
                        indexFound = listTypeInfor[j]._id.typeID;
                        break;
                    }
                }
                if(indexFound != -1)
                {
                    // T???o m???t c??i object join ????? th??m v??o c??i c?? s???n
                    var currentproductJoinType = {
                        _id : {
                            productID: genIDProductStart + i,
                            typeID: indexFound, 
                            importDate: this.getCurrentDateTimeString(),
                            storeID: this.props.infoUser.email,
                        }
                    }
                    allJoins.push(currentproductJoinType);

                    typeIDList.push(indexFound);
                }
                else 
                {
                    var indexExecFound = -1;
                    for(var l =0 ; l < excecuteListType.length ; l++)
                    {
                        if(currentTypes[k] == excecuteListType[l].name)
                        {
                            indexExecFound = excecuteListType[l]._id.typeID;
                        }
                    }
                    if(indexExecFound != -1)
                    {
                        var currentproductJoinType = {
                            _id : {
                                productID: genIDProductStart + i,
                                typeID: indexExecFound, 
                                importDate: this.getCurrentDateTimeString(),
                                storeID: this.props.infoUser.email,
                            }
                        }
                        allJoins.push(currentproductJoinType);

                        typeIDList.push(indexExecFound);
                    }
                    // N???u nh?? kh??ng t??m th???y trong c??? hai c??i th?? ph???i th??m th??i
                    else 
                    {
                        // Th??m c??c c??i m??nh s??? add v??o csdl ??? ????y
                        var newTypeToAdd = {
                            _id:{
                                typeID: currentgenIDTypeStart,
                                storeID: this.props.infoUser.email,
                            },
                            name: currentTypes[k],
                        }
                        allTypes.push(newTypeToAdd);
                        
                        // Sau ???? s??? th??m v??o c??i c??i join ??? ????y
                        var currentproductJoinType = {
                            _id : {
                                productID: genIDProductStart + i,
                                typeID: currentgenIDTypeStart, 
                                importDate: this.getCurrentDateTimeString(),
                                storeID: this.props.infoUser.email,
                            }
                        }
                        allJoins.push(currentproductJoinType);

                        typeIDList.push(currentgenIDTypeStart);
                        // C???ng th??m ????? l???y ID cho c??c c??i sau n??y
                        currentgenIDTypeStart ++;
                    }
                }
            }
            
            // Th??m v??o redux
            var currentProductRedux2 = {
                ...currentProductRedux,
                typeIDList: typeIDList,
            }
            allProductsforRedux.push(currentProductRedux2);
        }
        console.log("allProducts", allProducts);
        console.log("allTypes", allTypes);
        console.log("allJoins", allJoins);
        // var allTypes = [];
        // var allProducts = [];
        // var allJoins = [];

        // L???y ???????c ok r???i, gi??? th?? th??m t???ng c??i v??o c?? s??? d??? li???u th??i
        // Th??m th??? t???t c??? s???n ph???m v??o csdl xem sao 

        var dataProduct = {
            token: localStorage.getItem('token'),
            products: [...allProducts ]
        }
        axios.post(`http://localhost:5000/api/product/import`, dataProduct)
            .then(res => {
                console.log("Save success");
            })
            .catch(err => {
                this.props.hideAlert();
				this.props.showAlert("Something happened, restart and try again","warning");
                console.log("Bug when add dataProduct", err);
            })

        
        for(var m = 0 ; m < allTypes.length ; m++)
        {
            const dataType = {
                token: localStorage.getItem('token'),
                productType: {
                    ...allTypes[m]
                }    
            }
            axios.post(`http://localhost:5000/api/product/type`, dataType)
            .then(res => {
                
            })
            .catch(err => {
                this.props.hideAlert();
				this.props.showAlert("Something happened, restart and try again","warning");
                console.log('bug when add types',err)
            })
            // C???p nh???t type v??o redux
            this.props.addTypeToReducer(dataType.productType);
        }      

        for(var m = 0 ; m < allJoins.length ; m++)
        {
            const dataJoin = {
                token: localStorage.getItem('token'),
                productJoinType: {
                    ...allJoins[m]
                }  
            }
            axios.post(`http://localhost:5000/api/product/join`, dataJoin)
                .then(res => {
                    
                })
                .catch(err => {
                    console.log(err);
                })
        }
        console.log("l??u v?? b???ng join th??nh c??ng");
        // C???p nh???t c??c s???n ph???m v?? joinType v??o redux:
        for(var m = 0; m < allProductsforRedux.length ;m++)
        {
            this.props.addProductToRedux(allProductsforRedux[m]);
        }
        this.props.hideAlert();
		this.props.showAlert("Add products from excel file success","success");
    }

    render() {
        return (
            <div id="scroll-bar" style={{overflow: 'auto', height:'100vh'}}>
                <div style={{ width: '100%', marginTop: '40px', marginBottom: '40px', paddingBottom: '40px' }}>
                    <Container style={{ marginBottom: '20px', marginTop: '20px' }} maxWidth="xl">
                        <Grid className="profile-body" container spacing={2}>
                            <Grid item  lg={3} md={12} sm={12}>
                                <Grid container spacing={2}>
                                    {/* <Grid item md={12} sm={12}>
                                        <SortByTable></SortByTable>
                                    </Grid> */}
                                    <Grid item md={12} sm={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={12} sm={12}  >
                                                <Card>
                                                    <CardHeader style={{ height: 56, color: !this.props.darkmode ? '#0091ea' :'white', backgroundColor: !this.props.darkmode ? '#efeeef' :'#455a64'}} title="Import Manager" />
                                                    <Divider></Divider>
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12} sm={12}>
                                                                <Button variant="contained" style={{height: 40, width: '100%'}}>
                                                                    <Button style={{color: '#fff', textDecoration: 'none', height: 43}} onClick={() => this.props.changeStatusAddGood()}>
                                                                        <BiPlusMedical color={'white'} size={16} style={{marginRight: 4}}/>
                                                                        Add product
                                                                    </Button>
                                                                </Button>
                                                            </Grid>
                                                            
                                                            <Grid item md={12} sm={12} style={{justifyContent:'space-between'}}>
                                                                <label 
                                                                    className='excel-instruction'
                                                                    style={{ width:'100%' ,backgroundColor: '#31be7d', padding: '4px 8px',borderRadius: 4, lineHeight: 2.0, color:'#fff', display: 'flex', alignItems:'center', justifyContent:'center'}} 
                                                                    for="upload-excel"
                                                                >
                                                                    <img src={excelLogo} width={18} height={18} style={{marginRight: 2}}></img>
                                                                    <label for="upload-excel" className='excel-instruction' style={{fontSize: 15, display: 'block'}}>IMPORT EXCEL</label>
                                                                </label>
                                                                <input 
                                                                    id="upload-excel" type="file" style={{display: 'none'}} 
                                                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                                                                    onChange={(e) => this.uploadExcel(e)}
                                                                ></input>
                                                            </Grid>
                                                            
                                                            <Grid item md={12} sm={12}>
                                                                <Button style={{ backgroundColor: 'yellowgreen', width:'100%' }}  onClick={() => this.props.changeExcelInstruction()} variant="contained">
                                                                    <BsCardList color={'white'} size={16} style={{marginRight: 4}}></BsCardList>
                                                                    Excel Instruction
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12} sm={12}>
                                        <TypeManager></TypeManager>
                                    </Grid>
                                    
                                </Grid>
                            </Grid>
                            <Grid item  lg={9} md={12} sm={12}>
                                <GoodTableDisplay/>
                            </Grid>
                        </Grid>
                    </Container>
                    {/* ????y l?? ph???n modal */}

                    {this.props.addTypeStatus ? (
                        <div className="modal-add">
                            <div onClick={() => {this.props.changeAddTypeStatus();}} className="modal-overlay"></div>
                            <AddTypeModal></AddTypeModal>
                        </div>
                    ): null}
                    {this.props.confirmStatus ? (
                        <div className="modal-add">
                            <div onClick={() => {this.props.changeConfirmStatus();}} className="modal-overlay"></div>
                            <ConfirmModal></ConfirmModal>
                        </div>
                    ): null}
                    {this.props.updateGoodStatus ? (
                        <div 
                            className="modal-add"
                        >
                            <div onClick={() => {this.props.changeUpdateGoodStatus();}} className="modal-overlay"></div>
                            <UpdateGoodModal
                                style={{
                                    marginTop: 0
                                }}
                            >
                            </UpdateGoodModal>
                        </div>
                    ): null}
                     {this.props.editTypeStatus ? (
                        <div className="modal-add">
                            <div onClick={() => {this.props.changeEditTypeStatus();}} className="modal-overlay"></div>
                            <EditTypeModal></EditTypeModal>
                        </div>
                    ): null}
                    {/* {this.props.editTypeStatus ? (
                        <div className="modal-add">
                            <div onClick={() => {this.props.changeEditTypeStatus();}} className="modal-overlay"></div>
                            <EditTypeModal></EditTypeModal>
                        </div>
                    ): null} */}
                    {this.props.statusAddGood ? (
                        <div className="modal-add">
                            <div onClick={() => {this.props.changeStatusAddGood();}} className="modal-overlay"></div>
                            <AddGoodModal></AddGoodModal>
                        </div>
                    ): null}
                    {this.props.statusUpdateType ? (
                        <div className="modal-add">
                            <div onClick={() => {this.props.changeStatusUpdateType();}} className="modal-overlay"></div>
                            <UpdateTypeModal></UpdateTypeModal>
                        </div>
                    ): null}
                    {this.props.excelInstructionStatus ? (
                        <div className="modal-add">
                            <div onClick={() => {this.props.changeExcelInstruction();}} className="modal-overlay"></div>
                            <ExcelInstruction></ExcelInstruction>
                        </div>
                    ): null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        addTypeStatus: state.addTypeStatus,
        confirmStatus: state.confirmStatus,
        deleteStatus: state.deleteStatus,
        updateGoodStatus: state.updateGoodStatus,
        editTypeStatus: state.editTypeStatus,
        isAddTypeStatus: state.isAddTypeStatus,
        statusAddGood: state.statusAddGood,
        infoUser: state.infoUser,
        statusUpdateType: state.statusUpdateType,
        typeProduct: state.typeProduct,
        regulation: state.regulationReducer,
        listProduct: state.listProduct,
        excelInstructionStatus: state.excelInstructionStatus,
        darkmode: state.statusDarkmode,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeAddTypeStatus: () => {
            dispatch({
                type: "CHANGE_ADD_TYPE_STATUS",
            });
        },
        changeConfirmStatus: () => {
            dispatch({
                type: "CHANGE_CONFIRM_STATUS",
            });
        },
        unsetDelete: () => {
            dispatch({
                type: "UNSET_DELETE_STATUS",
            })
        },
        changeUpdateGoodStatus: () => {
            dispatch({
                type: "CHANGE_UPDATE_GOOD_STATUS",
            })
        },
        changeEditTypeStatus: () => {
            dispatch({
                type: "CHANGE_EDIT_TYPE_STATUS",
            })
        },
        setAddTypeStatus: () => {
            dispatch({
                type: "SET_ADD_TYPE_STATUS",
            });
        },
        setDeleteConfirm: () => {
            dispatch({
                type: "SET_CONFIRM_DELETE_GOOD",
            }); 
        },
        changeStatusAddGood: () => {
            dispatch({
                type: "CHANGE_ADD_GOOD_STATUS",
            }); 
        },
        getProductType: (data) => {
            dispatch({
                type: "GET_PRODUCT_TYPE",
                data: data
            });
        },
        changeStatusUpdateType: () => {
            dispatch({
                type: "CHANGE_UPDATE_TYPE_STATUS",
            }); 
        },
        getProductToReducer: (data) => {
            dispatch({
                type: "GET_PRODUCT_AND_TYPE",
                data: data
            });
        },
        addTypeToReducer: (data) => {
            dispatch({
                type: "ADD_TYPE",
                data: data,
            });
        },
        addProductToRedux: (data) => {
            dispatch({
                type: "ADD_PRODUCT",
                data: data,
            }); 
        },
        changeExcelInstruction: () => {
            dispatch({
                type: "CHANGE_EXCEL_INSTRUCTION_STATUS",
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
export default connect(mapStateToProps , mapDispatchToProps)(GoodManager);
