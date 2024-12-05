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

function DeleteAdditionalAddressDialog(props){
    const [open, setOpen] = useState(false);


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
		return axios.delete(`/api/v1/customersAdditionalAddress/${props.additional_address_id}`, { headers: props.headers})
	  	.then(response => {
			console.log(response);
			  flash_alert("Eliminado!", "La dirección adicional se ha eliminado correctamente", "success")
			  var elem = document.querySelector(`#additionalsAddress-element-${props.additional_address_id}`);
			  elem.parentNode.removeChild(elem);
	  		//dispatch({type: DELETED_CUSTOMER, response});
	  	})
	    .catch(e => {
	    	flash_alert("Error!", "No se ha podido eliminar La dirección adicional", "danger")
	        console.log(e);
		});
	}
	return (
		<React.Fragment>
		  <Link href="#" id={"tcustomers_"+props.additional_address_id} className="mdl-navigation__link additionalsAddress-delete-link" onClick={handleClickOpen}><i className="material-icons">delete</i>  Eliminar</Link>
		  <Dialog
		    open={open}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title">{"¿Esta seguro que desea eliminar la dirección?"}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
		        ¿Esta seguro que desea eliminar la dirección {props.name}?
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
		        No
		      </Button>
		      <Button onClick={handleDelete} color="primary" id="delete-additional-address-btn" autoFocus>
		        Si
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(DeleteAdditionalAddressDialog)
