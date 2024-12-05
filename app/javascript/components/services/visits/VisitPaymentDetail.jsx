import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';
import WarnIconValidate from 'components/services/common/WarnIconValidate'
import ModalConfirmationAmounts from 'components/services/common/ModalConfirmationAmounts'


import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';

// Custom hooks
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
// Dates
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { DropzoneArea } from 'material-ui-dropzone';

//List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { headers, headers_www_form, money_format, payment_channel_label, check_payment_method_name } from "constants/csrf"

import { FileIcon, defaultStyles } from 'react-file-icon';
import mime from "mime-to-extensions";

import MaterialTable from 'react-data-table-component';
import Skeleton from '@material-ui/lab/Skeleton';

// Card
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Image from 'material-ui-image'

import { SRLWrapper } from "simple-react-lightbox";
import { Modal } from '@material-ui/core';
import { useTranslation } from "react-i18next"
import { CURRENCY_SYMBOLS, DECIMAL_PLACES } from 'constants/currency';
import i18next from 'i18next';

const payment_options = ["Online", "Transferencia", "Por Teléfono", "Cliente realiza depósito bancario", "Cliente paga en domicilio", "Garantía producto/manufactura", "Garantía Reparación/Instalación", "Instalaci costo", "Visita en cortesía", "Segunda visita Póliza"]

const skip_payment_options = ["Cliente paga en domicilio", "Garantía producto/manufactura", "Garantía Reparación/Instalación", "Instalación sin costo", "Visita en cortesía", "Segunda visita Póliza"]

const consumable_columns = [
  {
    name: 'TNR',
    selector: 'consumable.tnr',
    sortable: true
  },
  {
    name: 'Nombre',
    selector: 'consumable.name',
    sortable: true,
    hide: 'sm',
  },
  {
    name: 'Cantidad requerida',
    selector: 'quantity',
    sortable: true
  },
  {
    name: 'Precio',
    selector: 'amount',
    sortable: true
  }
];




