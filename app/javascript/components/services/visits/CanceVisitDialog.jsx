
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
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Tooltip from '@material-ui/core/Tooltip';
import FormLabel from '@material-ui/core/FormLabel';
import {csrf, headers, money_format, date_format,date_event_format, date_difference_in_hours} from "constants/csrf"
import { useTranslation } from 'react-i18next';

function CanceVisitDialog(props){
    const { t } = useTranslation('translation', { keyPrefix: 'services.visits.cancelServiceButton' });
    const [canceVisitDialog, setCanceVisitDialog] = React.useState(false);
    const [cancelReason, setCancelReason] = React.useState('');
    const [backgroundCancelVisit, setBackgroundCancelVisit] = useState("");
    const [doCancelService, setDoCancelService] = React.useState(false);
    
    const handleChange = (event) => {
        setCancelReason(event.target.value);
    }
	function handleClose(e){
		e.preventDefault();
		setCanceVisitDialog(false);
	}

	async function handleCancelVisit(e){
        e.preventDefault();
        cancelVisit(props.visit.id)
    }


    function cancelVisit(visit_id){
        var body = new FormData();
        
        
        body.set('cancel_from', cancelReason);
        body.set('cancel_reason', backgroundCancelVisit);
        return axios.post(`/api/v1/services/${props.serviceID}/visits/${visit_id}/cancel_visit`, body, { headers: headers})
            .then(response => {
                flash_alert(t('flashAlert.saved'), t('flashAlert.cancelVisit'), "success")
                props.callbacks();
                setCanceVisitDialog(false);
            })
            .catch(e => {
            if(e.response.data){
                console.log(e.response.data);
                setCanceVisitDialog(false);
                props.callbacks();
                for (var key in e.response.data) {
                    flash_alert(t('globalText.error'), e.response.data[key], "danger")
                }
            }
        });
    }
	return (
		<React.Fragment>
            <Typography className={props.classes.heading}>
                <Button disabled={props.visit.canceled_at != null} className={props.btn_classname + "customers-scheddule-visit-link"} color="primary" onClick={() =>  setCanceVisitDialog(true)}>
                    <Tooltip title={
                        <React.Fragment>
                            <div className="service-tooltip" dangerouslySetInnerHTML={{__html: ( t('flashAlert.cancelTooltip') || "")}} /> 
                        </React.Fragment>} arrow>
                        { <i className="material-icons">close</i> }
                    </Tooltip>
                </Button>
            </Typography>
		  <Dialog
			open={canceVisitDialog}
			fullWidth={true}
        	maxWidth={"sm"}
		    onClose={handleClose}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle className="payment-dialog-title" id="alert-dialog-title">{t('flashAlert.cancelMessage')}</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
				<Grid container spacing={1}> 
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" name="gender1" value={cancelReason} onChange={handleChange}>
                                <FormControlLabel value="Desde Miele" control={<Radio color="primary" />} label={t('fromMiele')} />
                                <FormControlLabel value="Desde Cliente" control={<Radio color="primary" />} label={t('fromCustomer')} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
					<Grid item xs={12}>
                        <TextField fullWidth variant="outlined" multiline rows={8} label={t('reasons')} name="background" value={backgroundCancelVisit} onChange={(e) => setBackgroundCancelVisit(e.target.value)}/>
					</Grid>
				</Grid>  
		      </DialogContentText>
		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} color="primary">
                {t('backButton')}
		      </Button>
		      <Button onClick={handleCancelVisit} id="payment-email-send"  variant="contained" color="primary" autoFocus>
                {t('cancelVisitButton')}
		      </Button>
		    </DialogActions>
		  </Dialog>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({ });
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(CanceVisitDialog)
