import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import { flash_alert } from 'components/App';

const DELETE_SPARE_PART = "DELETE_SPARE_PART";
const DELETED_SPARE_PART = "DELETED_SPARE_PART";

const DELETE_REQUESTED_SPARE_PART = "DELETE_REQUESTED_SPARE_PART";
const DELETED_REQUESTED_SPARE_PART = "DELETED_REQUESTED_SPARE_PART";

const DELETE_REINTEGRATED_SPARE_PART = "DELETE_REINTEGRATED_SPARE_PART";
const DELETED_REINTEGRATED_SPARE_PART = "DELETED_REINTEGRATED_SPARE_PART";


function deleteSparePart(service_id, quotation_id, service_spare_part_id, from, headers, callbacks) {

	if(from == "request"){
		return (dispatch) => {
			dispatch({type: DELETE_REQUESTED_SPARE_PART});
			var body = new FormData(); 
			body.set('id', service_id);
			body.set('service_spare_part_id', service_spare_part_id);
			body.set('status', "");
			
			return axios.patch(`/api/v1/services/${service_id}/spare_parts/${service_spare_part_id}`, body, { headers: headers})
			  .then(response => {
				flash_alert("Eliminado!", "Producto se ha eliminado correctamente", "success")
				dispatch({type: DELETED_REQUESTED_SPARE_PART, response});
			  })
			.catch(e => {
				flash_alert("Error!", "No se ha podido actualizar la refacción", "danger")
				console.log(e);
			});
		};
	}else if(from == "quotation"){
		return axios.delete(`/api/v1/quotations/${quotation_id}/spare_parts/${service_spare_part_id}`, { headers: headers})
			.then(response => {
				flash_alert("Eliminado!", "Producto se ha eliminado correctamente", "success")
				callbacks();
			})
			.catch(e => {
			flash_alert("Error!", "No se ha podido eliminar el producto", "danger")
			console.log(e);
		});
	}else{
		return (dispatch) => {
			 dispatch({type: DELETE_SPARE_PART});
			 return axios.delete(`/api/v1/services/${service_id}/spare_parts/${service_spare_part_id}`, { headers: headers})
			   .then(response => {
				   flash_alert("Eliminado!", "Producto se ha eliminado correctamente", "success")
				   if(from == "technicians"){
						dispatch({type: DELETED_REINTEGRATED_SPARE_PART, response});
				   }else{
					   dispatch({type: DELETED_SPARE_PART, response});
				   }
			   })
			 .catch(e => {
				 flash_alert("Error!", "No se ha podido eliminar el producto", "danger")
				 console.log(e);
			 });
		 };
	}
	

};


function DeleteSparePartDialog(props){
	const [open, setOpen] = useState(false);
	const [from, setFrom] = useState("");

	useEffect(() => {
		setFrom(props.from)
	},[props.from]);

	function handleClickOpen(e){
		e.preventDefault();
		setOpen(true);
	}

	function handleClose(e){
		e.preventDefault();
		setOpen(false);
	}

	async function handleDelete(e){
		e.preventDefault();
		setOpen(false);
		props.deleteSparePart(props.service_id, props.quotation_id, props.service_spare_part_id, from, props.headers, props.callbacks);
	}
	return (
		<React.Fragment>
		  <Link href="#" id={"tcustomers_products_"+props.service_id} className="mdl-navigation__link brand-primary-link product-delete-link" onClick={handleClickOpen}><i className="material-icons">delete</i> Eliminar</Link>
		  <Dialog
		    open={open}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle className="delete-sparepart-dialog-title" id="alert-dialog-title">{"¿Esta seguro que desea eliminar el producto?"}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
		        ¿Esta seguro que desea eliminar el producto {props.name} ({props.tnr})?
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
		        No
		      </Button>
		      <Button onClick={handleDelete} color="primary" autoFocus>
		        Si
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
  spare_parts: state => state.spare_parts
});
const mapDispatchToProps = {deleteSparePart};

export default connect(structuredSelector, mapDispatchToProps)(DeleteSparePartDialog)
