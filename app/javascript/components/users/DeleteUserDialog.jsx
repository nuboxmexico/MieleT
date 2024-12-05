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
import i18next from 'i18next';
const DELETE_USER = "DELETE_USER";
const DELETED_USER = "DELETED_USER";

function deleteUser(user_id, headers) {
   return (dispatch) => {
    	dispatch({type: DELETE_USER});
        return axios.delete(`/api/v1/users/${user_id}`, { headers: headers})
	  	.then(response => {
	  		flash_alert(i18next.t('globalText.removed'), i18next.t('users.flashAlert.success'), "success")
	  		dispatch({type: DELETED_USER, response});
	  	})
	    .catch(e => {
	    	flash_alert(i18next.t('globalText.error'), i18next.t('users.flashAlert.failed'), "danger")
	        console.log(e);
		});
	};
};


function DeleteUserDialog(props){
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
		props.deleteUser(props.user_id, props.headers);
	}
	return (
		<React.Fragment>
		  <Link href="#" id={"user_"+props.user_id} className="mdl-navigation__link user-delete-link" onClick={handleClickOpen}><i className="material-icons material-icons-20">delete</i> {t('users.deleteConfirm.erase')}</Link>
		  <Dialog
		    open={open}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title">{t('users.deleteConfirm.confirmMessage')}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
		        {t('users.deleteConfirm.confirmMessage')} {props.name} {props.lastname}?
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
			 	 {t('users.deleteConfirm.no')}
		      </Button>
		      <Button id="user-delete" onClick={handleDelete} color="primary" autoFocus>
			  	{t('users.deleteConfirm.yes')}
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
  users: state => state.users
});
const mapDispatchToProps = {deleteUser};

export default connect(structuredSelector, mapDispatchToProps)(DeleteUserDialog)
