import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import CircularProgress from '@material-ui/core/CircularProgress';
import MaterialTable from 'react-data-table-component';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { flash_alert } from 'components/App';

function AddSparePartDialog(props){
    const {t} = useTranslation();
	const [open, setOpen] = useState(false);

    const [quantity, setQuantity] = useState("");
    const [requested_quantity, setRequestedQuantity] = useState("");
    const [from, setFrom] = useState("");
    
    useEffect(() => {
		setQuantity(props.quantity)
	},[props.quantity]);

	useEffect(() => {
		setRequestedQuantity(props.requested_quantity)
	},[props.requested_quantity]);

	useEffect(() => {
		setFrom(props.from)
		if(props.from == "request"){
			setQuantity(props.requested_quantity)
		}
	},[props.from]);


	function handleClickOpen(e){
		e.preventDefault();
		setOpen(true);
	}

	function handleClose(e){
		e.preventDefault();
		setOpen(false);
	}

	async  function handleAddSparePart(e){
        console.log("agregando productos al cliente");
        if(props.selectedSparePartsRows.length > 0){
            console.log(props.selectedSparePartsRows)
            var body = new FormData();
			
			body.set('customer_product_id', props.customer_product_id);
            body.set('status', props.status);
            body.set('products', props.selectedSparePartsRows.map(function(product) {
                return product.id;
            }))
            return axios.post(`/api/v1/quotations/${props.quotation_id}/create_spare_part`, body, { headers: props.headers})
                .then(response => {
                    flash_alert("", t('services.serviceSparePartsRequest.flashAlert.addSpareParts') , "success")
					props.handleClear();
					props.callbacks();
					setOpen(false);
                })
            .catch(e => {
                console.log(e.response.data);
                if(e.response.data){
                    flash_alert(t('globalText.error'), e.response.data[0][1], "danger")
                    
                }
            });
        }else{
            flash_alert("", t('services.serviceSparePartsRequest.flashAlert.requestSparepart') , "error")
        }
    }
	
	function handleQuantity(e){
		if(e.target.value < 1 || e.target.value > 99){
			flash_alert(t('globalText.error'), t('services.serviceSparePartsRequest.flashAlert.quantityAlert'), "danger")
		}
		else{
			setQuantity(e.target.value)
			setRequestedQuantity(e.target.value)
		}
	}

	return (
		<React.Fragment>
		  <Link href="#" id={"addspareparts_"+props.customer_id} className="mdl-navigation__link brand-primary-link sparepart-edit-link  mg-r-15" onClick={handleClickOpen}><i className="material-icons material-icons-20">add</i> {t('services.quotes.detailsTab.addSpareParts')} </Link>
		  <Dialog
			open={open}
			fullWidth={true}
            maxWidth={"lg"}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title" className="add-sparepart-dialog-title">{`Agregar refaccion a ${props.name} ${props.tnr}`}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
				<Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Box component="span" display={props.displayProducTable} p={0} m={0} bgcolor="background.paper">
                        <Grid container spacing={1} direction="row" justify="flex-start" alignItems="center">
                            <FormControl variant="outlined" fullWidth>
                            <InputLabel className="white-bg padding-sides-5 table-search-label"  htmlFor="search">{t('globalText.filterfor')}</InputLabel>
                            <OutlinedInput
                                id="search"
                                type= "text"
                                className="table-search-input"
                                value={props.filterText}
                                onChange={props.changeFilterText}
                                endAdornment={
                                    <InputAdornment className="table-search-end" position="end" >
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={props.handleClear}
                                            >
                                        {<Close />}
                                        </IconButton>
                                    
                                    </InputAdornment>
                                }
                                />
                            </FormControl>
                        </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={1} direction="row" justify="flex-end" alignItems="center">
                            <Box component="span" display={props.displayProducTable} p={0} m={0} bgcolor="background.paper">
                                <Button variant="contained" id="add-customer-product" onClick={(e) => handleAddSparePart()} color="primary">
                                    {t('services.serviceSparePartsRequest.addSparePartButton')}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Box component="span" display={props.displayProducTable} p={0} m={0} bgcolor="background.paper">
                            <MaterialTable
                                noHeader={true}
                                columns={props.products_columns}
                                data={props.products}
                                progressPending={props.userLoading}
                                progressComponent={<CircularProgress size={75} />}
                                pagination
                                paginationServer
                                responsive={true}
                                onChangeRowsPerPage={props.handleProductsPerRowsChange}
                                onChangePage={props.handleProductsPageChange}
                                onSelectedRowsChange={props.handleProductRowChange}
                                paginationTotalRows={props.total}
                                highlightOnHover={true}
                                striped={true}
                                selectableRows
                                selectableRowsComponent={Checkbox}
                                selectableRowsComponentProps={{ className: "product-checkbox", color: "primary" }}
                                contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                                highlightOnHover={true}
                                striped={true}
                                noDataComponent={t('globalText.NoDataComponent')}
                                paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                            />
                        
                        </Box>
                    </Grid>
				</Grid>  
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={(e) => handleClose(e)} color="primary">
                {t('services.serviceSparePartsRequest.close')}
		      </Button>
		      <Button onClick={(e) => handleAddSparePart() } id="product-update"  variant="contained" color="primary" autoFocus>
                {t('services.serviceSparePartsRequest.addSparePartButton')}
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
  customers: state => state.customers
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(AddSparePartDialog)
