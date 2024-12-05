import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Grid from '@material-ui/core/Grid';
import { flash_alert } from 'components/App';
import {csrf, headers, money_format, date_format,date_event_format, date_difference_in_hours} from "constants/csrf"
import pluralize from 'pluralize';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import QuotationTabs from "components/services/quotations/QuotationTabs";

import QuotationVersions from "components/services/quotations/QuotationVersions";
import {useTranslation} from "react-i18next"


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
        ['@media (min-width:1100px)']: { // eslint-disable-line no-useless-computed-key
            flexBasis: 'auto',
        },
        ['@media (max-width:545px)']: { // eslint-disable-line no-useless-computed-key
            flexBasis: '100%',
        },
        p:{
            display: "inline-block",
        }
      },
    heading_last: {
        flexBasis: '33.33%',
    },
    secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    },
}));


  

function QuotationsList(props){
    const { t } = useTranslation('translation', { keyPrefix: 'services.quotes' });
    const classes = useStyles();
    const handleQuotationChange = (panel) => (event, newExpanded) => {
    };

    function downloadQuotation(quotation_id){
        window.open(`/quotations/${quotation_id}/show`,'_newtab');
    }

    
	return (
		<React.Fragment>

            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="paneladditional-header"
                >
                <h1 className="panel-custom-title">{t('title')}</h1>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={1}>
                    
                        <Grid item xs={12}>       
                            {props.quotations && props.quotations.map((quotation, index) => {
                                const labelId = `accordeon-quotation-${quotation.id}-${index}`;
                                return (
                                        <Accordion onChange={handleQuotationChange(labelId)} key={labelId}>
                                            <AccordionSummary 
                                                className={'summary-container quotation-container'}
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`${labelId}-content`}
                                                id={`${labelId}-header`} >
                                                <Typography className={classes.heading}>
                                                    
                                                    <span className="visit-summary-1">{t('rowQuote')}</span><br/>
                                                    <span className="visit-summary-2"><strong>N° {props.quotations.length - index}</strong></span>
                                                </Typography>
                                                <Typography className={classes.heading}>
                                                    <span className="visit-summary-1">{t('rowDate')}</span><br/>
                                                    <span className="visit-summary-2">{date_format(quotation.created_at)}</span>
                                                </Typography>
                                                <Typography className={classes.heading}>
                                                    <span className="visit-summary-1">{t('rowUntil')}</span><br/>
                                                    <span className="visit-summary-2">{date_format(quotation.valid_until)}</span>
                                                </Typography>
                                                <Typography className={classes.heading_last}>
                                                    <Button className={props.btn_classname + "customers-scheddule-visit-link"} color="primary" onClick={() => downloadQuotation(quotation.id) }>
                                                        <Tooltip title={
                                                                <React.Fragment>
                                                                    <div className="service-tooltip" dangerouslySetInnerHTML={{__html: (`<span className="visit-summary-2">Descargar cotización</span>` || "")}} /> 
                                                                </React.Fragment>} arrow>
                                                            { <i className="material-icons">download</i> }
                                                        </Tooltip>
                                                    </Button>
                                                    <QuotationVersions 
                                                        quotation={quotation}
                                                        btn_classname={props.btn_classname}
                                                    />
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails className="visit-accordeon-details">
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <QuotationTabs
                                                            index ={index}
                                                            customerPaymentDate={props.customerPaymentDate}
                                                            selectedPaymentDate={props.selectedPaymentDate}
                                                            invoiceCheck={props.invoiceCheck}
                                                            validated_payment={props.validated_payment}
                                                            noPaymentCheck={props.noPaymentCheck}
                                                            totalAmount={props.totalAmount}
                                                            paymentChannel={props.paymentChannel}
                                                            serviceID={props.serviceID}
                                                            current_user={props.current_user}
                                                            quotation={quotation}
                                                            service_type={props.service_type}
                                                            country={props.country}
                                                            countryIVA={props.countryIVA}
                                                            zipcode={props.zipcode}
                                                            administrative_demarcation={props.administrative_demarcation}
                                                            
                                                            customer_products={props.selectedProductRows}
                                                            callbacks={props.callbacks}
                                                            setLoading={props.setLoading}
                                                            email={props.email}
                                                            email2={props.email2}
                                                            serviceStatusLabel={props.serviceStatusLabel}
                                                            // ADD SPARE PARTS
                                                            
                                                            userLoading={props.userLoading}
                                                            canAddSparePart={props.canAddSparePart}
                                                            displayProducTable={props.displayProducTable}
                                                            classes={props.classes}
                                                            filterText={props.filterText}
                                                            changeFilterText={props.changeFilterText}
                                                            handleClear={props.handleClear}
                                                            handleAddSparePart={props.handleAddSparePart}
                                                            products_columns={props.products_columns}
                                                            products={props.products}
                                                            total={props.total}
                                                            handleProductsPerRowsChange={props.handleProductsPerRowsChange}
                                                            handleProductsPageChange={props.handleProductsPageChange}
                                                            handleProductRowChange={props.handleProductRowChange}
                                                            selectedSparePartsRows={props.selectedSparePartsRows}

                                                            // Viatic amount
                                                            viaticAmout={quotation.viatic_amount > 0 && quotation.viatic_amount || props.viaticAmout}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                );
                            })}
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

export default connect(structuredSelector, mapDispatchToProps)(QuotationsList)

