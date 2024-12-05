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
import { flash_alert } from 'components/App';


function PaymentEmailDialog(props){

    function handleClickOpen(e){
		e.preventDefault();
		props.setPaymentEmailDialog(true);
	}

	function handleClose(e){
		e.preventDefault();
		props.setPaymentEmailDialog(false);
	}

	async function handleSendPaymentEmail(e){
		e.preventDefault();
        props.setIsPaymentEmail(true)
		//props.editCustomerProduct(props.customer_id, props.customer_product_id, id, tnr, business_unit, family, subfamily, specific, product_name, props.headers);
	}
	return (
		<React.Fragment>
		  <Dialog
			open={props.paymentEmailDialog}
			fullWidth={true}
        	maxWidth={"sm"}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle className="payment-dialog-title" id="alert-dialog-title">{"¿Esta seguro que desea enviar las instrucciones de pago a "+ props.email}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
				<Grid container spacing={1}> 
					<Grid item xs={12}>
						<TextField fullWidth variant="outlined" type="email"  label="Enviar copia adicional a:" name="email" value={props.paymentEmailAdditional} onChange={(e) => props.setPaymentEmailAdditional(e.target.value)}/>
					</Grid>
					
				</Grid>  
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
		        Cancelar
		      </Button>
		      <Button onClick={handleSendPaymentEmail} id="payment-email-send"  variant="contained" color="primary" autoFocus>
		        Aceptar
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({ });
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(PaymentEmailDialog)
