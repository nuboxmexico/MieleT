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
const DELETE_TECHNICIAN = "DELETE_TECHNICIAN";
const DELETED_TECHNICIAN = "DELETED_TECHNICIAN";
import { useTranslation } from 'react-i18next';


function deleteTechnician(technician_id, headers) {
	const {t} = useTranslation();
   return (dispatch) => {
    	dispatch({type: DELETE_TECHNICIAN});
        return axios.delete(`/api/v1/technicians/${technician_id}`, { headers: headers})
	  	.then(response => {
	  		flash_alert(t('globalText.removed'), t('technicians.flashAlert.success'), "success")
	  		dispatch({type: DELETED_TECHNICIAN, response});
	  	})
	    .catch(e => {
	    	flash_alert(t('globalText.error'), t('technicians.flashAlert.failed'), "danger")
	        console.log(e);
		});
	};
};


function DeleteTechnicianDialog(props){
	const {t} = useTranslation();
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
		props.deleteTechnician(props.technician_id, props.headers);
	}
	return (
		<React.Fragment>
		  <Link href="#" id={"technician_"+props.technician_id} className="mdl-navigation__link delete-technician-link" onClick={handleClickOpen}><i className="material-icons material-icons-20">delete</i> {t('technicians.confirm.erase')}</Link>
		  <Dialog
		    open={open}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title">{t('technicians.confirm.delete?')}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
		        {t('technicians.confirm.alertDialog')} {props.name} {props.lastname}
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
			  	{t('technicians.confirm.no')}
		      </Button>
		      <Button onClick={handleDelete} id="delete-tech-btn" color="primary" autoFocus>
			  	{t('technicians.confirm.yes')}
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
  technicians: state => state.technicians
});
const mapDispatchToProps = {deleteTechnician};

export default connect(structuredSelector, mapDispatchToProps)(DeleteTechnicianDialog)
