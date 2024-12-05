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

import { flash_alert } from 'components/App';

import CircularProgress from '@material-ui/core/CircularProgress';
//Accordeon 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Dates
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { DropzoneArea } from 'material-ui-dropzone';

//List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {csrf, headers, money_format, date_event_format, date_difference_in_hours, api_token, site_url, payment_channel_label} from "constants/csrf"
import { FileIcon, defaultStyles } from 'react-file-icon';
import mime from "mime-to-extensions";
function ServicePayment(props){

	return (
		<React.Fragment>

            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="paneladditional-header"
                >
                <h1 className="panel-custom-title">Pago de servicio</h1>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <p className="service-subtitle">Detalles del pago</p>
                            <Grid container spacing={3} className={props.noPaymentCheck ? "hidden" : ""}>
                                <Grid item xs={12} sm={6}>
                                    <span className="service-price-table-label">Método de pago</span>
                                    <span className="service-price-table-value">
                                        {props.paymentData[0] != undefined && (payment_channel_label(props.paymentChannel) + " - " + props.paymentData[0].payment_method_name)}
                                        {(props.paymentData[0] == undefined && props.validated_payment) && "Si. Manual"}
                                    
                                    </span>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <span className="service-price-table-label">Valor</span>
                                    <span className="service-price-table-value">
                                        {props.paymentData[0] != undefined && money_format(props.country, props.paymentData[0].amount)}
                                        {(props.paymentData[0] == undefined && props.validated_payment) && money_format(props.country, props.totalAmount)}
                                    </span>
                                </Grid>
                                <Grid item xs={12}>
                                    <span className="service-price-table-label">¿El cliente requiere factura? <strong>{props.invoiceCheck}</strong></span>
                                </Grid>

                                {props.invoiceCheck === "si" &&
                                    <Grid item xs={12}>
                                        <span className="service-price-table-label">Dirección de facturación</span>
                                        <span className="service-price-table-value">
                                            {`${props.street_type_fn} ${props.street_name_fn}, ${props.ext_number_fn} ${props.int_number_fn}, ${props.administrative_demarcation_fn != null ?  props.administrative_demarcation_fn.admin3_admin1 : props.state_fn}${props.zipcode_fn != "" ? (", Código Postal: " + props.zipcode_fn) : "" }`}
                                        </span>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                                        <KeyboardDatePicker
                                            className="payment-date-input"
                                            id="date-payment-dialog"
                                            label="Fecha de pago"
                                            format="dd/MM/yyyy"
                                            value={props.customerPaymentDate}
                                            onChange={props.handleCustomerPaymentDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                                        <KeyboardDatePicker
                                            className="payment-date-input"
                                            id="date-payment-dialog"
                                            label="Fecha límite de pago"
                                            format="dd/MM/yyyy"
                                            value={props.selectedPaymentDate}
                                            onChange={props.handlePaymentDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                { new Date() >= props.selectedPaymentDate &&
                                    <>
                                        <Grid item xs={12}>
                                            <span className="service-price-table-value warning-text mdl-navigation__link">
                                                <i className="material-icons material-icons-20">warning</i> Fecha límite de pago expiró, regendar servicio.
                                            </span>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button id="new-sell" variant="contained" color="primary">
                                                REAGENDAR servicio
                                            </Button>
                                        </Grid>
                                    </>
                                }
                            </Grid>
                            <Grid container spacing={2} className={props.noPaymentCheck ? "" : "hidden"}>
                                <Grid item xs={12}>
                                    <span className="service-price-table-label">Motivo de no pago</span>
                                    <span className="service-price-table-value">{props.noPaymentOption}</span>
                                </Grid>
                            </Grid>
                            <br/>
                            {!props.validated_payment &&
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Button id="service-save-payment" size="large"  disabled={props.loading} type="submit" variant="outlined" color="primary" onClick={props.handleValidatePaymentSubmit}>
                                            Validar pago
                                        </Button>
                                        {props.loading && <CircularProgress size={24} className={props.classes.buttonProgress} />}
                                        
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                        
                        <Grid item xs={12} sm={6} className="service-price-table-container">
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <p className="service-subtitle">Respaldos</p>
                                    <Grid item xs={12}>
                                        <DropzoneArea
                                            name={"services_files"}
                                            dropzoneText={"Arrastre su archivo aqui, o haga click para seleccionarlo"}
                                            onChange={props.onServiceChangeFiles}
                                            showPreviews={true}
                                            showPreviewsInDropzone={false}
                                            useChipsForPreview
                                            previewGridProps={{container: { spacing: 1, direction: 'row' }}}
                                            previewChipProps={{classes: { root: props.classes.previewChip } }}
                                            previewText="Archivos seleccionados"
                                            filesLimit={10}
                                            showAlerts={false}
                                            maxFileSize={10000000}
                                            alertSnackbarProps={{anchorOrigin: { vertical: 'top', horizontal: 'right' }}}
                                            onAlert={props.handleMessage}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <p className="service-subtitle">Archivos subidos</p>
                                    <List dense className={props.classes.root}>
                                        {props.paymentFiles && props.paymentFiles.map((serviceFile) => {
                                            return (
                                                <ListItem key={"serviceFile"+serviceFile.id} button>
                                                    <ListItemAvatar className="service-payment-icon">
                                                        <FileIcon
                                                                size={2}
                                                                extension={mime.extension(serviceFile.mime)}
                                                                {...defaultStyles[mime.extension(serviceFile.mime)]}
                                                            />  
                                                    </ListItemAvatar>
                                                    <a className="new-service-link" href={serviceFile.resource_url} target="_blank">
                                                        <Button size="small" color="primary">
                                                            {serviceFile.name}
                                                        </Button>
                                                    </a>
                                                    <ListItemSecondaryAction>
                                                        
                                                        <Button size="small" color="primary" onClick={() => props.handleClickOpenImageDialog(serviceFile.id)}>
                                                            <i className="material-icons">delete</i>
                                                        </Button>
                                                    </ListItemSecondaryAction>
                                                </ListItem>            
                                            );
                                        })}
                                    </List>
                                </Grid>
                            </Grid>
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

export default connect(structuredSelector, mapDispatchToProps)(ServicePayment)
