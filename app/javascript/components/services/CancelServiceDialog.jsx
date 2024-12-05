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

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { useTranslation } from 'react-i18next';

function CancelServiceDialog(props){
	const { t } = useTranslation('translation', { keyPrefix: 'services.visits.cancelServiceButton' });

    const handleChange = (event) => {
      props.setCancelReason(event.target.value);
    }
	function handleClose(e){
		e.preventDefault();
		props.setCancelServiceDialog(false);
	}

	async function handleCancelService(e){
        e.preventDefault();
        props.setDoCancelService(true)
    }
	return (
		<React.Fragment>
		  <Dialog
			open={props.cancelServiceDialog}
			fullWidth={true}
        	maxWidth={"sm"}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle className="payment-dialog-title" id="alert-dialog-title">{t('flashAlert.cancelVisit?')+ props.serviceNumber }</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
				<Grid container spacing={1}> 
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" name="gender1" value={props.cancelReason} onChange={handleChange}>
                                <FormControlLabel value="Desde Miele" control={<Radio color="primary" />} label={t('fromMiele')}/>
                                <FormControlLabel value="Desde Cliente" control={<Radio color="primary" />} label={t('fromCustomer')} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
					<Grid item xs={12}>
                        <TextField fullWidth variant="outlined" multiline rows={8} label={t('reasons')} name="background" value={props.backgroundCancelService} onChange={(e) => props.setBackgroundCancelService(e.target.value)}/>
					</Grid>
				</Grid>  
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
			  	{t('backButton')}
		      </Button>
		      <Button onClick={handleCancelService} id="payment-email-send"  variant="contained" color="primary" autoFocus>
			  	{t('cancelVisitButton')}
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({ });
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(CancelServiceDialog)
