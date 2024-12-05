import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import axios from 'axios';
import {csrf, headers,money_format, date_format ,date_format_without_time, date_format_without_time_and_zone} from "constants/csrf"
import Grid from '@material-ui/core/Grid';
import { flash_alert } from 'components/App';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import InputMask from 'react-input-mask';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {country_names_g} from 'components/customers/CustomerForm';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

function Complaint(props){
    const {t} = useTranslation();
    const complaint_types_g = ["-", "RETRASO EN SERVICIO", "TIEMPO DE AGENDAMIENTO", "DISPONIBILIDAD DE REFACCIONES", "ACTITUD (TECNICO, CONTACT CENTER, VENTAS, ETC)", "FALTA DE INFORMACIÓN", "COSTO DE REPARACIÓN", "SEGUIMIENTO A SERVICIO", "PRODUCTO", "TIEMPO DE ENTREGA (PRODUCTO)", "ATENCION TELEFONICA", "SEGUIMIENTO A SOLICITUD", "OTROS"]
    const [complaintType, setComplaintType] = useState("");
    const channels_g = [ "-", "Contact Center", "Technical Management", "Field service", "Gerencia", "Otros"]
    const [channel, setChannel] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneCode, setPhoneCode] = useState("+52");
    const [complaintBackground, setComplaintBackground] = useState("");
    const [compensationProposal, setCompensationProposal] = useState("");
    const [closureDetails, setClosureDetails] = useState("");  
  
    const [compensationProposal2, setCompensationProposal2] = useState("");
    const [closureDetails2, setClosureDetails2] = useState("");  
    const [service_id, setServiceID] = useState(props.selectedServiceObject.id)
    
    useEffect(() => {
        console.log(props.complaint)
		if (props.complaint){
            setServiceID(props.complaint.service_id)
            setChannel(props.complaint.channel)
            setPhone(props.complaint.phone)
            setComplaintType(props.complaint.complaint_type)
            setComplaintBackground(props.complaint.complaint_background)
            setCompensationProposal(props.complaint.compensation_proposal)
            setClosureDetails(props.complaint.closure_details)
            setCompensationProposal2(props.complaint.compensation_proposal_2)
            setClosureDetails2(props.complaint.closure_details_2)
            
        }
		
    }, [props.complaint]);

    
    useEffect(() => {
        console.log(props.country)
		if (props.country){
			setPhoneCode(country_names_g.find(country => country["iso"] == props.country)["phone_code"] )
		}
		
    }, [props.country]);

    
    function saveComplaint(submit_type = "open_complaint"){
        if (checkForm(submit_type)){
            var body = new FormData();
            body.set('id', props.customer_id);
            body.set('service_id', service_id);
            body.set('complaint_type', complaintType);
            body.set('channel', channel);
            body.set('phone', phone);
            body.set('complaint_background', complaintBackground);
            body.set('compensation_proposal', compensationProposal);
            body.set('closure_details', closureDetails);
            body.set('compensation_proposal_2', compensationProposal2);
            body.set('closure_details_2', closureDetails2);
            body.set('stage', submit_type);
            
            if(props.complaint){
                body.set('complaint_id', props.complaint.id);
                return axios.patch(`/api/v1/customers/${props.customer_id}/update_complaint`, body, { headers: headers})
                    .then(response => {
                        props.fetchComplaintData(props.customer_id)
                        flash_alert(t('customer.showCustomer.flashAlert.success'), t('customer.showCustomer.flashAlert.updateService'), "success")
                    })
                .catch(e => {
                    if(e.response.data){
                        for (var key in e.response.data) {
                            flash_alert(t('globalText.error'), e.response.data[key], "danger")
                        }
                    }
                });
            }else{
                return axios.post(`/api/v1/customers/${props.customer_id}/create_complaint`, body, { headers: headers})
                    .then(response => {
                        props.fetchComplaintData(props.customer_id)
                        setComplaintType("")
                        setChannel("")
                        setPhone("")
                        setComplaintBackground("")
                        flash_alert(t('customer.showCustomer.flashAlert.success'), t('customer.showCustomer.flashAlert.updateService'), "success")
                    })
                .catch(e => {
                    if(e.response.data){
                        for (var key in e.response.data) {
                            flash_alert(t('globalText.error'), e.response.data[key], "danger")
                        }
                    }
                });
            }
        }
    }

    function checkForm(submit_type){
        let check = true;
        if(submit_type == "open_complaint"){
            if (complaintType == "")
            {
                flash_alert(t('customer.showCustomer.flashAlert.infoRequest'), t('customer.showCustomer.flashAlert.complaintMessage'), "error")
                check = false;
            }    
            if (channel == "")
            {
                flash_alert(t('customer.showCustomer.flashAlert.infoRequest'), t('customer.showCustomer.flashAlert.channelMessage'), "error")
                check = false;
            }    
            if (phone == "")
            {
                flash_alert(t('customer.showCustomer.flashAlert.infoRequest'), t('customer.showCustomer.flashAlert.phoneMessage'), "error")
                check = false;
            }    
            if (complaintBackground == "")
            {
                flash_alert(t('customer.showCustomer.flashAlert.infoRequest'), t('customer.showCustomer.flashAlert.customerMessage'), "error")
                check = false;
            }    
        }else if(submit_type == "first_proposal"){
            
            if (compensationProposal == "")
            {
                flash_alert(t('customer.showCustomer.flashAlert.infoRequest'), t('customer.showCustomer.flashAlert.offsetMessage'), "error")
                check = false;
            } 
        }else if(submit_type == "scale_complaint"){
            
            if ( closureDetails == "")
            {
                flash_alertflash_alert(t('customer.showCustomer.flashAlert.infoRequest'), t('customer.showCustomer.flashAlert.clousureDetails'), "error")
                check = false;
            } 
        }else if(submit_type == "second_proposal"){
            
            if (compensationProposal2 == "")
            {
                flash_alertflash_alert(t('customer.showCustomer.flashAlert.infoRequest'), t('customer.showCustomer.flashAlert.offsetMessage'), "error")
                check = false;
            } 
        }else if(submit_type == "close_complaint"){
            
            if ( closureDetails2 == "")
            {
                flash_alertflash_alert(t('customer.showCustomer.flashAlert.infoRequest'), t('customer.showCustomer.flashAlert.clousureDetails'), "error")
                check = false;
            } 
        }
        



        return check
        
    }

    return (
  		<React.Fragment>

          {props.selectedServiceObject && 
            <Grid className="complaint-container" container spacing={3}>
                
                <Grid item xs={12} sm={4}>
                    <FormControl variant="outlined" className="MuiFormControl-fullWidth" >
                            <InputLabel id="service_type-simple-select-outlined-label">{t('customer.showCustomer.complaintType')}</InputLabel>
                            <Select
                            labelId="service_type-simple-select-outlined-label"
                            id="service_type-simple-select-outlined"
                            value={complaintType}
                            onChange={(e) => setComplaintType(e.target.value)}
                            label={t('customer.showCustomer.complaintType')}
                            name="complaint_type"
                            >
                            {complaint_types_g.map((value) => (
                                <MenuItem key={"service_type-"+value} value={value}>{value}</MenuItem>
                            ))}
                            </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl variant="outlined" className="MuiFormControl-fullWidth" >
                            <InputLabel id="service_type-simple-select-outlined-label">{t('customer.showCustomer.channel')}</InputLabel>
                            <Select
                            labelId="service_type-simple-select-outlined-label"
                            id="service_type-simple-select-outlined"
                            value={channel}
                            onChange={(e) => setChannel(e.target.value)}
                            label={t('customer.showCustomer.channel')}
                            name="channel"
                            >
                            {channels_g.map((value) => (
                                <MenuItem key={"service_type-"+value} value={value}>{value}</MenuItem>
                            ))}
                            </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputMask
                        mask={ `(${phoneCode}) 9999999999`}
                        value={phone}
                        disabled={false}
                        maskChar=" "
                        onChange={(e) => setPhone(e.target.value)}
                        >
                        {() => <TextField fullWidth variant="outlined" label={t('customer.showCustomer.phone')} name="phone" />}
                    </InputMask> 
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth variant="outlined" multiline rows={8} label={t('customer.showCustomer.complaintBackground')} name="complaintBackground" value={complaintBackground} onChange={(e) => setComplaintBackground(e.target.value)} disabled={(props.complaint && props.complaint.stage !="open_complaint")}/>
                </Grid>

                <Grid item xs={12}>
                    <Button id="complaint-save" type="submit" variant="outlined" color="primary" onClick={() => saveComplaint()} disabled={(props.complaint && props.complaint.stage !="open_complaint")}>
                        {t('customer.showCustomer.submit')}
                    </Button>
                </Grid>
                
                <Grid item xs={12}>
                    <h3 className={"customer-panel-subtitle proposal-subtitle"}>
                        {t('customer.showCustomer.complaintNegotiation')}
                    </h3>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" multiline rows={8} label={t('customer.showCustomer.compensationProposal')} name="compensationProposal" value={compensationProposal} onChange={(e) => setCompensationProposal(e.target.value)} disabled={props.type_c!="edit" || (props.complaint && props.complaint.stage !="open_complaint")}/>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" multiline rows={8} label={t('customer.showCustomer.closureDetails')} name="closureDetails" value={closureDetails} onChange={(e) => setClosureDetails(e.target.value)} disabled={props.type_c!="edit" || (props.complaint && props.complaint.stage !="first_proposal")}/>
                </Grid>
                
                <Grid item xs={12}>
                    <Grid container spacing={4}>
                        <Grid className="mg-r-20"  item xs={6} sm={1}>
                            <Button id="complaint-save" type="submit" variant="contained" color="primary" onClick={() => saveComplaint("first_proposal")} disabled={props.type_c!="edit" || (props.complaint && props.complaint.stage !="open_complaint")} >
                                {t('globalText.save')}
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Button id="complaint-save" type="submit" variant="contained" color="primary" onClick={() => saveComplaint("scale_complaint")} disabled={props.type_c!="edit" || (props.complaint && props.complaint.stage !="first_proposal")} >
                                {t('customer.showCustomer.closureDetails')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <h3 className={"customer-panel-subtitle proposal-subtitle"}>
                        {t('customer.showCustomer.secondComplaintNegotiation')}
                    </h3>
                </Grid> 
                
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" multiline rows={8} label={t('customer.showCustomer.compensationProposal')} name="compensationProposal" value={compensationProposal2} onChange={(e) => setCompensationProposal2(e.target.value)} disabled={props.type_c!="edit" || (props.complaint && props.complaint.stage !="scale_complaint")}/>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField fullWidth variant="outlined" multiline rows={8} label={t('customer.showCustomer.closureDetails')} name="closureDetails" value={closureDetails2} onChange={(e) => setClosureDetails2(e.target.value)} disabled={props.type_c!="edit" || (props.complaint && props.complaint.stage !="second_proposal")}/>
                </Grid>

                
                <Grid item xs={12}>
                    <Grid container spacing={4}>
                        <Grid className="mg-r-20" item xs={6} sm={1}>
                            <Button  id="complaint-save" type="submit" variant="contained" color="primary" onClick={() => saveComplaint("second_proposal")} disabled={props.type_c!="edit"|| (props.complaint && props.complaint.stage !="scale_complaint")} >
                                {t('globalText.save')}
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Button id="complaint-save" type="submit" variant="contained" color="primary" onClick={() => saveComplaint("close_complaint")} disabled={props.type_c!="edit" || (props.complaint && props.complaint.stage !="second_proposal")} >
                                {t('customer.showCustomer.closeComplaint')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                
                
            </Grid>
          }
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(Complaint)
