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
import {useTranslation} from "react-i18next"


import {csrf, headers, headers_www_form, money_format, product_price, date_event_format, date_format_without_time, date_difference_in_hours, api_token, site_url, payment_channel_label} from "constants/csrf"



function QuotationProductWarranty(props){
    const { t } = useTranslation('translation', { keyPrefix: 'services.quotes.detailsTab' });
    const [quotation, setQuotation] = useState({});
    const [laborAmout, setLaborAmount] = useState(0.0);
    const [warranty, setWarranty] = useState(null);
    
    const [country, setCountry] = useState(props.country);
    const [zipcode, setZipcode] = useState(props.zipcode);
    const [administrative_demarcation, setAdministrativeDemarcation] = useState(props.administrative_demarcation);

    useEffect(() => {
        if(props.quotation){
            setQuotation(props.quotation)
        }
    }, [props.quotation]);


    useEffect(() => {
        props.setCustomerProductWarrantyFromChild(props.customer_product.id, warranty, laborAmout)
    }, [laborAmout]);
    
    useEffect(() => {
        if(props.customer_product){
            if(props.customer_product_warranties){
                let quotation_product = props.customer_product_warranties.find(quotation_customer_product => quotation_customer_product.id == props.customer_product.id)
            
                if(quotation_product){
                    setWarranty(quotation_product.warranty != "No" && quotation_product.warranty != "f" && quotation_product.warranty != false)
                }else{
                    setWarranty(props.customer_product.warranty != null)
                }
            }else{
                setWarranty(props.customer_product.warranty != null)
            }
                    
        }
    }, [props.customer_product, props.customer_product_warranties]);
    
    useEffect(() => {
       
        if(warranty == false){
            fetchServiceTotalForProduct(country, props.customer_product.id, zipcode, administrative_demarcation.admin_name_3)
        
        }
    }, [warranty]);


    

    function handleWarrantyChange(e){
        setWarranty(!warranty)
        if(!warranty){
            setLaborAmount(0)
            props.setCustomerProductWarrantyFromChild(props.customer_product.id, true, 0)
        }
    }
    

    function fetchServiceTotalForProduct(country_code, products_ids, zipcode_t, administrative_demarcation_name_t){
        if (products_ids){
            return fetch(`/api/v1/services/${props.serviceID}/total_price?country=${country_code}&products_ids=${products_ids}&service_type=${props.service_type}&zipcode=${zipcode_t}&administrative_demarcation_name=${administrative_demarcation_name_t}`)
            .then(response => response.json())
            .then(json => {
                if(json.data){
                    //setTotalhours(json.data.total_hours)
                    //setViaticAmout(json.data.viatic_value)
                    //setHourAmout(json.data.hour_amount)
                    //setFeeAmount(json.data.fee_amount)
                    setLaborAmount(json.data.labor_price)
                    props.setCustomerProductWarrantyFromChild(props.customer_product.id, false, json.data.labor_price)
                }else{
                    console.log("No hay precio.")
                }
            })
            .catch(error => console.log(error));
        }
    }
    
	return (
		<React.Fragment>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <span className="mdl-navigation__link pull-right ">
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="number"
                            InputProps={{ shrink: true, inputProps: { min: 1} }} 
                            label={t('laborAmount')} name="laborAmout" 
                            value={laborAmout} onChange={(e) => setLaborAmount(e.target.value)} 
                            disabled={warranty}/>
                    </span>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <span className="mdl-navigation__link pull-right warranty-check">
                        <Checkbox color="primary" checked={warranty} onClick={(e) => handleWarrantyChange(e)} />
                        &nbsp;
                        <span className="quotation-product-name quotation-product-labor-price">{t('messageWarranty#1')} <strong>{t('messageWarranty#2')}</strong></span>
                    </span>
                </Grid>
            
            </Grid>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(QuotationProductWarranty)

