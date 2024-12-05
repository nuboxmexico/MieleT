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
import { useTranslation } from 'react-i18next';



function FinishServiceDialog(props){
	const { t } = useTranslation('translation', { keyPrefix: 'services.visits.finishServiceButton' });
	function handleClose(e){
		e.preventDefault();
		props.handleCloseFinishServiceDialog();
	}

	async function handleFinishService(e){
        e.preventDefault();
        props.setDoFinishService(true)
    }
	return (
		<React.Fragment>
		  <Dialog
			open={props.finishServiceDialog}
			fullWidth={true}
        	maxWidth={"sm"}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle className="payment-dialog-title" id="alert-dialog-title">{t('finishVisit?')+ props.serviceNumber}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
				  
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
			  	{t('backButton')}
		      </Button>
		      <Button onClick={handleFinishService} id="payment-email-send"  variant="contained" color="primary" autoFocus>
			  	{t('finishServiceButton')}
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({ });
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(FinishServiceDialog)
