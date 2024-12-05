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
const DELETE_CUSTOMER_PRODUCT = "DELETE_CUSTOMER_PRODUCT";
const DELETED_CUSTOMER_PRODUCT = "DELETED_CUSTOMER_PRODUCT";

function deleteCustomerProduct(customer_id, customer_product_id, headers) {
   return (dispatch) => {
    	dispatch({type: DELETE_CUSTOMER_PRODUCT});
        return axios.delete(`/api/v1/customers/${customer_id}/customer_product/${customer_product_id}`, { headers: headers})
	  	.then(response => {
	  		flash_alert("Eliminado!", "Producto se ha eliminado correctamente", "success")
            dispatch({type: DELETED_CUSTOMER_PRODUCT, response});
	  	})
	    .catch(e => {
	    	flash_alert("Error!", "No se ha podido eliminar el producto", "danger")
	        console.log(e);
		});
	};
};


function DeleteCustomerProductDialog(props){
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
		props.deleteCustomerProduct(props.customer_id, props.customer_product_id, props.headers);
	}
	return (
		<React.Fragment>
		  <Link href="#" id={"tcustomers_products_"+props.customer_id} className="mdl-navigation__link brand-primary-link product-delete-link" onClick={handleClickOpen}><i className="material-icons">delete</i></Link>
		  <Dialog
		    open={open}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title">{"¿Esta seguro que desea eliminar el producto?"}</DialogTitle>
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
  customers: state => state.customers
});
const mapDispatchToProps = {deleteCustomerProduct};

export default connect(structuredSelector, mapDispatchToProps)(DeleteCustomerProductDialog)
