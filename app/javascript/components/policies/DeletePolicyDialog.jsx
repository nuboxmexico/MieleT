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
const DELETE_POLICY = "DELETE_POLICY";
const DELETED_POLICY = "DELETED_POLICY";

function deletePolicy(customer_id, policy_id, headers) {
    
    return (dispatch) => {
    	dispatch({type: DELETE_POLICY});
        return axios.delete(`/api/v1/customers/${customer_id}/policies/${policy_id}`, { headers: headers})
	  	.then(response => {
            let element = document.getElementById(`accordeon-policy-${policy_id}`);
            element.parentNode.removeChild(element);
	  		flash_alert("Eliminado!", "Póliza se ha eliminado correctamente", "success")
            dispatch({type: DELETED_POLICY, response});
	  	})
	    .catch(e => {
	    	flash_alert("Error!", "No se ha podido eliminar la póliza", "danger")
	        console.log(e);
		});
	};
};


function DeletePolicyDialog(props){
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
		props.deletePolicy(props.customer_id, props.policy_id, props.headers);
	}
	return (
		<React.Fragment>
		  <Link href="#" id={"tcustomers_products_"+props.customer_id} className="mdl-navigation__link brand-primary-link customers-delete-policy-link" onClick={handleClickOpen}><i className="material-icons">delete</i> Eliminar</Link>
		  <Dialog
		    open={open}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title">{"Eliminar Póliza"}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
		        ¿Esta seguro que desea eliminar la póliza N° {props.customer_id}-{props.policy_id}?
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
  customers: state => state.customers
});
const mapDispatchToProps = {deletePolicy};

export default connect(structuredSelector, mapDispatchToProps)(DeletePolicyDialog)
