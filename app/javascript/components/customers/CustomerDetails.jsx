import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ReactCountryFlag from "react-country-flag";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import DeleteAdditionalAddressDialog from "components/customers/DeleteAdditionalAddressDialog"
import {useTranslation} from "react-i18next"

function CustomerDetails(props){
    const {t} = useTranslation();

  	return (
  		<React.Fragment>
            { !props.no_customer_data &&
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <h1 className="panel-custom-title">{t('services.dataCustomer.data')}</h1>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={1}>
                            <Grid item xs={12} className="show-customer-edit-link">
                                <Link className="mdl-navigation__link brand-primary-link customers-edit-link" to={`/customers/${props.customer_id}/edit`}>
                                    <i className="material-icons">edit</i> {t('globalText.edit')}
                                </Link>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <p className="light-label">
                                    {t('services.dataCustomer.country')}
                                </p>
                                <p className="normal-label">
                                    <ReactCountryFlag
                                        countryCode={props.country}
                                        svg
                                        style={{
                                            width: '2em',
                                            height: '2em',
                                            marginRight: "15px",
                                        }}
                                        title={props.country}
                                    />
                                    {props.country_names.find(object => object["iso"] ===  props.country).name}
                                </p>
                            </Grid>
                            <Grid className={props.personCheck} item xs={12} sm={3}>
                                <p className="light-label">
                                    {t('services.dataCustomer.type')}
                                </p>
                                <p className="normal-label">
                                    {props.selectedPerson == "person_p" ? "Física" : "Moral" }
                                </p>
                            </Grid>
                            <Grid className={props.RUTCheck} item xs={12} sm={3}>
                                <p className="light-label">
                                    {t('services.dataCustomer.rut')}
                                </p>
                                <p className="normal-label">
                                    {props.rut}
                                </p>
                            </Grid>
                        </Grid>	
                    </AccordionDetails>
                </Accordion>
             }
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header-address"
                >
                <h1 className="panel-custom-title">{t('services.customerAddress.title')}</h1>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={1}>
                        <Grid item xs={12} className="show-customer-edit-link">
                            <Link className="mdl-navigation__link brand-primary-link customers-edit-link" to={`/customers/${props.customer_id}/edit`}>
                                <i className="material-icons">edit</i> {t('globalText.edit')}
                            </Link>
                        </Grid>
                        <Grid className={props.zipcodeCheck} item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.zipcodeCheck')}
                            </p>
                            <p className="normal-label">
                                {props.zipcode && props.zipcode || t('globalText.noInfo')}
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.StreetType')}
                            </p>
                            <p className="normal-label">
                                {props.street_type && props.street_type || t('globalText.noInfo')}
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.streetName')}
                            </p>
                            <p className="normal-label">
                                {props.street_name && props.street_name || t('globalText.noInfo')}
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.extNumber')}
                            </p>
                            <p className="normal-label">
                                {props.ext_number && props.ext_number || t('globalText.noInfo')}
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.intNumber')}
                            </p>
                            <p className="normal-label">
                                {props.int_number && props.int_number || t('globalText.noInfo')}
                            </p>
                        </Grid>
                        <Grid className={props.delegationCheck}  item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.delegation')}
                            </p>
                            <p className="normal-label">
                                {props.delegation && props.delegation || t('globalText.noInfo')}
                            </p>
                        </Grid>
                        <Grid className={props.colonyCheck} item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.colony')}
                            </p>
                            <p className="normal-label">
                                {props.colony && props.colony || t('globalText.noInfo')}
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <p className="light-label">
                                {props.stateLabel}
                            </p>
                            <p className="normal-label">
                                {props.administrative_demarcation && (props.administrative_demarcation != null ?  props.administrative_demarcation.admin3_admin1 : props.state) || t('globalText.noInfo')}      
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.references')}
                            </p>
                            <p className="normal-label">
                                {props.reference && props.reference || t('globalText.noInfo')}
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <p className="light-label">
                                {t('services.customerAddress.phone')}
                            </p>
                            <p className="normal-label">
                                {props.phone && props.phone || t('globalText.noInfo')}
                            </p>
                        </Grid>
                        {props.additionalsAddresses.map((additionalsAddress) => {
                            const labelId = `additionalsAddress-element-${additionalsAddress.id}`;

                            return (
                            <Grid  id={labelId} key={"customer-additional-"+additionalsAddress.id} item xs={12}>
                                <div className="MuiButtonBase-root Mui-expanded">
                                    <div className="MuiAccordionSummary-content Mui-expanded">
                                        <h1 className="panel-custom-title">Dirección adicional</h1>
                                    </div>
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} className="show-customer-edit-link">
                                        <Link className="mdl-navigation__link brand-primary-link additionalsAddress-edit-link  mg-r-5" to={`/customers/${props.customer_id}/additional_address/${additionalsAddress.id}/edit`}>
                                            <i className="material-icons">edit</i> {t('globalText.edit')}
                                        </Link>
                                        <DeleteAdditionalAddressDialog key={"customer-additional-delete-"+additionalsAddress.id} additional_address_id={additionalsAddress.id} name={additionalsAddress.name} headers={props.headers} />
                                    </Grid>

                                    <Grid className={props.zipcodeCheck} item xs={12} sm={3}>
                                        <p className="light-label">
                                            {t('services.customerAddress.zipcodeCheck')}
                                        </p>
                                        <p className="normal-label">
                                            {additionalsAddress.zipcode && additionalsAddress.zipcode || t('globalText.noInfo')}
                                        </p>
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <p className="light-label">
                                            {t('services.customerAddress.StreetType')}
                                        </p>
                                        <p className="normal-label">
                                            {additionalsAddress.street_type && additionalsAddress.street_type || t('globalText.noInfo')}
                                        </p>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <p className="light-label">
                                            {t('services.customerAddress.streetName')}
                                        </p>
                                        <p className="normal-label">
                                            {additionalsAddress.street_name && additionalsAddress.street_name || t('globalText.noInfo')}
                                        </p>
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <p className="light-label">
                                            {props.extNumberLabel}
                                        </p>
                                        <p className="normal-label">
                                            {additionalsAddress.ext_number && additionalsAddress.ext_number || t('globalText.noInfo')}
                                        </p>
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <p className="light-label">
                                            {props.intNumberLabel}
                                        </p>
                                        <p className="normal-label">
                                            {additionalsAddress.int_number && additionalsAddress.int_number || t('globalText.noInfo')}
                                        </p>
                                    </Grid>

                                    <Grid className={props.delegationCheck}  item xs={12} sm={3}>
                                        <p className="light-label">
                                            {t('services.customerAddress.delegation')}
                                        </p>
                                        <p className="normal-label">
                                            {additionalsAddress.delegation && additionalsAddress.delegation || t('globalText.noInfo')}
                                        </p>
                                    </Grid>
                                    <Grid className={props.colonyCheck} item xs={12} sm={3}>
                                        <p className="light-label">
                                            {t('services.customerAddress.colony')}
                                        </p>
                                        <p className="normal-label">
                                            {additionalsAddress.colony && additionalsAddress.colony || t('globalText.noInfo')}
                                        </p>
                                    </Grid>
                                    
                                    
                                    <Grid item xs={12} sm={3}>
                                        <p className="light-label">
                                            {props.stateLabel}
                                        </p>
                                        <p className="normal-label">
                                            {additionalsAddress.administrative_demarcation && (additionalsAddress.administrative_demarcation != null ?  additionalsAddress.administrative_demarcation.admin3_admin1 : additionalsAddress.state) || t('globalText.noInfo')}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Grid>
                            );
                        })}
                        <Grid item xs={12}>
                            <Button variant="outlined" color="primary">
                                <Link className="mdl-navigation__link brand-primary-link add-additionaladdress-link" to={`/customers/${props.customer_id}/additional_address`}>
                                    <i className="material-icons">home</i>&nbsp;&nbsp;{t('services.customerAddress.additionalAddress')}</Link>
                            </Button>
                        </Grid>
                        
                    </Grid>	
                </AccordionDetails>
            </Accordion>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(CustomerDetails)
