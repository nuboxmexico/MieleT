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
import {csrf, headers, money_format, date_event_format, date_format_without_time, date_without_time_and_zone, date_difference_in_hours, api_token, site_url} from "constants/csrf"
import { useTranslation } from 'react-i18next';

// Dates
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { flash_alert } from 'components/App';
const EDIT_CUSTOMER_PRODUCT = "EDIT_CUSTOMER_PRODUCT";
const EDITED_CUSTOMER_PRODUCT = "EDITED_CUSTOMER_PRODUCT";

function editCustomerProduct(customer_id, customer_product_id, id, tnr, business_unit, family, subfamily, specific, product_name, discontinued, instalation_date, warranty, headers) {
   return (dispatch) => {
		dispatch({type: EDIT_CUSTOMER_PRODUCT});
		var body = new FormData(); 
		body.set('customer_product_id', customer_product_id);
		body.set('id', id);
		body.set('tnr', tnr);
		body.set('business_unit', business_unit);
		body.set('family', family);
		body.set('subfamily', subfamily);
		body.set('specific', specific);
		body.set('product_name', product_name);
		body.set('discontinued', discontinued);
		body.set('instalation_date', instalation_date);
		body.set('warranty', warranty);
		
        return axios.patch(`/api/v1/customers/${customer_id}/update_product`, body, { headers: headers})
	  	.then(response => {
	  		flash_alert("Actualizado!", "Producto se ha actualizado correctamente", "success")
            dispatch({type: EDITED_CUSTOMER_PRODUCT, response});
	  	})
	    .catch(e => {
	    	flash_alert("Error!", "No se ha podido actualizar el producto", "danger")
	        console.log(e);
		});
	};
};


function EditCustomerProductDialog(props){
	const {t} = useTranslation();
	const [open, setOpen] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);
	
