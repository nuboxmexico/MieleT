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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import {spare_part_delivery_status_label} from "constants/service_functions"
import { flash_alert } from 'components/App';
const EDIT_SPARE_PART = "EDIT_SPARE_PART";
const EDITED_SPARE_PART = "EDITED_SPARE_PART";

const SPARE_PART_DELIVERY_STATUS = ['waiting', 'in_transit', 'delivered']

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;
  
	return (
	  <NumberFormat
		{...other}
		getInputRef={inputRef}
		onValueChange={(values) => {
		  onChange({
			target: {
			  name: props.name,
			  value: values.value,
			},
		  });
		}}
		thousandSeparator
		isNumericString
		prefix="$ "
	  />
	);
  }
  
  NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
  };

function editSparePart(service_id, quotation_id, service_spare_part_id, quantity, requested_quantity, delivery_status, background, price, warranty, from, headers, callbacks) {
   return (dispatch) => {
		dispatch({type: EDIT_SPARE_PART});
		var body = new FormData(); 
		body.set('id', service_id);
		
		if(from == "request"){
			body.set('requested_quantity', requested_quantity);
			body.set('delivery_status', delivery_status);
			body.set('background', background);
			
		}else{
			body.set('quantity', quantity);
		}

		if(from == "quotation"){
			body.set('quotation_spare_part_id', service_spare_part_id);
			body.set('price', price);
			body.set('warranty', warranty);
			
			return axios.patch(`/api/v1/quotations/${quotation_id}/spare_parts/${service_spare_part_id}`, body, { headers: headers})
			.then(response => {
				flash_alert("Actualizado!", "Refacción actualizada correctamente", "success")
				callbacks();
			})
			.catch(e => {
				flash_alert("Error!", "No se ha podido actualizar la refacción", "danger")
				console.log(e);
			});
		}else{
			body.set('service_spare_part_id', service_spare_part_id);
			return axios.patch(`/api/v1/services/${service_id}/spare_parts/${service_spare_part_id}`, body, { headers: headers})
			.then(response => {
				flash_alert("Actualizado!", "Refacción actualizada correctamente", "success")
				dispatch({type: EDITED_SPARE_PART, response});
				callbacks && callbacks();
			})
			.catch(e => {
				flash_alert("Error!", "No se ha podido actualizar la refacción", "danger")
				console.log(e);
			});
		}
		
        
	};
};


function EditSparePartDialog(props){
	const [open, setOpen] = useState(false);

    const [quantity, setQuantity] = useState("");
	const [price, setPrice] = useState("");
	const [firstTime, setFirstTime] = useState(true);
	
	
    const [requested_quantity, setRequestedQuantity] = useState("");
    const [from, setFrom] = useState("");
    const [delivery_status, setDeliveryStatus] = useState("");
	const [background, setBackground] = useState("");

	const [warranty, setWarranty] = useState(false);
	
    useEffect(() => {
		setQuantity(props.quantity)
	},[props.quantity]);

	useEffect(() => {
		if(props.price){
			setPrice(props.price)
		}
		props.price == 0 && setWarranty(true)
	},[props.price]);


	useEffect(() => {
		if(price){
			price == 0 ?  null : setWarranty(false)
		}
	},[price])

	useEffect(() => {
		if(!warranty){			
			if(props.original_price && !firstTime){
				setPrice(props.original_price)
			}else{
				setPrice(props.price)
			}
			
		}else{
			setPrice(0)
		}
		firstTime && setFirstTime(false)
	},[warranty])



	useEffect(() => {
		setRequestedQuantity(props.requested_quantity)
	},[props.requested_quantity]);

	useEffect(() => {
		setDeliveryStatus(props.delivery_status)
	},[props.delivery_status]);

	useEffect(() => {
		setBackground(props.background)
	},[props.background]);

	


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

	async function handleEdit(e){
		e.preventDefault();
		setOpen(false);
		props.editSparePart(props.service_id, props.quotation_id, props.service_spare_part_id, quantity, requested_quantity, delivery_status, background, price, warranty, from, props.headers, props.callbacks);
	}
	
	function handleQuantity(e){
		if(e.target.value < 1 || e.target.value > 99){
			flash_alert("Error!", "Debe ingresar una cantidad entre 1 y 99", "danger")
		}
		else{
			setQuantity(e.target.value)
			setRequestedQuantity(e.target.value)
		}
	}


    function handleWarrantyChange(e){
		setWarranty(!warranty)
    }
    
	return (
		<React.Fragment>
		  <Link href="#" id={"editspareparts_"+props.customer_id} className="mdl-navigation__link brand-primary-link sparepart-edit-link  mg-r-15" onClick={handleClickOpen}><i className="material-icons material-icons-20">edit</i> Editar</Link>
		  <Dialog
			open={open}
			fullWidth={true}
        	maxWidth={"sm"}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle className="edit-sparepart-dialog-title"  id="alert-dialog-title">{"Editar refacción"}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
				<Grid container spacing={1}>
					<Grid item xs={12} sm={12} className={"edit-sparepart-dialog-product-name"}>
		        		{props.name} ({props.tnr})
					</Grid>
					{
						props.from == "request" && 
							<Grid item xs={12} sm={6}>
								<FormControl variant="outlined" className="MuiFormControl-fullWidth" >
										<InputLabel id="spare_part_delivery_status-simple-select-outlined-label">Estado de entrega</InputLabel>
										<Select
										labelId="spare_part_delivery_status-simple-select-outlined-label"
										id="spare_part_delivery_status-simple-select-outlined"
										value={delivery_status}
										onChange={(e) => setDeliveryStatus(e.target.value)}
										label="Estado de entrega"
										name="delivery_status"
										>
										{SPARE_PART_DELIVERY_STATUS.map((value) => (
											<MenuItem key={"spare_part_delivery_status-"+value} value={value}>{spare_part_delivery_status_label(value)}</MenuItem>
										))}
										</Select>
								</FormControl>
							</Grid>

							}
					
					<Grid item xs={12} sm={(props.from == "request" || from == "quotation") ? 6 : 12}>
						<TextField fullWidth variant="outlined" type="number" InputProps={{ inputProps: { min: 1, max: 99 } }} label="Cantidad" name="quantity" value={quantity} onChange={(e) => handleQuantity(e)}/>
					</Grid>
					
					
					{
						props.from == "quotation" &&
						<>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth 
								variant="outlined"
								label="Precio unitario"
								name="price" 
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								
								InputProps={{
									inputComponent: NumberFormatCustom,
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<span className="mdl-navigation__link">
								<Checkbox color="primary" checked={warranty} onClick={(e) => handleWarrantyChange(e)} />
								&nbsp;
								<span className="quotation-product-name quotation-product-labor-price">Esta refacción tiene <strong>Garantía</strong></span>
							</span>
						</Grid>
						</>
					}
					{
						props.from == "request" && 
							<Grid item xs={12}>
								<TextField 
									fullWidth variant="outlined" multiline rows={8} 
									label="Ingrese Observaciones"
									name="background" 
									value={background} 
									onChange={(e) => setBackground(e.target.value)} />
							</Grid>
					}
				</Grid>  
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={(e) => handleClose(e)} color="primary">
		        Cerrar
		      </Button>
		      <Button onClick={(e) => handleEdit(e) } id="product-update"  variant="contained" color="primary" autoFocus>
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
const mapDispatchToProps = {editSparePart};

export default connect(structuredSelector, mapDispatchToProps)(EditSparePartDialog)
