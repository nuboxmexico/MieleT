import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';

import { Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core'
// Dates
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { headers_www_form, money_format, payment_channel_label } from "constants/csrf"

const payment_options = ["Online", "Transferencia", "Por Teléfono", "Cliente realiza depósito bancario", "Cliente paga en domicilio", "Garantía producto/manufactura", "Garantía Reparación/Instalación", "Instalación sin costo", "Visita en cortesía", "Segunda visita Póliza"]


function QuotationPaymentDetail(props) {
  const [quotationPaymentMethod, setQuotationPaymentMethod] = useState("");
  const [selectedPaymentDate, setSelectedPaymentDate] = useState("");
  const [customerPaymentDate, setCustomerPaymentDate] = useState("");
  const [validated_payment, setValidatedPayment] = useState(false);

  useEffect(() => {
    console.log(props.selectedConsumables)
  }, [props.selectedConsumables]);


  useEffect(() => {
    setCustomerPaymentDate(Date.parse(props.customerPaymentDate))
  }, [props.customerPaymentDate]);

  useEffect(() => {
    setCustomerPaymentDate(props.paymentDate)
  }, [props.paymentDate]);


  useEffect(() => {
    setValidatedPayment(props.validated_payment)
  }, [props.validated_payment]);

  useEffect(() => {
    if (props.quotation) {
      setCustomerPaymentDate(props.paymentDate)
    }
  }, [props.quotation]);


  const handleCustomerPaymentDateChange = (date) => {
    setCustomerPaymentDate(date);
  };

  const handlePaymentDateChange = (date) => {
    setSelectedPaymentDate(date);
  };

  useEffect(() => {
    if (props.quotation) {
      props.quotation.payment_date && setSelectedPaymentDate(props.quotation.payment_date)
      if (props.paymentData[0] == undefined) {
        setCustomerPaymentDate(props.quotation.customer_payment_date)
      }
      setQuotationPaymentMethod(props.quotation.payment_channel)
      setValidatedPayment(props.quotation.validated_payment)
    }
  }, [props.quotation]);

  async function validatePayment() {
    var body = new FormData();
    props.setLoading(true);
    body.set('id', props.quotation.id);
    body.set('service_id', props.serviceID);
    body.set('payment_date', selectedPaymentDate);
    body.set('customer_payment_date', customerPaymentDate);
    body.set('payment_channel', payment_channel_label(quotationPaymentMethod));
    return axios.patch(`/api/v1/quotations/${props.quotation.id}/validate_payment`, body, { headers: headers_www_form })
      .then(response => {
        console.log(response)
        flash_alert("", "Cotización actualizada con éxito", "success");
        props.callbacks()
        props.setLoading(false);
      })
      .catch(e => {
        console.log(e);
        if (e.response.data) {
          props.setLoading(false);
          console.log(e.response.data);
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });
  }


  const existsCustomerPaymentDate = !!props.quotation.customer_payment_date
  const existsPaymentChannel = !!props.quotation.payment_channel
  const existsPaymentDate = !!props.quotation.payment_date
  const validateButton = () => existsCustomerPaymentDate && existsPaymentChannel && existsPaymentDate

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <p className="service-subtitle">Detalles de pago de Cotización</p>
          <Grid container spacing={3} className={""}>
            <Grid item xs={12}>
              <span className={`mdl-navigation__link service-price-table-value service-price-table-value-check ${((props.paymentData[0] != undefined && props.paymentData[0].status == "completed") || validated_payment) ? "green-label" : "red-label"}`}>
                {((props.paymentData[0] != undefined && props.paymentData[0].status == "completed") || validated_payment) ? <i className="material-icons">done</i> : <i className="material-icons">close</i>}
                {((props.paymentData[0] != undefined && props.paymentData[0].status == "completed") || validated_payment) ? "Cotización Pagada" : "Cotización No Pagada"}
              </span>
            </Grid>
            <Grid item xs={12} sm={6}>
              {props.paymentData[0] != undefined && customerPaymentDate != "" &&
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                  <KeyboardDatePicker
                    className="payment-date-input"
                    id="date-payment-dialog"
                    label="Fecha de pago"
                    format="dd/MM/yyyy"
                    disabled={existsCustomerPaymentDate}
                    value={customerPaymentDate}
                    emptyLabel={'dd/mm/yyyy'}
                    invalidLabel={'dd/mm/yyyy'}
                    onChange={handleCustomerPaymentDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              }
              {props.paymentData[0] == undefined &&
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                  <KeyboardDatePicker
                    className="payment-date-input"
                    id="date-payment-dialog"
                    emptyLabel={'dd/mm/yyyy'}
                    invalidLabel={'dd/mm/yyyy'}
                    label="Fecha de pago"
                    format="dd/MM/yyyy"
                    disabled={existsCustomerPaymentDate}
                    value={customerPaymentDate}
                    onChange={handleCustomerPaymentDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              }

            </Grid>

            {props.paymentData[0] &&
              <Grid item xs={12} sm={6}>
                <span className="service-price-table-label">Hora de pago</span>
                <span className="visit-summary-2">{props.paymentTime}</span>
              </Grid>
            }
            {props.paymentData[0] != undefined &&
              <Grid item xs={12} sm={6}>
                <span className="service-price-table-label">Valor</span>
                <span className="service-price-table-value">
                  {props.paymentData[0] != undefined && money_format(props.country, props.paymentData[0].amount)}
                  {(props.paymentData[0] == undefined && validated_payment) && money_format(props.country, props.totalAmount)}
                </span>
              </Grid>
            }
            {props.paymentData[0] != undefined &&
              <Grid item xs={12} sm={6}>
                <span className="service-price-table-label">N° de Referencia de la transacción</span>
                <span className="visit-summary-2">{props.paymentData[0].transaction_id}</span>
              </Grid>
            }

            <Grid item xs={12} sm={6}>
              <span className="service-price-table-label">Método de pago</span>
              <span className="visit-summary-2">
                {props.paymentData[0] != undefined && props.paymentData[0].payment_method_id == 1 && props.paymentType//(payment_channel_label(props.paymentChannel) + " - " + props.paymentData[0].payment_method_name)}
                }
                {props.paymentData[0] != undefined && props.paymentData[0].payment_method_id != 1 && (payment_channel_label(props.paymentChannel) + " - " + props.paymentData[0].payment_method_name)}
                {(props.paymentData[0] == undefined && validated_payment) && "Si. Manual"}
              </span>
              {props.paymentData[0] == undefined &&
                <FormControl variant="outlined" className="MuiFormControl-fullWidth">
                  <InputLabel id="service_type-simple-select-outlined-label">Seleccione</InputLabel>
                  <Select
                    labelId="service_type-simple-select-outlined-label"
                    disabled={existsPaymentChannel}
                    id="service_type-simple-select-outlined"
                    value={payment_channel_label(quotationPaymentMethod)}
                    onChange={(e) => setQuotationPaymentMethod(e.target.value)}
                    label="Tipo de Servicio"
                    name="service_type"
                  >
                    {payment_options.map((value) => (
                      <MenuItem key={"service_type-" + value} value={value}>{value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </Grid>

            <Grid item xs={12} sm={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                <KeyboardDatePicker
                  className="payment-date-input"
                  id="date-payment-dialog"
                  label="Fecha límite de pago"
                  format="dd/MM/yyyy"
                  emptyLabel={'dd/mm/yyyy'}
                  disabled={existsPaymentDate}
                  invalidLabel={selectedPaymentDate}
                  value={selectedPaymentDate}
                  onChange={handlePaymentDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            {new Date() >= (selectedPaymentDate ? selectedPaymentDate : props.selectedPaymentDate) &&
              <>
                <Grid item xs={12}>
                  <span className="service-price-table-value warning-text mdl-navigation__link limit-payment-date">
                    <i className="material-icons">warning</i> Fecha límite de pago expiró, regendar cotización.
                  </span>
                </Grid>
              </>
            }
            <Grid item xs={12}>
              <span className="service-price-table-label">¿El cliente requiere factura? <strong>{props.invoiceCheck}</strong></span>
            </Grid>

          </Grid>


        </Grid>
      </Grid>
      <Button id="send-quotation" variant="contained" color="primary" disabled={props.loading || validateButton()} onClick={() => validatePayment()}>
        Validar Pago
      </Button>
    </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(QuotationPaymentDetail)

