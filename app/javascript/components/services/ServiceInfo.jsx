import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Skeleton from '@material-ui/lab/Skeleton';
import { flash_alert } from 'components/App';

import CircularProgress from '@material-ui/core/CircularProgress';
//Accordeon 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useTranslation} from "react-i18next"

function ServiceInfo(props){
    const {t} = useTranslation();
    const [policy, setPolicy] = useState({});


    useEffect(() => {
        if(props.policy_id && props.customer_id){
            fetchPolicyData(props.policy_id, props.customer_id)
        }

        
    }, [props.policy_id, props.customer_id]);
    

    async function fetchPolicyData(policy_id, customer_id) {
        return fetch(`/api/v1/customers/${customer_id}/policies/${policy_id}`)
        .then(response => response.json())
        .then(json => {
            console.log(json.data)
            setPolicy(json.data)
            
        })

    }
	return (
		<React.Fragment>

            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="paneladditional-header"
                >
                <h1 className="panel-custom-title">{t('services.info.title')}</h1>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                            <span className="service-price-table-label">{t('services.info.type')}</span>
                            { (!props.service_id)  && 
                                <Skeleton height={21}/>
                              ||  
                              <span className="service-price-table-value service-type-value">{props.service_type}</span>
                            }    
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            {props.policy_id &&
                                <>
                                <span className="service-price-table-label">{t('services.info.associatedPolicy')}</span>
                                <span className="service-price-table-value service-type-value">
                                    <a className="mdl-navigation__link"  id="customers-policy" href={`/customers/${props.customer_id}/policies/${props.policy_id}/edit_policy`}>
                                        N° {props.customer_id}-{policy.id}
                                    </a>
                                </span>
                                </>
                            ||
                                <>
                                <span className="service-price-table-label">{t('services.info.subCategory')}</span>
                                { (!props.service_id)  && 
                                <Skeleton height={21}/>
                                ||  
                                <span className="service-price-table-value service-type-value">{props.subcategory}</span>
                                }
                                </>
                            }
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <span className="service-price-table-label">{t('services.info.requestedBy')}</span>
                            { (!props.service_id)  && 
                                <Skeleton height={21}/>
                              ||  
                                <>
                                    <span className="service-price-table-value service-type-value">{props.requested}</span>
                                    <span className={"service-price-table-value service-type-value "+props.distributorCheck}>{props.distributorName} {props.distributorEmail ? `(${props.distributorName})` : ''}</span>
                                </>
                            }
                            
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <span className="service-price-table-label">{t('services.info.requestChannel')}</span>
                            { (!props.service_id)  && 
                                <Skeleton height={21}/>
                              ||
                              <span className="service-price-table-value service-type-value">{props.requestChannel}</span>
                            }
                            
                        </Grid>
                        <Grid item xs={12}>
                                <TextField variant="outlined" type="text"  label={t('services.info.ibsNumber')} name="ibs_number" value={props.ibs_number} onChange={(e) => props.setIBSNumber(e.target.value)}/>
                        </Grid>
                            
                        <Grid item xs={12}>
                                <Button id="service-save" disabled={props.loading || !props.service_id} type="submit" variant="contained" color="primary" onClick={props.handleSubmit}>
                                    {t('services.info.saveChanges')}
                                </Button>
                                {props.loading && <CircularProgress size={24} className={props.classes.buttonProgress} />}
                        </Grid>
                        <Grid item xs={12}>
                            <a className="mdl-navigation__link brand-primary-link customers-edit-link"  target="_blank" rel="noopener noreferrer" href={`/api/v1/services/${props.service_id}/status_changes`}>
                                {t('services.info.stateChanges')}
                            </a>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
                

		    
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(ServiceInfo)