function VisitPaymentDetail(props) {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);

  const [selectedPaymentDate, setSelectedPaymentDate] = useState("");
  const [customerPaymentDate, setCustomerPaymentDate] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [visitPaymentMethod, setVisitPaymentMethod] = useState("");
  const [paymentLinkBoolean, setPaymentLinkBoolean] = useState(false);

  const [paymentFiles, setPaymentFiles] = useState([]);
  const [signatures, setSignatures] = useState([]);

  const [validated_payment, setValidatedPayment] = useState(false);

  // Delete image dialog
  const [openDeleteImageDialog, setOpenDeleteImageDialog] = React.useState(false);
  const [currentDeleteImage, setCurrentDeleteImage] = React.useState("");

  // MOdal
  const [showModalAmountConfirmation, setShowModalAmountConfirmation] = useState(false)

  // Visit totals
  const [hourAmout, setHourAmout] = useState(props.hourAmout);
  const [feeAmount, setFeeAmount] = useState(props.feeAmount);
  const [consumableAmount, setConsumableAmount] = useState(props.consumableAmount);
  const [laborAmount, setLaborAmount] = useState(props.laborAmount);
  const [viaticAmout, setViaticAmout] = useState(props.viaticAmout);
  const [totalhours, setTotalhours] = useState("");

  const [ivaAmount, setIVAAmount] = useState(props.ivaAmount);
  const [subtotalAmount, setSubtotalAmount] = useState(props.subtotalAmount);
  const [totalAmount, setTotalAmount] = useState(props.totalAmount);

  const newFeeAmountInitial = props.visit.new_amounts?.fee_amount || props.feeAmount
  const newLaborAmountInitial = props.visit.new_amounts?.labor_amount || props.laborAmount
  const newConsumableAmountInitial = props.visit.new_amounts?.consumable_amount || props.consumableAmount
  const newViaticAmountInitial = props.visit.new_amounts?.viatic_value || props.visit.viatic_amount

  const newSubtotalAmountInitial = props.visit.new_amounts?.sub_total_amount || props.subtotalAmount
  const newTotalAmountInitial = props.visit.new_amounts?.total_amount || props.totalAmount
  const newIVAAmountInitial = props.visit.new_amounts?.iva_amount || props.ivaAmount

  const [newLaborAmount, setNewLaborAmount] = useState(newLaborAmountInitial)
  const [newFeeAmount, setNewFeeAmount] = useState(newFeeAmountInitial)
  const [newViaticAmount, setNewViaticAmount] = useState(newViaticAmountInitial)
  const [newIvaAmount, setNewIvaAmount] = useState(newIVAAmountInitial)
  const [newSubtotalAmount, setNewSubtotalAmount] = useState(newSubtotalAmountInitial)
  const [newTotalAmount, setNewTotalAmount] = useState(newTotalAmountInitial)
  const [newConsumableAmount, setNewConsumableAmount] = useState(newConsumableAmountInitial)

  const [zipcode, setZipcode] = useState(props.zipcode)
  const [blockNewAmounts, setBlockNewAmounts] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)

  const { service_type, subcategory, administrative_demarcation_fn: administrativeDemarcation, country } = props
  const serviceID = props.visit.service_id
  const [assignedQuotationId, setAssignedQuotationId] = useState(props.visit.assigned_quotation_id)
  const [sparePartsAmount, setSparePartsAmount] = useState(props.visit.spare_parts_amount)

  const rolesCanEditAmounts = ['administrador', 'field service']

  function getUsedSpareParts(product_ids, visit_id) {
    const params = {
      visit_id
    }

    let promises = []

    product_ids.forEach(product_id => {
      promises.push(axios.get(`/api/v1/customer_products/${product_id}/customer_product_used_spare_parts`, { params }))
    })

    axios.all(promises).then(axios.spread((...responses) => {
      const data = responses.map(response => {
        return response.data
      }).flat()
      if (data.length > 0) {
        const usedSparePartPrices = data.map(usedSparePart => usedSparePart.service_spare_part.price)
        setNewConsumableAmount(usedSparePartPrices.reduce((p, c) => p + c))
        setFirstLoad(false)
      }
    })).catch(errors => {
      console.log({ errors });
    })
  }

  useEffect(() => {
    const currentRoles = props.currentUser.get_roles_names.split(',').map(roleName => roleName.toLowerCase())
    console.log({ currentRoles });
    if (rolesCanEditAmounts.some(roleCanEdit => currentRoles.includes(roleCanEdit))) {
      console.log('Can edit');
      return
    } else {
      console.log('Cant edit');
      setBlockNewAmounts(true)
    }

  }, [])

  useEffect(() => {
    getUsedSpareParts(props.visit.customer_products.map(customer_product => customer_product.id), props.visit.id)
    setFirstLoad(false)
  }, [])

  useEffect(() => {
    setBlockNewAmounts(!!props.visit?.new_amounts?.updated_at)
  }, [props.visit])

  useEffect(() => {
    setZipcode(props.zipcode)

  }, [props.zipcode])

  useEffect(() => {
    if (props.visit.no_payment && !(!!props.visit.assigned_quotation_id)) return
    if (blockNewAmounts) return
    if (props.visit.new_amounts?.updated_at) return
    // if (firstLoad) return;
    fetchServiceTotal(country,
      props.visit.customer_products.map((product) => product.id),
      zipcode,
      (administrativeDemarcation?.admin_name_3 || ''),
      true)
  }, [newFeeAmount, newLaborAmount, newConsumableAmount, zipcode, newViaticAmount])

  const handleClickOpenImageDialog = (image_id) => {
    setCurrentDeleteImage(image_id)
    setOpenDeleteImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenDeleteImageDialog(false);
  };

  const handleDeleteImage = () => {
    setOpenDeleteImageDialog(false);
    return axios.delete(`/api/v1/file_resources/${currentDeleteImage}`, { headers: headers })
      .then(response => {
        let payment_files_t = paymentFiles.filter(file => String(file.id) != String(currentDeleteImage));
        setPaymentFiles(payment_files_t);
        flash_alert("Eliminado!", t('services.visits.flashAlert.couldDeleteFile'), "success")
      })
      .catch(e => {
        flash_alert("Error!", t('services.visits.flashAlert.couldNotDeleteFile'), "danger")

      });
  };

  function fetchServiceTotal(country_code, products_ids, zipcode_t, administrative_demarcation_name_t, from_consumables = false, from_policy = false, event_local = null) {
    console.log(event_local)
    if (event_local) {
      var time_diff = date_difference_in_hours(event.start, event.end)
    }

    if (products_ids.length > 0) {
      const params = {
        viatic_value: newViaticAmount,
        fee_amount: newFeeAmount,
        labor_price: newLaborAmount,
        country: country_code,
        products_ids: products_ids.join(','),
        service_type: service_type || '',
        subcategory: subcategory,
        zipcode: zipcode_t || '',
        administrative_demarcation_name: administrative_demarcation_name_t || '',
        quotation_id: assignedQuotationId,
      }

      if (event_local) {
        params.time_diff = time_diff
      }

      return axios.get(`/api/v1/services/${serviceID}/total_price`, { params })
        .then(({ data: json }) => {
          if (json.data) {
            setTotalhours(json.data.total_hours)

            if (service_type == 'Póliza de Mantenimiento') {
            } else {
              if (newConsumableAmount > 0) {
                const subTotal = json.data.subtotal_amount + newConsumableAmount
                const iva = subTotal * json.data.iva
                setNewSubtotalAmount(subTotal)
                setNewIvaAmount(iva)
                setNewTotalAmount((json.data.subtotal_amount + newConsumableAmount) * (json.data.iva + 1))
              } else {
                setNewSubtotalAmount(json.data.subtotal_amount)
                setNewIvaAmount(json.data.iva_amount)
                setNewTotalAmount(json.data.total_amount)
              }
            }
          } else {
            console.log("No hay precio.")
          }
        })
        .catch(error => console.log(error));
    }
  }


  useEffect(() => {
    if (props.selectedPaymentDate) {

      let aux = new Date(Date.parse(props.selectedPaymentDate))
      aux.setDate(aux.getDate() + 1)
      setSelectedPaymentDate(aux)
    }
  }, [props.selectedPaymentDate]);

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
    if (props.visit) {
      props.visit.payment_date && setSelectedPaymentDate(props.visit.payment_date)
      if (props.paymentData[0] == undefined) {
        setCustomerPaymentDate(props.visit.customer_payment_date)
      }
      setVisitPaymentMethod(props.visit.payment_channel)
      setPaymentFiles(props.visit.payment_resources)
      setSignatures(props.visit.signatures)

      if (!props.noPaymentCheck) {
        setValidatedPayment(props.visit.validated_payment || props.visit.payment_state == "paid")
      }
      if (props.visit.no_payment && !(!!props.visit.assigned_quotation_id)) {

        setTotalAmount(0)
        setTotalhours(0)
        setHourAmout(0)
        setFeeAmount(0)
        setLaborAmount(0)
        setIVAAmount(0)
        setSubtotalAmount(0)
        setViaticAmout(0)
        setConsumableAmount(0)

        setNewIvaAmount(0)
        setNewTotalAmount(0)
        setNewSubtotalAmount(0)
        setNewLaborAmount(0)
        setNewFeeAmount(0)
        setNewViaticAmount(0)
        setNewConsumableAmount(0)
        setBlockNewAmounts(true)
        //los consumibles faltan
      } else {
        console.log({ visit: props.visit });
        props.visit.total_amount && setTotalAmount(props.visit.total_amount)
        props.visit.total_hours && setTotalhours(props.visit.total_hours)
        props.visit.hour_amount && setHourAmout(props.visit.hour_amount)
        props.visit.fee_amount && setFeeAmount(props.visit.fee_amount)
        props.visit.labor_amount && setLaborAmount(props.visit.labor_amount)
        props.visit.iva_amount && setIVAAmount(props.visit.iva_amount)
        props.visit.subtotal_amount && setSubtotalAmount(props.visit.subtotal_amount)
        props.visit.viatic_amount && setViaticAmout(props.visit.viatic_amount)
      }
    }
  }, [props.visit]);




  const handlePaymentDateChange = (date) => {
    setSelectedPaymentDate(date);
  };

  const handleCustomerPaymentDateChange = (date) => {
    setCustomerPaymentDate(date);
  };


  async function onServiceChangeFiles(e) {
    if (e.length > 0) {
      const dT = [];
      e.forEach(async function(item) {

        await getBase64(item)
          .then((encFile) => {
            dT.push(encFile)
            setFiles(dT)
          }).catch(error => console.log("error"));

      });

    }
  };

  function handleMessage(message, type) {
    if (type == "error") {
      flash_alert("", t('services.visits.flashAlert.fileExceedLimit'), "error")
    }
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({
        uri_64: reader.result,
        name: file.name,
        mime: file.type,
      });
      reader.onerror = error => reject(error);
    });
  }
  function handleValidatePaymentSubmit(event) {
    event.preventDefault();
    if ((files.length > 0 || paymentFiles.length > 0) || skip_payment_options.includes(visitPaymentMethod)) {
      if (!props.loading) {
        props.setLoading(true);

      }
      saveVisit(t('services.visits.flashAlert.paymentValidated'))
    } else {
      flash_alert("Error", t('services.visits.flashAlert.attachProofOfPayment'), "danger")
    }

  }

  function saveVisit(update_message) {
    var body = new FormData();
    body.set('payment_date', selectedPaymentDate);
    body.set('customer_payment_date', customerPaymentDate);
    body.set('payment_channel', payment_channel_label(visitPaymentMethod));
    files.forEach((file) => {
      body.append('payment_files[]', JSON.stringify(file));
    });

    return axios.patch(`/api/v1/visits/${props.visit.id}`, body, { headers: headers_www_form })
      .then(response => {
        flash_alert(t('services.visits.flashAlert.visitUpdatedSuccessfully'), update_message, "success");
        setFiles([]);
        //callbacks
        props.callbacks()
        props.setLoading(false);

      })
      .catch(e => {
        if (e.response.data) {
          props.setLoading(false);
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });
  }

  function saveNewAmounts(update_message) {
    var body = new FormData();
    const newAmounts = {
      fee_amount: newFeeAmount,
      labor_amount: newLaborAmount,
      total_amount: newTotalAmount,
      consumable_amount: newConsumableAmount,
      iva_amount: newIvaAmount,
      sub_total_amount: newSubtotalAmount,
      total_amount: newTotalAmount,
    }

    body.set('new_amounts', JSON.stringify(newAmounts));

    return axios.patch(`/api/v1/visits/${props.visit.id}`, body, { headers: headers_www_form })
      .then(response => {
        flash_alert(t('services.visits.flashAlert.visitUpdatedSuccessfully'), update_message, "success");
        setFiles([]);
        //callbacks
        props.callbacks()
        props.setLoading(false);

      })
      .catch(e => {
        if (e.response.data) {
          props.setLoading(false);
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });
  }

  return (
    <React.Fragment>
      <ModalConfirmationAmounts newTotalAmount={money_format(props.country, newTotalAmount)} showModal={showModalAmountConfirmation} setShowModal={setShowModalAmountConfirmation} saveNewAmounts={saveNewAmounts} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <p className="service-subtitle">{t('services.visits.payments.paymentsDetails')}</p>
          <Grid container spacing={3} className={props.noPaymentCheck && !validated_payment ? "hidden" : ""}>
            <Grid item xs={12}>
              <span className={`mdl-navigation__link service-price-table-value service-price-table-value-check ${((props.paymentData[0] != undefined && props.paymentData[0].status == "completed") || validated_payment) ? "green-label" : "red-label"}`}>
                {((props.paymentData[0] != undefined && props.paymentData[0].status == "completed") || validated_payment) ? <i className="material-icons">done</i> : <i className="material-icons">close</i>}
                {((props.paymentData[0] != undefined && props.paymentData[0].status == "completed") || validated_payment) ? t('services.visits.payments.paidVisit') : t('services.visits.payments.unpaidVisit')}
              </span>
            </Grid>
            {props.customer.names != undefined &&
              <Grid item xs={12} sm={6}>
                <span className="service-price-table-label">{t('services.visits.payments.name')}</span>
                <span className="visit-summary-2">{props.customer.names + " " + props.customer.lastname + " " + props.customer.surname}</span>
              </Grid>
            }
            {props.customer.rut &&
              <Grid item xs={12} sm={6}>
                <span className="service-price-table-label">{t('services.visits.payments.rut')}</span>
                <span className="visit-summary-2">{props.customer.rut}</span>
              </Grid>
            }

            <Grid item xs={12} sm={6}>
              {props.paymentData[0] != undefined && customerPaymentDate != "" &&
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                  <KeyboardDatePicker
                    disabled
                    className="payment-date-input"
                    id="date-payment-dialog"
                    label="Fecha de pago"
                    format="dd/MM/yyyy"
                    value={customerPaymentDate}
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
                    label="Fecha de pago"
                    format="dd/MM/yyyy"
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
                <span className="service-price-table-label">{t('services.visits.payments.paymentData.payHour')}</span>
                <span className="visit-summary-2">{props.paymentTime}</span>
              </Grid>
            }
            {props.paymentData[0] != undefined &&
              <Grid item xs={12} sm={6}>
                <span className="service-price-table-label">{t('services.visits.payments.paymentData.amount')}</span>
                <span className="service-price-table-value">
                  {props.paymentData[0] != undefined && money_format(props.country, props.paymentData[0].amount)}
                  {(props.paymentData[0] == undefined && validated_payment) && money_format(props.country, props.totalAmount)}
                </span>
              </Grid>
            }
            {props.paymentData[0] != undefined &&
              <Grid item xs={12} sm={6}>
                <span className="service-price-table-label">{t('services.visits.payments.paymentData.referenceNumber')}</span>
                <span className="visit-summary-2">{props.paymentData[0].transaction_id}</span>
              </Grid>
            }
            {/* {props.paymentData[0] != undefined && */}
            <Grid item xs={12} sm={6}>
              <span className="service-price-table-label">{t('services.visits.payments.paymentData.paymentMethod')}</span>
              <span className="visit-summary-2">
                {props.paymentData[0] != undefined && props.paymentData[0].payment_method_id == 1 && props.paymentType//(payment_channel_label(props.paymentChannel) + " - " + props.paymentData[0].payment_method_name)}
                }
                {props.paymentData[0] != undefined && props.paymentData[0].payment_method_id != 1 && (check_payment_method_name(props.paymentChannel, props.paymentData[0].payment_method_name))}
                {(props.paymentData[0] == undefined && validated_payment) && "Si. Manual"}
              </span>
              {props.paymentData[0] == undefined &&
                <FormControl variant="outlined" className="MuiFormControl-fullWidth">
                  <InputLabel id="service_type-simple-select-outlined-label">{t('services.visits.payments.paymentData.paymentSelect')}</InputLabel>
                  <Select
                    labelId="service_type-simple-select-outlined-label"
                    id="service_type-simple-select-outlined"
                    value={payment_channel_label(visitPaymentMethod)}
                    onChange={(e) => setVisitPaymentMethod(e.target.value)}
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
            {/* }                             */}
            <Grid item xs={12}>
              <span className="service-price-table-label">{t('services.visits.payments.paymentData.bill?')} <strong>{props.invoiceCheck}</strong></span>
            </Grid>

            {props.invoiceCheck === "si" &&
              <Grid item xs={12}>
                <span className="service-price-table-label">{t('services.visits.payments.paymentData.billAddress')}</span>
                <span className="service-price-table-value">
                  {`${props.street_type_fn} ${props.street_name_fn}, ${props.ext_number_fn} ${props.int_number_fn}, ${props.administrative_demarcation_fn != null ? props.administrative_demarcation_fn.admin3_admin1 : props.state_fn}${props.zipcode_fn != "" ? (", Código Postal: " + props.zipcode_fn) : ""}`}
                </span>
              </Grid>
            }

            <Grid item xs={12} sm={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                <KeyboardDatePicker
                  className="payment-date-input"
                  id="date-payment-dialog"

                  label={props.service_type == "Reparaciones en Taller" ? "Fecha limite para revisión" : "Fecha límite de pago"}
                  format="dd/MM/yyyy"
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
                    <i className="material-icons">warning</i> {t('services.visits.payments.limitPaymentDate')}
                  </span>
                </Grid>
              </>
            }
          </Grid>
          <Grid container spacing={2} className={props.noPaymentCheck ? "" : "hidden"}>
            <Grid item xs={12}>
              {(props.noPaymentOption != "No requiere pago") &&
                <span className="service-price-table-label">{t('services.visits.payments.noPaymentOption')}</span>
              }
              <span className={`visit-summary-2 ${(props.noPaymentOption == "No requiere pago") ? "green-label" : ""}`}>{(props.noPaymentOption == "No requiere pago") && <i className="material-icons">done</i>}{props.noPaymentOption}</span>
            </Grid>
          </Grid>

        </Grid>

        <Grid item xs={12} sm={6} className="service-price-table-container visit-price-table-container">
          <Grid container xs={12}>
            <Grid item xs={4}>
              <span style={{ color: '#fff', fontSize: '11px', textAlign: 'center' }}>descripcion</span>
              <hr />
              <p className="light-w">{t('services.visits.payments.summaryTable.hourAmount')}</p>
              <p className="light-w">{t('services.visits.payments.summaryTable.sparePartsAmount')}</p>
              <p className="light-w">{t('services.visits.payments.summaryTable.feeAmount')}</p>
              <p className="light-w">{t('services.visits.payments.summaryTable.consumableAmount')}</p>
              <p className="light-w">{t('services.visits.payments.summaryTable.laborAmount')}</p>
              <p className="light-w">{t('services.visits.payments.summaryTable.viaticAmount')}</p>
              <hr />
              <p className="light-w">{t('services.visits.payments.summaryTable.subTotalAmount')}</p>
              <p className="light-w">{t('services.visits.payments.summaryTable.ivaAmount')}</p>
              <hr />
              <p>{t('services.visits.payments.summaryTable.totalAmount')}</p>
            </Grid>

            <Grid style={{ textAlign: 'right' }} item xs={4}>
              <span style={{ fontSize: '11px', textAlign: 'center' }}>{t('services.visits.payments.summaryTable.startingAmount')}</span>
              <hr />
              <p>{money_format(props.country, hourAmout)}</p>
              <p>{money_format(props.country, sparePartsAmount)}</p>
              <p>{money_format(props.country, feeAmount)}</p>
              <p>{money_format(props.country, consumableAmount)}</p>
              <p>{money_format(props.country, laborAmount)}</p>
              <p>{money_format(props.country, viaticAmout)}</p>
              <hr />
              <p>{money_format(props.country, subtotalAmount)}</p>
              <p>{money_format(props.country, ivaAmount)}</p>
              <hr />
              <p>{money_format(props.country, Number(totalAmount))}</p>
            </Grid>

            <Grid style={{ textAlign: 'right' }} item xs={4}>
              <span style={{ fontSize: '11px', textAlign: 'center' }}>{t('services.visits.payments.summaryTable.visitAmount')}</span>
              <hr />
              <p>{money_format(props.country, hourAmout)}</p>
              <p>{money_format(props.country, sparePartsAmount)}</p>
              <p>
                <WarnIconValidate oldValue={feeAmount} newValue={newFeeAmount} />
                <CurrencyTextField
                  style={{ width: '80px', maxHeight: '24px' }}
                  currencySymbol={CURRENCY_SYMBOLS[country]}
                  disabled={blockNewAmounts}
                  decimalPlaces={DECIMAL_PLACES[country]}
                  onBlur={({ target: { value } }) => setNewFeeAmount(Number(value.split(',').join('')))}
                  digitGroupSeparator=","
                  value={newFeeAmount}
                  size="small"
                  outputFormat='number' />
              </p>
              <p>
                <WarnIconValidate oldValue={consumableAmount} newValue={newConsumableAmount} />
                <CurrencyTextField
                  style={{ width: '80px', maxHeight: '24px' }}
                  currencySymbol={CURRENCY_SYMBOLS[country]}
                  disabled={blockNewAmounts}
                  decimalPlaces={DECIMAL_PLACES[country]}
                  onBlur={({ target: { value } }) => setNewConsumableAmount(Number(value.split(',').join('')))}
                  digitGroupSeparator=","
                  value={newConsumableAmount}
                  size="small"
                  outputFormat='number' />
              </p>
              <p>
                <WarnIconValidate oldValue={laborAmount} newValue={newLaborAmount} />
                <CurrencyTextField
                  style={{ width: '80px', maxHeight: '24px' }}
                  currencySymbol={CURRENCY_SYMBOLS[country]}
                  disabled={blockNewAmounts}
                  decimalPlaces={DECIMAL_PLACES[country]}
                  digitGroupSeparator=","
                  onBlur={({ target: { value } }) => setNewLaborAmount(Number(value.split(',').join('')))}
                  value={newLaborAmount}
                  size="small"
                  outputFormat='number' />
              </p>
              <p>
                <WarnIconValidate oldValue={viaticAmout} newValue={newViaticAmount} />
                <CurrencyTextField
                  style={{ width: '80px', maxHeight: '24px' }}
                  currencySymbol={CURRENCY_SYMBOLS[country]}
                  disabled={blockNewAmounts}
                  decimalPlaces={DECIMAL_PLACES[country]}
                  digitGroupSeparator=","
                  onBlur={({ target: { value } }) => setNewViaticAmount(Number(value.split(',').join('')))}
                  value={newViaticAmount}
                  size="small"
                  outputFormat='number' />
              </p>
              <hr />
              <p>{money_format(props.country, newSubtotalAmount)}</p>
              <p>{money_format(props.country, newIvaAmount)}</p>
              <hr />
              <p>{money_format(props.country, Number(newTotalAmount))}</p>
            </Grid>
          </Grid>
          <div style={{ textAlign: 'right', marginTop: '8px' }}>
            <Button onClick={() => setShowModalAmountConfirmation(true)} disabled={blockNewAmounts} variant='contained' color='primary'>{t('services.visits.payments.summaryTable.validateAmount')}</Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <h1 className="panel-custom-title">{t('services.visits.payments.consumables')}</h1>
          <MaterialTable
            noHeader={true}
            columns={consumable_columns}
            data={props.selectedConsumables}
            progressComponent={<CircularProgress size={75} />}
            responsive={true}
            highlightOnHover={true}
            striped={true}
            contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
            highlightOnHover={true}
            striped={true}
            noDataComponent={i18next.t('globalText.NoDataComponent')}
            paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
          />
        </Grid>
        <Grid item xs={12}>
          <h1 className="panel-custom-title">{t('services.visits.payments.spareParts')}</h1>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </Grid>
        <Grid item xs={12} className={"mg-b-50"}>
          <h1 className="panel-custom-title panel-custom-title-padding">{t('services.visits.payments.receptionData')}</h1>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <span className="service-price-table-label">{t('services.visits.payments.nameAndSignature')}</span>
              <span className="visit-summary-2 panel-custom-title-padding panel-custom-title-display-inline">{props.visit.person_accountable && props.visit.person_accountable || t('globalText.noInfo')}</span>

              <SRLWrapper>
                <Grid container spacing={1}>
                  {signatures &&
                    signatures.length > 0 &&
                    signatures.map((image, index) => {
                      const listId = `signatures-${image.id}`;
                      return (
                        <Grid key={listId} item xs={6}>
                          <Card>
                            <CardActionArea>
                              <a href={image.resource_url} className="mdl-navigation__link file-image-link">
                                <Image
                                  src={image.resource_url}
                                  className="file-image"
                                  srl_gallery_image="true"
                                />
                              </a>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      );
                    })
                    ||
                    <Grid item xs={12}>
                      <span className="visit-summary-2">{t('services.visits.payments.noSignature')}</span>
                    </Grid>
                  }
                </Grid>
              </SRLWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className="service-subtitle">{t('services.visits.payments.backupData')}</p>
          <Grid item xs={12}>
            <DropzoneArea
              name={"services_files"}
              dropzoneText={t('services.visits.payments.fileUploadInstructions')}
              onChange={onServiceChangeFiles}
              showPreviews={true}
              showPreviewsInDropzone={false}
              useChipsForPreview
              previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
              previewChipProps={{ classes: { root: props.classes.previewChip } }}
              previewText={t('services.visits.payments.selectedFiles')}
              filesLimit={10}
              showAlerts={false}
              maxFileSize={10000000}
              alertSnackbarProps={{ anchorOrigin: { vertical: 'top', horizontal: 'right' } }}
              onAlert={handleMessage}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className="service-subtitle">{t('services.visits.payments.uploadFiles')}</p>
          <List dense className={props.classes.root}>
            <SRLWrapper>
              {paymentFiles && paymentFiles.map((serviceFile) => {
                return (
                  <ListItem key={"serviceFile" + serviceFile.id} button>
                    <ListItemAvatar className="service-payment-icon">

                      {
                        serviceFile.mime.includes("image") &&
                        <a href={serviceFile.resource_url} className="mdl-navigation__link file-image-link">
                          <Image
                            src={serviceFile.resource_url}
                            className="file-image"
                            srl_gallery_image="true"
                          />
                        </a>
                        ||
                        <FileIcon
                          size={2}
                          extension={mime.extension(serviceFile.mime)}
                          {...defaultStyles[mime.extension(serviceFile.mime)]}
                        />
                      }

                    </ListItemAvatar>
                    <a className="new-service-link" href={serviceFile.resource_url} target="_blank">
                      <Button size="small" color="primary">
                        {serviceFile.name} {serviceFile.description != "" ? ("- " + serviceFile.description) : ""}
                      </Button>
                    </a>
                    <ListItemSecondaryAction>

                      <Button size="small" color="primary" onClick={() => handleClickOpenImageDialog(serviceFile.id)}>
                        <i className="material-icons">delete</i>
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </SRLWrapper>
          </List>
        </Grid>
        <Dialog open={openDeleteImageDialog} onClose={handleCloseImageDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{t('services.visits.payments.deleteFile.deleteImage')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('services.visits.payments.deleteFile.confirmMessage')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImageDialog} color="primary">
              {t('services.visits.payments.deleteFile.no')}
            </Button>
            <Button onClick={handleDeleteImage} color="primary">
              {t('services.visits.payments.deleteFile.yes')}
            </Button>
          </DialogActions>
        </Dialog>
        <br />
        <Grid item xs={12}>
          <Button id="service-save-payment" size="large" type="submit" variant="outlined" color="primary" onClick={handleValidatePaymentSubmit}>
            {t('services.visits.payments.validatePayment')}
          </Button>
          {props.loading && <CircularProgress size={24} className={props.classes.buttonProgress} />}

        </Grid>

      </Grid>

    </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({
  currentUser: state => state.current_user,
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(VisitPaymentDetail)

