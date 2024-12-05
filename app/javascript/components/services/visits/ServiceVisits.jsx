import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Grid from '@material-ui/core/Grid';
import { flash_alert } from 'components/App';
import { csrf, headers, money_format, date_format, date_event_format, date_difference_in_hours } from "constants/csrf"
import pluralize from 'pluralize';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import NewScheduleDialog from "components/services/NewScheduleDialog";
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import VisitTabs from "components/services/visits/VisitTabs";
import StartVisitBtn from "components/services/visits/StartVisitBtn";
import CanceVisitDialog from "components/services/visits/CanceVisitDialog";
import VisitTechnicians from "components/services/visits/VisitTechnicians";
import Chip from '@material-ui/core/Chip';
import { b2b_site_url } from '../../../constants/csrf';
import { fetchPaymentVisit } from 'api/visit'
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
      flexBasis: '13%',
    },
    ['@media (max-width:545px)']: { // eslint-disable-line no-useless-computed-key
      flexBasis: '100%',
    },
    p: {
      display: "inline-block",
    }
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

function ServiceVisits(props) {
  const { t } = useTranslation('translation', { keyPrefix: 'services.visits' });
  

  const classes = useStyles();

  const handleVisitChange = (panel) => (event, newExpanded) => {
  };

  const [event, setEvent] = useState({ start: "", end: "" });
  const [technicians_ids, setTechniciansIds] = useState("");
  const address_fn = [
  `${props.street_type_fn || ''} ${props.street_name_fn || ''}`.trim(),
  `${props.ext_number_fn || ''} ${props.int_number_fn || ''}`.trim(),
  props.administrative_demarcation_fn != null ? props.administrative_demarcation.admin3_admin1 : props.state_fn,
  !!props.zipcode_fn?.length ? (`Código Postal: ${props.zipcode_fn}`) : ""
  ].filter(u => !!u?.length).join(", ") || "-"


  function saveVisit(save_function_param = true, custom_event = null) {

    var body = new FormData();
    body.set('technicians_ids', technicians_ids);
    if (custom_event) {
      body.set('event_start', custom_event.start);
      body.set('event_end', custom_event.end);
    } else {
      body.set('event_start', event.start);
      body.set('event_end', event.end);
    }
    return axios.patch(`/api/v1/services/${props.serviceID}/visits/${save_function_param}/update_visit`, body, { headers: headers })
      .then(response => {
        flash_alert("Guardado", t('flashAlert.rescheduled'), "success")
        props.scheduleCallBack();
      })
      .catch(e => {
        if (e.response.data) {
          console.log(e.response.data);
          props.scheduleCallBack();
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });
  }

  async function confirmVisit(visit_id, visit) {
    const paymentVisit = await fetchPaymentVisit(visit.id, visit.service_id)
    const visitPaymentStatus = visitArePayment(visit)
    if (!visitPaymentStatus) {
      flash_alert("Error", t('flashAlert.unpaidVisit'), "danger")
      return
    }

    if (!visitPaymentStatus && !(!!Object.keys(paymentVisit).length && paymentVisit.status == 'completed')) {
      flash_alert("Error", t('flashAlert.unpaidVisit'), "danger")
      return
    }


    if (!props.ibsNumber) {
      flash_alert("Error", t('flashAlert.ibsNotPresent'), "danger")
      return
    }

    var body = new FormData();
    body.set('technicians_ids', technicians_ids);
    body.set('confirmed', true);
    return axios.patch(`/api/v1/services/${props.serviceID}/visits/${visit_id}/update_visit`, body, { headers: headers })
      .then(response => {
        flash_alert("Guardado", t('flashAlert.confirmVisit'), "success")
        props.scheduleCallBack();
      })
      .catch(e => {
        if (e.response.data) {
          console.log(e.response.data);
          props.scheduleCallBack();
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });
  }





  function startVisit(visit_id) {
    return axios.post(`/api/v1/visits/${visit_id}/start`, {}, { headers: headers })
      .then(response => {
        flash_alert("Guardado", t('flashAlert.visitStarted'), "success")
        props.scheduleCallBack();
      })
      .catch(e => {
        if (e.response.data) {
          console.log(e.response.data);
          props.scheduleCallBack();
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });

  }
  function finishVisit(visit_id) {
    return axios.post(`/api/v1/visits/${visit_id}/finish`, {}, { headers: headers })
      .then(response => {
        flash_alert("Guardado", t('flashAlert.visitEnded'), "success")
        props.scheduleCallBack();
      })
      .catch(e => {
        if (e.response.data) {
          console.log(e.response.data);
          props.scheduleCallBack();
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });

  }

  function arrivalVisit(visit_id) {
    return axios.post(`/api/v1/visits/${visit_id}/arrival`, {}, { headers: headers })
      .then(response => {
        flash_alert("Guardado", t('flashAlert.notificationOfArrival'), "success")
        props.scheduleCallBack();
      })
      .catch(e => {
        if (e.response.data) {
          console.log(e.response.data);
          props.scheduleCallBack();
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });

  }

  function visitArePayment(visit) {

    if (!visit) { return true }

    return visit.validated_payment || visit.payment_state == 'paid' || visit.no_payment
  }

  function lastVisitArePayment() {
    const lastQuotation = props.quotations[0] || []
    if (lastQuotation.length === 0) {
      return true
    }

    return lastQuotation.validated_payment
  }

  function handleNewVisit(e) {

    const lastVisit = props.visits[0]
    if (!(lastVisit.status == 'Visita completada')) {
      e.preventDefault()
      flash_alert("Error", t('flashAlert.finishTheLastVisit'), "danger")
      return
    }

    if (!lastVisitArePayment()) {
      e.preventDefault()
      flash_alert("Error", t('flashAlert.quoteNotPaid'), "danger")
      return
    }

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
            <Grid container
              className={classes.root}
              direction="row"
              justify="flex-end"
              alignItems="center">
              <Grid item xs={12} sm={2}>
                <Link className="new-visit-link pull-right" onClick={handleNewVisit} to={`/customers/${props.customer_id}/services/${props.serviceID}/new_visit`}>
                  <Button variant="outlined" color="primary">
                    {t('createVisit')}
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {props.visits && props.service_technicians && props.visits.map((visit, index) => {
                const labelId = `accordeon-visit-${visit.id}-${index}`;
                const current_techinician = props.service_technicians.find(function(technician) {
                  return technician.id == visit.principal_technician_id;
                }
                );
                return (
                  <Accordion defaultExpanded={visit.status != 'Visita completada'} onChange={handleVisitChange(labelId)} key={labelId}>
                    <AccordionSummary
                      className={'summary-container'}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${labelId}-content`}
                      id={`${labelId}-header`} >
                      <Typography className={classes.heading}>
                        <span className="visit-summary-1">{t('visit.title')}</span><br />
                        <span className="visit-summary-2"><strong>N° {props.visits.length - index} {visit.status == t("visit.completed") ? visit.status : (visit.confirmed ? t("visit.scheduled") : t("visit.preScheduled"))}</strong></span>
                        {
                          visit.non_compliance &&
                          <span className="visit-summary-2">
                            <Chip
                              size="small"
                              label="Incumplimiento"
                              color="primary"
                              variant="outlined"
                            />
                          </span>
                        }
                      </Typography>
                      <Typography className={classes.heading}>
                        <span className="visit-summary-1">{t('date')}</span><br />
                        <span className="visit-summary-2">{visit.calendar_event && date_event_format(visit.calendar_event.start_date, visit.calendar_event.finish_date)}</span>
                      </Typography>
                      <Typography className={classes.heading}>
                        <span className="visit-summary-1">{t('principalTechnician')}</span><br />
                        {current_techinician && <span className="visit-summary-2">{(current_techinician.enterprise != "" && current_techinician.enterprise != null) ? current_techinician.user.fullname + " (" + current_techinician.enterprise + ")" : current_techinician.user.fullname}</span>}
                      </Typography>
                      <Typography className={classes.heading}>
                        <span className="visit-summary-1">{t('waitTime')}</span><br />
                        <span className="visit-summary-2">{visit.arrival_time_diff} {pluralize(t('hour'), visit.time_diff)}</span>
                      </Typography>

                      <Typography className={classes.heading}>
                        <span className="visit-summary-1">{t('visitTime')}</span><br />
                        <span className="visit-summary-2">{visit.time_diff} {pluralize(t('hour'), visit.time_diff)}</span>
                      </Typography>
                      <Typography className={classes.heading + " visit-actions"}>
                        {visit.canceled_at == null && props.canConfirmVisit &&
                          <Typography className={classes.heading}>
                            <Button disabled={visit.confirmed} className={props.btn_classname + "customers-scheddule-visit-link"} color="primary" onClick={() => confirmVisit(visit.id, visit)}>
                              <Tooltip title={
                                <React.Fragment>
                                  <div className="service-tooltip" dangerouslySetInnerHTML={{ __html: ("Confirmar visita" || "") }} />
                                </React.Fragment>} arrow>
                                {<i className="material-icons">done</i>}
                              </Tooltip>
                            </Button>
                          </Typography>
                          ||

                          <Typography className={classes.heading}>
                            <Button disabled={visit.confirmed} className={props.btn_classname + "customers-scheddule-visit-link"} color="primary" onClick={() => confirmVisit(visit.id, visit)}>
                              <Tooltip title={
                                <React.Fragment>
                                  <div className="service-tooltip" dangerouslySetInnerHTML={{ __html: (`<span className="visit-summary-2">(${date_format(visit.canceled_at)}), ${visit.cancel_from}, Motivo: ${visit.cancel_reason}</span>` || "") }} />
                                </React.Fragment>} arrow>
                                {<span className="visit-summary-1">{t('visitCancel')}</span>}
                              </Tooltip>
                            </Button>


                          </Typography>
                        }

                        <Typography className={classes.heading}>
                          {visit.canceled_at == null &&
                            <NewScheduleDialog
                              key={"visit-schedule-" + visit.id}
                              schedule_type="visit"
                              btn_classname={""}
                              btn_text={"Reagendar visita"}
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
                              event={event}
                              setEvent={setEvent}
                              technicians_ids={technicians_ids}
                              setTechniciansIds={setTechniciansIds}
                              saveService={saveVisit}
                              technicians={props.technicians}
                              setTechnicians={props.setTechnicians}

                              // Visit specific
                              current_visit={visit.id}
                              current_event={visit.calendar_event && { start: visit.calendar_event.start_date, end: visit.calendar_event.finish_date }}
                              // Callbacks
                              scheduleCallBack={props.scheduleCallBack}
                            />
                          }

                        </Typography>
                        {visit.canceled_at == null &&
                          <StartVisitBtn
                            visit_id={visit.id}
                            startVisit={startVisit}
                            finishVisit={finishVisit}
                            arrivalVisit={arrivalVisit}
                            key={"visit-btn-" + visit.id}
                            classes={classes}
                          />
                        }
                        <CanceVisitDialog
                          key={"visit-cancel-" + visit.id}
                          classes={classes}
                          visit={visit}
                          btn_classname={props.btn_classname}
                          callbacks={props.scheduleCallBack}
                        />
                      </Typography>

                    </AccordionSummary>
                    <AccordionDetails className="visit-accordeon-details">
                      <Grid container spacing={1}>

                        <VisitTechnicians
                          service_technicians={props.service_technicians}
                          visit={visit}
                        />
                        <Grid item xs={12} sm={1}>
                          <span className="visit-summary-1">{t('bill')}</span><br />
                          <span className="visit-summary-2">{props.invoiceCheck}</span>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <span className="visit-summary-1">{t('billingAddress')}</span><br />
                          <span className="visit-summary-2">{address_fn}</span>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <span className="visit-summary-1">{t('startTime')}</span><br />
                          <span className="visit-summary-2">{visit.start_time ? date_format(visit.start_time) : "-"}</span>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <span className="visit-summary-1">{t('endTime')}</span><br />
                          <span className="visit-summary-2">{visit.finish_time ? date_format(visit.finish_time) : "-"}</span>
                        </Grid>
                        {
                          visit.status == "Visita completada" &&
                          <Grid item xs={12} sm={4} className={"visit-download-link-container"}>
                            <a className="mdl-navigation__link MuiButton-textPrimary" href={`/services/${props.serviceID}/report_pdf?visit_id=${visit.id}`} target="_blank">
                              <i className="material-icons">download</i> {t('downloadReport')}
                            </a>
                          </Grid>
                        }
                        {
                          visit.dispatch_guide_url_pdf != null && //quizas poner igual distinto de ""
                          <Grid item xs={12} sm={7} className={"visit-download-link-container"}>
                            <a className="mdl-navigation__link MuiButton-textPrimary" href={`${b2b_site_url(process.env.RAILS_ENV)}` + visit.dispatch_guide_url_pdf} target="_blank">
                              <i className="material-icons">download</i>{t('downloadShippingGuide')} {visit.dispatch_guide}
                            </a>
                          </Grid>
                        }
                        <Grid item xs={12} style={{ marginTop: "15px" }}>
                          <VisitTabs
                            subcategory={props.subcategory}
                            customerID={props.customer_id}
                            serviceID={props.serviceID}
                            service_type={props.service_type}
                            visit={visit}
                            paymentChannel={props.paymentChannel}
                            country={props.country}
                            totalAmount={props.totalAmount}
                            noPaymentCheck={props.noPaymentCheck}
                            noPaymentOption={props.noPaymentOption}
                            validated_payment={props.validated_payment}
                            invoiceCheck={props.invoiceCheck}
                            paymentFiles={props.paymentFiles}
                            // Totals
                            selectedPaymentDate={props.selectedPaymentDate}
                            customerPaymentDate={props.customerPaymentDate}
                            totalhours={props.totalhours}
                            hourAmout={props.hourAmout}
                            feeAmount={props.feeAmount}
                            laborAmount={props.laborAmount}
                            consumableAmount={props.consumableAmount}
                            ivaAmount={props.ivaAmount}
                            viaticAmout={props.viaticAmout}
                            subtotalAmount={props.subtotalAmount}
                            totalAmount={props.totalAmount}
                            selectedConsumables={props.selectedConsumables}
                            // Bill address
                            zipcode_fn={props.zipcode_fn}
                            state_fn={props.state_fn}
                            delegation_fn={props.delegation_fn}
                            colony_fn={props.colony_fn}
                            street_type_fn={props.street_type_fn}
                            street_name_fn={props.street_name_fn}
                            ext_number_fn={props.ext_number_fn}
                            int_number_fn={props.int_number_fn}
                            phone_fn={props.phone_fn}
                            administrative_demarcation_fn={props.administrative_demarcation_fn}

                            //callbacks
                            callbacks={props.callbacks}

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

export default connect(structuredSelector, mapDispatchToProps)(ServiceVisits)

