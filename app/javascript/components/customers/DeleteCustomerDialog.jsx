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
const DELETE_CUSTOMER = "DELETE_CUSTOMER";
const DELETED_CUSTOMER = "DELETED_CUSTOMER";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';



function deleteCustomer(customer_id, headers) {
	const {t} = useTranslation();
   return (dispatch) => {
    	dispatch({type: DELETE_CUSTOMER});
        return axios.delete(`/api/v1/customers/${customer_id}`, { headers: headers})
	  	.then(response => {
	  		flash_alert(t('globalText.removed'), t('customer.flashAlert.deletedSuccess'), "success")
	  		dispatch({type: DELETED_CUSTOMER, response});
	  	})
	    .catch(e => {
	    	flash_alert(t('globalText.error'), t('customer.flashAlert.deletedFailed'), "danger")
	        console.log(e);
		});
	};
};


function DeleteCustomerDialog(props){
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
		props.deleteCustomer(props.customer_id, props.headers);
	}
	return (
		<React.Fragment>
		  <Link href="#" id={"tcustomers_"+props.customer_id} className="mdl-navigation__link" onClick={handleClickOpen}><i className="material-icons">delete</i></Link>
		  <Dialog
		    open={open}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title">{t('customer.confirm.delete?')}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
		        {t('customer.confirm.alerDialog?')}{props.name} {props.lastname}
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
			  	{t('customer.confirm.no')}
		      </Button>
		      <Button onClick={handleDelete} color="primary" autoFocus>
			  	{t('customer.confirm.yes')}
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
  customers: state => state.customers
});
const mapDispatchToProps = {deleteCustomer};

export default connect(structuredSelector, mapDispatchToProps)(DeleteCustomerDialog)
