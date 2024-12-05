import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';


import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'


import {csrf, headers, headers_www_form, money_format, product_price, date_event_format, date_format_without_time, date_difference_in_hours, api_token, site_url, payment_channel_label} from "constants/csrf"



function VisitTechnicians(props){

    const [visit_technicians, setVisitTechnicians] = useState("");
    
    async function fetchVisitTechnicians(visit_id) {

        return fetch(`/api/v1/visits/${visit_id}/technicians`)
            .then(response => response.json())
            .then(json => {
                
                if (json.data.length > 0){
                    setVisitTechnicians(json.data)
                }else{
                    setVisitTechnicians(props.service_technicians)
                }
        })
    }

    
    useEffect(() => {
       
        if(props.visit){
            fetchVisitTechnicians(props.visit.id)
        
        }
    }, [props.visit]);


    

	return (
		<>
            <Grid item xs={12} sm={3}>
                <span className="visit-summary-1">Técnico(s)</span><br/>
                <span className="visit-summary-2">
                    {visit_technicians && visit_technicians.map((technician, index) => (
                        <span key={`visit_technicians_{${technician.id}}_${props.visit.id}`} >
                            {technician.user && ((technician.enterprise != "" && technician.enterprise != null ) ?  technician.user.fullname + " (" + technician.enterprise  + ")" : technician.user.fullname) }{index != props.service_technicians.length -1 ? "," : "" }&nbsp;
                        </span>
                    ))}
                </span>
            </Grid>
		</>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(VisitTechnicians)

