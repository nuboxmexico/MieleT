
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
import PaymentEmailDialog from "components/services/PaymentEmailDialog";
import NewScheduleDialog from "components/services/NewScheduleDialog";
import { flash_alert } from 'components/App';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
//Accordeon 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MaterialTable from 'react-data-table-component';
import InputLabel from '@material-ui/core/InputLabel';
// Dates
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteSparePartDialog from "components/services/DeleteSparePartDialog";
import EditSparePartDialog from "components/services/EditSparePartDialog";
import {csrf, headers, money_format, date_event_format, date_difference_in_hours, api_token, site_url, date_format_without_time} from "constants/csrf"

import {spare_part_delivery_status_label} from "constants/service_functions"
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

function ServiceSparePartsRequest(props){
    const {t} = useTranslation();
    const spare_part_columns = [
        {
        name: t('globalTables.sparePartColumns.tnr'),
        selector: 'spare_part.tnr',
        sortable: true,
        hide: 'sm',
        },
        {
        name: t('globalTables.sparePartColumns.name'),
        selector: 'spare_part.name',
        sortable: true,
        hide: 'md',
        
        },
        {
            name: t('globalTables.sparePartColumns.quantity'),
            selector: 'requested_quantity',
            sortable: true,
            hide: 'md',
            cell: row => (
                <>
                    {row.requested_quantity}&nbsp;&nbsp;{
                        row.reintegrated &&
                        <Chip
                            label= {t('globalTables.sparePartColumns.quantity')}
                            color="primary"
                        />
                    }
                </>
            ),
        },
        {
            name: t('globalTables.sparePartColumns.deliveryStatus'),
            selector: 'delivery_status',
            cell: row => (
              <span>
                {(row.delivery_status == "" ? t('globalText.noInfo') : spare_part_delivery_status_label(row.delivery_status))}
              </span>
            ),
        },
        {
            name: t('globalTables.sparePartColumns.background'),
            selector: 'background',
            cell: row => (
              <span>
                {(row.background == "" ? t('globalText.noInfo') : row.background)}
              </span>
            ),
        },
        {
            name: t('globalTables.sparePartColumns.actions'),
            selector: 'id',
            grow: true,
            minWidth: "190px",
            cell: row => (
            <span>
                <EditSparePartDialog key={"EditSparePartDialog"+row.id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} quantity={row.quantity} delivery_status={row.delivery_status}  background={row.background} requested_quantity={row.requested_quantity} from={"request"} callbacks={props.softCallback} headers={headers} />
                <DeleteSparePartDialog key={"DeleteSparePartDialog"+row.id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} from={"request"} headers={headers} />
            </span>
            ),
        }
    ];


    const spare_part_columns_no_actions = [
        {
        name: t('globalTables.sparePartColumnsNoActions.tnr'),
        selector: 'spare_part.tnr',
        sortable: true,
        hide: 'sm',
        },
        {
        name: t('globalTables.sparePartColumnsNoActions.name'),
        selector: 'spare_part.name',
        sortable: true,
        hide: 'md',
        },
        {
            name: t('globalTables.sparePartColumnsNoActions.requestedQuantity'),
            selector: 'requested_quantity',
            sortable: true,
            hide: 'md',
            cell: row => (
                <>
                    {row.requested_quantity}&nbsp;&nbsp;{
                        row.reintegrated &&
                        <Chip
                            label="t('globalTables.sparePartColumnsNoActions.refunded')"
                            color="primary"
                        />
                    }
                </>
            ),
        }
    ];

	return (
		<React.Fragment>

            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="paneladditional-header"
                >
                <h1 className="panel-custom-title">{t('services.serviceSparePartsRequest.title')}</h1>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <p className="service-subtitle">{t('services.serviceSparePartsRequest.subTitle')}</p>
                            
                        </Grid>
                        <Grid item xs={12}>
                            <MaterialTable
                                noHeader={true}
                                columns={(props.canEditRequestSparePart ? spare_part_columns : spare_part_columns_no_actions)}
                                data={props.spare_parts}
                                progressPending={props.userLoading}
                                progressComponent={<CircularProgress size={75} />}
                                responsive={true}
                                selectableRows
                                selectableRowsComponent={Checkbox}
                                selectableRowsComponentProps={{ className: "spare-part-checkbox", color: "primary" }} 
                                selectableRowSelected={row => (props.spare_parts.find(product => product.id === row.id && product.selected) != undefined) }
                                onSelectedRowsChange={props.handleRequestSparePartRowChange}
                                highlightOnHover={true}
                                striped={true}
                                contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                                noDataComponent={i18next.t('globalText.NoDataComponent')}
                                paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>

                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                                <KeyboardDatePicker
                                    className="payment-date-input full-width-height" 
                                    id="date-payment-dialog"
                                    label={t('services.serviceSparePartsRequest.sparePartDeliveryDate')}
                                    format="dd/MM/yyyy"
                                    value={props.spare_part_delivery_date}
                                    onChange={props.handleSparePartDeliveryDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl variant="outlined" className="MuiFormControl-fullWidth">
                                    <InputLabel id="principal_technician-simple-select-outlined-label">{t('services.serviceSparePartsRequest.principalTechnician')}</InputLabel>
                                    <Select
                                    labelId="principal_technician-simple-select-outlined-label"
                                    id="principal_technician-simple-select-outlined"
                                    value={props.principal_technician == null ? "" : props.principal_technician}
                                    onChange={(e) => props.setPrincipalTechnician(e.target.value)}
                                    label={t('services.serviceSparePartsRequest.principalTechnician')}
                                    name="principal_technician"
                                    >
                                    {props.service_technicians.map((service_technician) => (
                                        <MenuItem key={"principal_technician-"+service_technician.id} value={service_technician.id}>{service_technician.user.fullname} ({service_technician.user.email})</MenuItem>
                                    ))}
                                    </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {(props.country_change) &&
                                <NewScheduleDialog
                                    schedule_type="service"
                                    btn_classname={"full-width-height"}
                                    btn_text={t('services.serviceSparePartsRequest.technicalCalendarButton')}
                                    customer_id={props.customer_id}
                                    country={props.country}
                                    selectedProductRows={props.selectedProductRows}
                                    service_type={props.service_type}
                                    subcategory={props.subcategory}
                                    requested={props.requested}
                                    techinicianNumber={props.techinicianNumber}
                                    zipcode={props.zipcode}
                                    administrative_demarcation={props.administrative_demarcation}
                                    setTechinicianNumber={props.setTechinicianNumber}
                                    event={props.event}
                                    setEvent={props.setEvent}
                                    technicians_ids={props.technicians_ids}
                                    setTechniciansIds={props.setTechniciansIds}
                                    saveService={props.saveService}
                                    technicians={props.technicians}
                                    setTechnicians={props.setTechnicians}
                                    totalhours={props.totalhours}
                                    // Callbacks
                                    scheduleCallBack={props.scheduleCallBack}
                                />
                            }
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <br/>
                                <PaymentEmailDialog 
                                    email={props.customerEmail}
                                    paymentEmailDialog={props.paymentEmailDialog}
                                    setPaymentEmailDialog={props.setPaymentEmailDialog}
                                    loading={props.loading}
                                    setLoading={props.setLoading}
                                    saveService={props.saveService}
                                    paymentEmailAdditional={props.paymentEmailAdditional}
                                    setPaymentEmailAdditional={props.setPaymentEmailAdditional}
                                    isPaymentEmail={props.isPaymentEmail}
                                    setIsPaymentEmail={props.setIsPaymentEmail}
                                />
                                <div className={props.classes.wrapper}>
                                    <Button id="service-save" disabled={props.loading} type="submit" variant="contained" color="primary" onClick={props.handleSparePartSubmit}>
                                        {t('services.serviceSparePartsRequest.sparePartSubmitButton')}
                                    </Button>
                                    {props.loading && <CircularProgress size={24} className={props.classes.buttonProgress} />}
                                </div>
                                
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

export default connect(structuredSelector, mapDispatchToProps)(ServiceSparePartsRequest)