/*
	TNR (tnr)
	ID (id)
	Business Unit (business_unit)
	Familia (family)
	Sub-familia (subfamily)
	Específico (specific)
	Nombre (product_name)
*/
	const [tnr, setTnr] = useState("");
	const [id, setId] = useState("");
	const [business_unit, setBusinessUnit] = useState("");
	const [family, setFamily] = useState("");
	const [subfamily, setSubFamily] = useState("");
	const [specific, setSpecific] = useState("");
	const [product_name, setProductName] = useState("");
	const [discontinued, setDiscontinued] = useState(false);
	const [instalation_date, setInstalationDate] = useState(null);
	const [instalation_date_changed, setInstalationDateChanged] = useState(false);
	const [warranty, setWarranty] = useState(new Date());
	
	useEffect(() => {
		setId(props.id)
	},[props.id]);

	useEffect(() => {
		setTnr(props.tnr)
	},[props.tnr]);

	useEffect(() => {
		setProductName(props.name)
	},[props.name]);


	useEffect(() => {
		setDiscontinued(props.discontinued)
	},[props.discontinued]);

	useEffect(() => {
		if(props.instalation_date){
			setInstalationDate(date_without_time_and_zone(props.instalation_date))
		}
	},[props.instalation_date]);


	useEffect(() => {
		setWarranty(props.warranty)
	},[props.warranty]);

	useEffect(() => {

		if(props.product_taxons){
			let taxon1 = (props.product_taxons.find(object => object["depth"] ==  0))
			let taxon2 = (props.product_taxons.find(object => object["depth"] ==  1))
			let taxon3 = (props.product_taxons.find(object => object["depth"] ==  2))
			let taxon4 = (props.product_taxons.find(object => object["depth"] ==  3))
			if(taxon1 != undefined ){
				setBusinessUnit(taxon1.taxon.name)
			}
			if(taxon2 != undefined ){
				setFamily(taxon2.taxon.name)
			}
	
			if(taxon3 != undefined ){
				setSubFamily(taxon3.taxon.name)
			}
	
			if(taxon4 != undefined ){
				setSpecific(taxon4.taxon.name)
			}
		}
	},[props.product_taxons]);


	const handleDiscontinuedChange = (event) => {
		setDiscontinued(!discontinued);
	};

	const handleInstalationDateChange = (date) => {
		if(instalation_date != "" && instalation_date != null){
			setInstalationDateChanged(true);
		}
		setInstalationDate(date);
    };

	const handleWarrantyChange = (date) => {
		setWarranty(date);
    };

	function handleClickOpen(e){
		e.preventDefault();
		setOpen(true);
	}

	function handleClose(e){
		e.preventDefault();
		setOpen(false);
	}

	async function handleEdit(e){
		e.preventDefault();
		if(instalation_date_changed){
			setOpenConfirm(true)
		}else{
			setOpen(false);
			props.editCustomerProduct(props.customer_id, props.customer_product_id, id, tnr, business_unit, family, subfamily, specific, product_name, discontinued, instalation_date, warranty, props.headers);
		}
	}

	function handleConfirmClose(e){
		e.preventDefault();
		setOpenConfirm(false);
	}

	async function handleConfirmEdit(e){
		e.preventDefault();
		setOpen(false);
		setOpenConfirm(false);
		props.editCustomerProduct(props.customer_id, props.customer_product_id, id, tnr, business_unit, family, subfamily, specific, product_name, discontinued, instalation_date, warranty, props.headers);
	}
	
	
	
	return (
		<React.Fragment>
		  <Link href="#" id={"editcustomers_products_"+props.customer_id} className="mdl-navigation__link brand-primary-link product-edit-link  mg-r-15" onClick={handleClickOpen}><i className="material-icons material-icons-20">edit</i></Link>
		  <Dialog
			open={open}
			fullWidth={true}
        	maxWidth={"lg"}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title">{"Editar producto"}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
				<Grid container spacing={1}>
					<Grid item xs={12} sm={12}>
		        		{props.name} ({props.tnr})
					</Grid>
					<Grid item xs={12} sm={1}>
						<TextField fullWidth variant="outlined" label="TNR" name="tnr" value={tnr} onChange={(e) => setTnr(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={1}>
						<TextField fullWidth variant="outlined" label="ID" name="id" value={id} onChange={(e) => setId(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField fullWidth variant="outlined" label={t('services.additionalProductForm.businessUnit')}  name="business_unit" value={business_unit} onChange={(e) => setBusinessUnit(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField fullWidth variant="outlined" label={t('services.additionalProductForm.family')}  name="family" value={family} onChange={(e) => setFamily(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField fullWidth variant="outlined" label={t('services.additionalProductForm.subFamily')}  name="subfamily" value={subfamily} onChange={(e) => setSubFamily(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField fullWidth variant="outlined" label={t('services.additionalProductForm.specific')}  name="specific" value={specific} onChange={(e) => setSpecific(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField fullWidth variant="outlined" label={t('services.additionalProductForm.productName')}  name="product_name" value={product_name} onChange={(e) => setProductName(e.target.value)}/>
					</Grid>

					<Grid item xs={12} sm={12}>
						<FormControlLabel
							className=""
							control={
							<Checkbox
								checked={discontinued}
								onChange={handleDiscontinuedChange}
								name="discontinued"
								color="primary"
							/>
							}
							label="Descontinuado"
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
							<KeyboardDatePicker
								className="payment-date-input"
								id="date-instalation_date-dialog"
								label="Fecha de instalación"
								format="dd/MM/yyyy"
								value={instalation_date}
								onChange={handleInstalationDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
					</Grid>

					<Grid item xs={12} sm={3}>
						<MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
							<KeyboardDatePicker
								className="payment-date-input"
								id="date-instalation_date-dialog"
								label="Inicio de Garantía"
								format="dd/MM/yyyy"
								value={warranty}
								onChange={handleWarrantyChange}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
					</Grid>
					
				</Grid>  
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} variant="outlined" color="primary">
		        Cerrar
		      </Button>
		      <Button onClick={handleEdit} id="product-update"  variant="contained" color="primary" autoFocus>
		        Guardar
		      </Button>
		    </DialogActions>
		  </Dialog>

		  <Dialog
			open={openConfirm}
		    onClose={handleConfirmClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title">{"¿Esta seguro que desea modificar la fecha de instalación?"}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
			  	Esta acción puede alterar la validez de los servicios asociados
			  </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleConfirmClose} variant="outlined" color="primary">
		        Cerrar
		      </Button>
		      <Button onClick={handleConfirmEdit} id="product-update"  variant="contained" color="primary" autoFocus>
		        Guardar
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
  customers: state => state.customers
});
const mapDispatchToProps = {editCustomerProduct};

export default connect(structuredSelector, mapDispatchToProps)(EditCustomerProductDialog)
