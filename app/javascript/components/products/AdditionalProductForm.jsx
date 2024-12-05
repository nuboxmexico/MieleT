import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import {csrf, headers} from "constants/csrf"
import { flash_alert } from 'components/App';
import {useTranslation} from "react-i18next"
function AdditionalProductForm(props){
    const {t} = useTranslation();
    const [business_unit, setBusinessUnit] = useState("");
    const [family, setFamily] = useState("");
    const [subfamily, setSubFamily] = useState("");
    const [product_name, setProductName] = useState("");
    
    useEffect(() => {
	});

    function handleSubmit(event) {
        event.preventDefault();
        
        var body = new FormData();
        body.set('customer_id', props.customer_id);
        body.set('business_unit', business_unit);
        body.set('family', family);
        body.set('subfamily', subfamily);
        body.set('product_name', product_name);
        return axios.post(`/api/v1/customers/${props.customer_id}/create_product_additional`, body, { headers: headers})
            .then(response => {
                flash_alert("Creado", "El producto ha sido creado satisfactoriamente", "success")
                props.getCustomerProducts(props.customer_id)
                
            })
        .catch(e => {
            if(e.response.data){
                for (var key in e.response.data) {
                    flash_alert(t('globalText.error'), e.response.data[key], "danger")
                }
            }
        });
    }

    return (
        <React.Fragment>
              <form className="additional-product-form" onSubmit={handleSubmit} autoComplete="off">
                    
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={2}>
                                <TextField fullWidth variant="outlined" label={t('services.additionalProductForm.businessUnit')} name="business_unit" value={business_unit} onChange={(e) => setBusinessUnit(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField fullWidth variant="outlined" label={t('services.additionalProductForm.family')}  name="family" value={family} onChange={(e) => setFamily(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField fullWidth variant="outlined" label={t('services.additionalProductForm.subFamily')}  name="subfamily" value={subfamily} onChange={(e) => setSubFamily(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <TextField fullWidth variant="outlined" label={t('services.additionalProductForm.productName')}  name="product_name" value={product_name} onChange={(e) => setProductName(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12} sm={1}>
                                <FormControl className="search-btn-full-height">
                                    <Button id="product-additional-save" className="search-btn-full-height" type="submit" variant="contained" color="primary">
                                       {t('globalText.addButton')}
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>              
                    
              </form>
      </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(AdditionalProductForm)
