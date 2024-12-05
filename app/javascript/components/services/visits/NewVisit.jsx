import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import * as CostCenterApi from 'api/cost_center'
import {Link} from 'react-router-dom'
import {Redirect} from "react-router-dom";
import {connect} from "react-redux"
import {createStructuredSelector} from "reselect"
import {flash_alert} from 'components/App';
import CustomerDetails from "components/customers/CustomerDetails";
import NewScheduleDialog from "components/services/NewScheduleDialog";
import PaymentEmailDialog from "components/services/PaymentEmailDialog";
import ServiceInfoForm from "components/services/forms/ServiceInfoForm";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {country_names_g, street_types_cl_g} from 'components/customers/CustomerForm';
import {csrf, headers, money_format, date_event_format, date_format_without_time, date_difference_in_hours, api_token, site_url} from "constants/csrf"
import pluralize from 'pluralize';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import EditService from "components/services/EditService";
import {createStyles, makeStyles} from '@material-ui/core/styles';
// Button loading
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
// Toggle buttons
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
// Dates
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Image
import Image from 'material-ui-image'
// Payment Methods
import PaymentMethods from 'components/payments/PaymentMethods';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import DeleteSparePartDialog from "components/services/DeleteSparePartDialog";
import EditSparePartDialog from "components/services/EditSparePartDialog";

import {noPaymentsOptions} from "constants/csrf";
// Translation
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { serviceTypeLabels, serviceTypeSubcategories, requestedLabels } from 'constants/services'

const service_types_g = ["Instalación", "Mantenimiento", "Reparación", "Home Program", "Reparaciones en Taller", "Entregas/Despachos", "Póliza de Mantenimiento"]


const inst_options = ["Profesional", "Doméstico", "Reinstalación"]
const main_options = ["Mantenimiento Regular", "Certificado de servicio doméstico", "Certificado de mantenimiento Profesional", "Certificado de mantenimiento Doméstico"]
const repair_options = ["Profesional", "Doméstico", "Garantía de reparación previa - Profesional", "Garantía de reparación previa - Doméstico", "Garantía de Manufactura", "Garantía de instalación - Profesional", "Garantía de instalación - Doméstico", "Cortesía - Cargo a ventas Profesional", "Cortesía - Cargo a ventas Doméstico", "Cortesía - Cargo a Servicio"]
const mp_options = ["No existen sub-categorías"]
const repair_t_options = ["Option 1", "Option 2"]
const delivery_options = ["No existen sub-categorías"]
const policy_options = ["No existen sub-categorías"]

const requested_by = ["Cliente directo", "Distribuidor autorizado"]

const channels = ["Teléfono", "App Clientes", "Web", "Redes sociales", "Correo", "Partners B2B", "eCommerce"]

const product_columns = [
  {
    name: i18next.t('globalTables.customerProductColumns.family'),
    selector: 'product.taxons',
    hide: 'md',
    cell: row => (
      <span>
        {(row.product.taxons[0] == null ? "-" : row.product.taxons[0].name)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.customerProductColumns.subFamily'),
    selector: 'product.taxons',
    hide: 'md',
    cell: row => (
      <span>
        {(row.product.taxons[1] == null ? "-" : row.product.taxons[1].name)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.customerProductColumns.id'),
    selector: 'serial_id',
    sortable: true
  },
  {
    name: i18next.t('globalTables.customerProductColumns.tnr'),
    selector: 'product.tnr',
    sortable: true,
    cell: row => (
      <span>
        {(row.product.tnr == "" ? "-" : row.product.tnr)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.customerProductColumns.name'),
    selector: 'product.name',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(row.product.name == "" ? "-" : row.product.name)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.customerProductColumns.instalationDate'),
    selector: 'instalation_date',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(row.reinstalation_date == null ? (row.instalation_date == null ? "No" : date_format_without_time(row.instalation_date)) : date_format_without_time(row.reinstalation_date) + " reinstalado")}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.customerProductColumns.discontinuedRow.discontinued'),
    selector: 'discontinued',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(row.discontinued ? i18next.t('globalTables.customerProductColumns.discontinuedRow.yes') : i18next.t('globalTables.customerProductColumns.discontinuedRow.no'))}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.customerProductColumns.warrantyRow.warranty'),
    selector: 'warranty',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {((row.warranty == null ? i18next.t('globalTables.customerProductColumns.warrantyRow.no') : i18next.t('globalTables.customerProductColumns.warrantyRow.valid') + date_format_without_time(row.warranty)))}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.productsColumns.policy'),
    selector: 'policy',
    sortable: true,
    hide: 'md',
  },
  {
    name: i18next.t('globalTables.productsColumns.status'),
    selector: 'status',
    sortable: true,
    hide: 'md',
  }
];


const consumable_columns = [
  {
    name: i18next.t('globalTables.customerProductColumns.tnr'),
    selector: 'consumable.product.tnr',
    sortable: true
  },
  {
    name: i18next.t('globalTables.customerProductColumns.name'),
    selector: 'consumable.name',
    sortable: true,
    hide: 'sm',
  },
  {
    name: i18next.t('globalTables.productsColumns.requiredQuantity'),
    selector: 'total_boxes_without_events',
    sortable: true
  }
];



const GET_REQUESTED_SPARE_PARTS_REQUEST = "GET_REQUESTED_SPARE_PARTS_REQUEST";
const GET_REQUESTED_SPARE_PARTS_SUCCESS = "GET_REQUESTED_SPARE_PARTS_SUCCESS";

function getRequestedSpareParts(service_id) {

  return dispatch => {
    dispatch({type: GET_REQUESTED_SPARE_PARTS_REQUEST});
    return fetch(`/api/v1/services/${service_id}/requested_spare_parts`)
      .then(response => response.json())
      .then(json => dispatch(getRequestedSparePartsSuccess(json)))
      .catch(error => console.log(error));
  };
};

export function getRequestedSparePartsSuccess(json) {

  return {
    type: GET_REQUESTED_SPARE_PARTS_SUCCESS,
    json
  };
};




function NewVisit(props) {
  const useStyles = makeStyles(theme => createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }));

  const classes = useStyles();
  const {t} = useTranslation();
  const [costCenters, setCostCenters] = useState([])
  const [selectedCostCenterId, setSelectedCostCenterId] = useState(0)
  const [newVisit, setNewVisit] = useState({})
  const [quotations, setQuotations] = useState([])
  const [assignedQuotationId, setAssignedQuotationId] = useState(0)

  // Customer Info
  const [customerNames, setCustomerFirstname] = useState("");
  const [customerLastname, setCustomerLastname] = useState("");
  const [customerSurname, setCustomerSurname] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Customer 
  const [customer_id, setCustomerId] = useState("");
  // Ship Address
  const [zipcode, setZipcode] = useState("");
  const [state, setState] = useState("");
  const [delegation, setDelegation] = useState("");
  const [colony, setColony] = useState("");
  const [street_type, setStreettype] = useState("");
  const [street_name, setStreetName] = useState("");
  const [ext_number, setExtNumber] = useState("");
  const [int_number, setIntNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [reference, setReference] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [country, setCountry] = useState("MX");
  const [countryIVA, setCountryIVA] = useState(0.16);

  const [rut, setRut] = useState("");
  const [administrative_demarcation, setAdministrativeDemarcation] = useState({});
  // Bill Address
  const [zipcode_fn, setZipcodeFn] = useState("");
  const [state_fn, setStateFn] = useState("");
  const [delegation_fn, setDelegationFn] = useState("");
  const [colony_fn, setColonyFn] = useState("");
  const [street_type_fn, setStreettypeFn] = useState("");
  const [street_name_fn, setStreetNameFn] = useState("");
  const [ext_number_fn, setExtNumberFn] = useState("");
  const [int_number_fn, setIntNumberFn] = useState("");
  const [phone_fn, setPhoneFn] = useState("");
  const [administrative_demarcation_fn, setAdministrativeDemarcationFn] = useState({});
  // ADDITIONALS ADDRESS
  const [additionalsAddresses, setAdditionalsAddresses] = useState([]);
  // CHECKS
  const [personCheck, setPersonCheck] = useState("");
  const [RUTCheck, setRUTCheck] = useState("hidden");
  const [zipcodeCheck, setZipcodeCheck] = useState("");
  const [delegationCheck, setDelegationCheck] = useState("");
  const [stateLabel, setStateLabel] = useState("Estado");
  const [colonyCheck, setColonyCheck] = useState("");
  const [extNumberLabel, setExtNumberLabel] = useState("Número Exterior");
  const [intNumberLabel, setIntNumberLabel] = useState("Número Interior");
  const [country_change, setCountryChange] = useState(false);
  // Additional Info
  const [redirect, setRedirect] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  // Service info
  const [serviceID, setServiceID] = useState("");
  const [service_type, setServiceType] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [requested, setRequested] = useState("");
  const [requestChannel, setRequestChannel] = useState("");
  const [subcategory_options, setSubcategoryOptions] = useState([]);
  const [serviceNumber, setServiceNumber] = useState("");
  const [serviceStatusLabel, setServiceStatusLabel] = useState("");
  const [ibs_number, setIBSNumber] = useState("");
  const [paymentFiles, setPaymentFiles] = useState([]);
  //const [servicePriceData, setServicePriceData] = useState([]);
  const [serviceStatus, setServiceStatus] = useState("new");
  const [serviceFiles, setServiceFiles] = useState([]);
  const [serviceUpdated, setServiceUpdated] = useState(false);
  const [event, setEvent] = useState({start: "", end: ""});
  const [technicians, setTechnicians] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState("");
  const [selectedPolicies, setSelectedPoliciesRows] = useState("");
  const [technicians_ids, setTechniciansIds] = useState("");
  const [techinicianNumber, setTechinicianNumber] = useState(1);
  const [hourAmout, setHourAmout] = useState(0);
  const [viaticAmout, setViaticAmout] = useState(0);
  const [sparePartsAmount, setSparePartsAmount] = useState(0)
  const [feeAmount, setFeeAmount] = useState(0);
  const [feeAmountIncrement, setFeeAmountIncrement] = useState(0);
  const [consumableAmount, setConsumableAmount] = useState(0);
  const [laborAmount, setLaborAmount] = useState(0);
  const [totalhours, setTotalhours] = useState("");
  const [ivaAmount, setIVAAmount] = useState(0);
  const [subtotalAmount, setSubtotalAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [noPaymentCheck, setNoPaymentCheck] = useState(false);
  const [noPaymentOption, setNoPaymentOption] = useState("");
  const [selectedPaymentDate, setSelectedPaymentDate] = React.useState(new Date());
  const [paymentData, setPaymentData] = useState([]);
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentLinkBoolean, setPaymentLinkBoolean] = useState(false);
  const [from, setFrom] = useState("app_web");

  const [principal_technician, setPrincipalTechnician] = useState('');
  const [service_technicians, setServiceTechnicians] = useState([]);

  // Distributor
  const [distributorName, setDistributorName] = useState("");
  const [distributorEmail, setDistributorEmail] = useState("");
  const [distributorCheck, setDistributorCheck] = useState("hidden");

  // Products
  const [products, setProducts] = useState([]);
  const [selectedProductRows, setSelectedProductRows] = useState([]);
  const [background, setBackground] = useState("");
  const [files, setFiles] = useState([]);
  // Comsumable
  const [consumables, setConsumables] = useState([]);
  const [selectedConsumables, setSelectedConsumables] = useState([]);
  const [selectedConsumablesRows, setSelectedConsumablesRows] = useState([]);

  // Form validation
  const [service_typeErrorMessage, setServiceTypeErrorMessage] = useState("");
  const [subcategoryErrorMessage, setSubcategoryErrorMessage] = useState("");
  const [requestedErrorMessage, setRequestedErrorMessage] = useState("");
  const [requestChannelErrorMessage, setRequestChannelErrorMessage] = useState("");
  const [backgroundErrorMessage, setBackgroundErrorMessage] = useState("");
  const [eventErrorMessage, setEventErrorMessage] = useState("");
  const [noPaymenErrorMessage, setNoPaymenErrorMessage] = useState("");
  const [selectedPaymentDateErrorMessage, setSelectedPaymentDateErrorMessage] = useState("");
  // Dirección checks
  const [checked, setChecked] = React.useState("principal");
  const handleToggle = (value) => () => {
    setChecked(value);
  };
  const [checkedFN, setCheckedFN] = React.useState("principal");
  const handleToggleFN = (value) => () => {
    setCheckedFN(value);
  };

  // Toggle butons
  const [paymentChannel, setPaymentChannel] = React.useState('online');
  const [invoiceCheck, setInvoiceCheck] = React.useState("no");

  // Change total Dialog
  const [openTotalDialog, setOpenTotalDialog] = React.useState(false);

  ///////////////////////////////////////////////////////////////////////
  // PaymentDialog
  const [paymentEmailAdditional, setPaymentEmailAdditional] = useState("");
  const [isPaymentEmail, setIsPaymentEmail] = useState(false);
  const [paymentEmailDialog, setPaymentEmailDialog] = React.useState(false);

  const [toggledClearProductsRows, setoggledClearProductsRows] = useState(true)
  const [productTableDisabled, setProductTableDisabled] = useState(false)

  // VISIT
  const [visit, setVisit] = useState({});
  const [visit_number, setVisitNumber] = useState(1);

  const handleClickOpenTotalDialog = () => {
    setOpenTotalDialog(true);
  };

  function updateAssignQuotation(assignedId) {
    const quotation = quotations.find(quotation => quotation.id === assignedId)
    setFeeAmount(0)
    // setHourAmout(0)
    // setConsumableAmount(quotation?.spare_parts_amount || consumableAmount)
    setSparePartsAmount(quotation?.spare_parts_amount)
    setLaborAmount(quotation.labor_amount)
    setViaticAmout(quotation.viatic_amount)
    setFeeAmount(0)
  }

  useEffect(() => {
    if (!assignedQuotationId) return;
    if (noPaymentOption != 'Pagado en cotización') return;

    fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation.admin_name_3, true)
    
  }, [assignedQuotationId, paymentChannel])

  useEffect(() => {
    if (noPaymentCheck) return;
    setAssignedQuotationId(0)
    fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation.admin_name_3, true)
   }, [noPaymentCheck, noPaymentOption])

  function handleAssignedQuotation(event) {
    setAssignedQuotationId(event.target.value)
    updateAssignQuotation(event.target.value)

    console.log({currentValue: event.target.value});
  }

  const handleCloseTotalDialog = () => {
    setOpenTotalDialog(false);
  };

  const spare_part_columns = [
    {
      name: i18next.t('globalTables.customerProductColumns.tnr'),
      selector: 'spare_part.tnr',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.customerProductColumns.name'),
      selector: 'spare_part.name',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.sparePartColumnsNoActions.quantity'),
      selector: 'quantity',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.actions'),
      selector: 'id',
      grow: true,
      minWidth: "190px",
      cell: row => (
        <span>
          <EditSparePartDialog key={"EditSparePartDialog" + row.id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} quantity={row.quantity} requested_quantity={row.requested_quantity} from={"prediagnosis"} headers={headers} callbacks={serviceCallbacks} />
          <DeleteSparePartDialog key={"DeleteSparePartDialog" + row.id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} from={"prediagnosis"} headers={headers} callbacks={serviceCallbacks} />
        </span>
      ),
    }
  ];

  ///////////////////////////////////////////////////////////////////////
  // Efects
  //////////////////////////////////////////////////////////////////////
  useEffect(() => {

    fetchData();
    fetchServiceData();
  }, []);

  async function fetchData() {
    let userId = props.match.params.id;
    const costCentersFetch = await CostCenterApi.getAllCostCenters()
    setCostCenters(costCentersFetch.data)
    return fetch(`/api/v1/customers/${userId}`)
      .then(response => response.json())
      .then(json => {
        console.log(json);

        setCustomerId(json.data.id)
        setCustomerFirstname(json.data.names)
        setCustomerLastname(json.data.lastname)
        setCustomerSurname(json.data.surname)
        setCustomerEmail(json.data.email)
        setZipcode(json.data.zipcode)
        setState(json.data.state)
        setDelegation(json.data.delegation)
        setColony(json.data.colony)
        setStreettype(json.data.street_type)
        setStreetName(json.data.street_name)
        setExtNumber(json.data.ext_number)
        setIntNumber(json.data.int_number)
        setPhone(json.data.phone)
        setReference(json.data.reference)
        setSelectedPerson(json.data.person_type)
        setZipcodeFn(json.data.zipcode_fn)
        setStateFn(json.data.state_fn)
        setDelegationFn(json.data.delegation_fn)
        setColonyFn(json.data.colony_fn)
        setStreettypeFn(json.data.street_type_fn)
        setStreetNameFn(json.data.street_name_fn)
        setExtNumberFn(json.data.ext_number_fn)
        setIntNumberFn(json.data.int_number_fn)
        setPhoneFn(json.data.phone_fn)

        if (json.data.country != null) {
          setCountry(json.data.country.iso)
          setCountryChange(true)
          setCountryIVA(json.data.country.iva)
        }
        setAdministrativeDemarcation(json.data.administrative_demarcation)
        setAdministrativeDemarcationFn(json.data.administrative_demarcation_fn)
        setRut(json.data.rut)
        if (json.data.additional_addresses != null) {
          setAdditionalsAddresses(json.data.additional_addresses)
        }
        setPolicies(json.data.policies)
        // HANDLRE COUNTRY INFO
        handleCountryInputs(json.data.country.iso)

      })
  }
  async function fetchServiceData() {
    let service_id = props.match.params.service_id;
    return fetch(`/api/v1/services/${service_id}`)
      .then(response => response.json())
      .then(json => {

        // Handle service data
        setTotalAmount(json.total_amount)
        setFirstLoad(true)
        if (json.service_type) {
          setServiceType(json.service_type)
          handleServiceTypeChange(json.service_type)
        }
        if (json.subcategory) {
          setSubcategory(json.subcategory)
        }

        setServiceID(json.id)
        setServiceNumber(json.number)
        setServiceStatusLabel(json.status_label)

        setRequested(json.requested)
        setRequestChannel(json.request_channel)
        setTechinicianNumber(json.technicians_number)
        setHourAmout(json.hour_amount)
        setFeeAmount(json.fee_amount)
        setTotalhours(json.total_hours)
        setSelectedCostCenterId(json.cost_center_id)
        setDistributorName(json.distributor_name)
        setDistributorEmail(json.distributor_email)
        setQuotations(json.quotations)
        setAssignedQuotationId(json.new_visit.assigned_quotation_id)
        console.log({assigned_quotation_id: json.new_visit.assigned_quotation_id});

        if (json.requested) {
          setDistributorCheck(json.requested != "Cliente directo" ? "" : "hidden")
        }
        setSelectedProductRows(json.customer_products.filter(customer_product => customer_product.status != "Servicio completado"));

        setBackground(json.background)
        setNoPaymentCheck(json.no_payment)
        setPaymentChannel(json.payment_channel)
        setSelectedPaymentDate(json.payment_date)
        setNoPaymentOption(json.no_payment_reason)
        setInvoiceCheck(json.invoice ? "si" : "No")
        setProducts(json.customer_products)
        setServiceFiles(json.file_resources)
        setPaymentFiles(json.payment_resources)
        setPrincipalTechnician(json.principal_technician)
        setIBSNumber(json.ibs_number)



        if (json.calendar_events.length > 0) {
          setTechnicians(json.technicians)
          //setEvent({start: json.calendar_events[0].start_date, end: json.calendar_events[0].finish_date})
          setServiceTechnicians(json.service_technicians)

        }

        setSelectedConsumables(json.service_products)
        setConsumableAmount(json.service_products.map(item => item.amount).reduce((prev, curr) => prev + curr, 0))
        setSelectedConsumablesRows(json.service_products.map(function (consumable_row) {
          return ({amount: String(consumable_row.amount), total_boxes: String(consumable_row.quantity), product_id: String(consumable_row.product_id)});
        }));

        setVisit(json.new_visit)
        setTotalAmount(json.new_visit.total_amount)
        setHourAmout(json.new_visit.hour_amount)
        setFeeAmount(json.new_visit.fee_amount)
        fetchVisitPayments((json.new_visit ? json.new_visit.id : json.id), "Visita")
        if (json.visits.length > 0) {
          setVisitNumber(json.visits.length + 1)
        }


        if (json.policy_id) {
          setSelectedPoliciesRows(json.policy_id)
          setCurrentPolicy(policies.find(policy => policy.id === json.policy_id))
        } else {
          setSelectedPoliciesRows(policies[0].id)
          setCurrentPolicy(policies[0])
        }

      })
  }



  useEffect(() => {
    if (noPaymentOption == 'Pagado en cotización') return

    if (selectedProductRows) {
      fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation.admin_name_3, true)
    }
    fetchPolicyTotal(currentPolicy)

  }, [service_type, selectedConsumablesRows, paymentChannel]);

  useEffect(() => {
    if (!serviceUpdated && service_type == 'Mantenimiento') {
      setConsumableAmount(consumables.map(item => item.sub_total_consumable_amount_without_events).reduce((prev, curr) => prev + curr, 0))
      setSelectedConsumablesRows(consumables.map(function (consumable_row) {
        return ({amount: consumable_row.sub_total_consumable_amount_without_events, total_boxes: consumable_row.total_boxes_without_events, product_id: consumable_row.consumable.product_id});
      }));
    } else {
      setConsumableAmount(0)
    }
  }, [consumables]);

  useEffect(() => {
    setPaymentLink(`${site_url(process.env.RAILS_ENV)}/payments?object_id=${(visit ? visit.id : serviceID)}&object_class=Visita&customer_id=${customer_id}&amount=${totalAmount}`)
    props.getRequestedSpareParts(serviceID);
  }, [serviceID]);


  useEffect(() => {
    if (isPaymentEmail) {
      setPaymentEmailDialog(false);
      if (!loading) {
        setLoading(true);
      }
      saveService();
    }
  }, [isPaymentEmail]);

  useEffect(() => {
    if (!!assignedQuotationId) return

    if (event.start != "") {
      fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation.admin_name_3, true, null, event)
    }
  }, [event]);

  useEffect(() => {
    fetchPolicyTotal(currentPolicy)
  }, [currentPolicy]);


  useEffect(() => {

  }, [visit]);

  useEffect(() => {
    if (selectedPolicies) {
      setPolicies(policies.filter(policy => policy.id == selectedPolicies))
    }
  }, [selectedPolicies]);


  function serviceCallbacks() {
    fetchData();
    fetchServiceData();
  }

  //////////////////////////////////////////////////////////////////
  /// Functions
  function fetchPolicyTotal(policy_new) {
    if (service_type == 'Póliza de Mantenimiento') {
      if (policy_new) {
        setSelectedProductRows(policy_new.policy_customer_products.map((policy_customer_product) => policy_customer_product.customer_product))
        fetchServiceTotal(country, policy_new.policy_customer_products.map((policy_customer_product) => policy_customer_product.customer_product.id), zipcode, administrative_demarcation.admin_name_3, true, true)
        setHourAmout(0)
        setFeeAmount(policy_new.viatic_price)
        setConsumableAmount(policy_new.items_price)
        setLaborAmount(policy_new.labor_price)
        setSubtotalAmount(policy_new.total_price)
        setIVAAmount(policy_new.total_price * countryIVA)
        setTotalAmount(policy_new.total_price * (countryIVA + 1))
      }
    }
  }

  function fetchServiceTotal(country_code, products_ids, zipcode_t, administrative_demarcation_name_t, from_consumables = false, from_policy = false, event_local = null) {
    console.log("Calculo el total")
    console.log(event_local)
    if (event_local) {
      var time_diff = date_difference_in_hours(event.start, event.end)
      console.log(time_diff)
    }

    if (products_ids.length > 0) {
      const params = {
        country: `${country_code}`,
        products_ids: `${products_ids}`,
        service_type: `${service_type}`,
        subcategory: `${subcategory}`,
        zipcode: `${zipcode_t}`,
        administrative_demarcation_name: `${administrative_demarcation_name_t}`,
        viatic_value: viaticAmout,
        fee_amount: feeAmount,
        labor_price: laborAmount,
        quotation_id: assignedQuotationId 
      }

      if (event_local) {
        params.time_diff = time_diff
      }
      return axios.get(`/api/v1/services/${serviceID}/total_price`, {params})
        .then(({data: json})=> {
          if (json.data) {
            setTechinicianNumber(json.data.total_technicians)
            setTotalhours(json.data.total_hours)


            if (!from_policy) {

              setViaticAmout(json.data.viatic_value)

              setHourAmout(json.data.hour_amount)
              setFeeAmount(json.data.fee_amount)
              // setSparePartsAmount(json.data.spare_parts_amount)
              setLaborAmount(json.data.labor_price)
              if (service_type == 'Home Program' || (service_type == 'Reparación' && subcategory == "Profesional")) {
                setFeeAmountIncrement(json.data.fee_amount_increment)
                if (time_diff && time_diff > 0) {
                  setTotalhours(time_diff)
                }

              }
            }
            if (!firstLoad) {
              if (service_type == 'Póliza de Mantenimiento') {
                //setSubtotalAmount(json.data.total_amount + consumableAmount)
                //setIVAAmount((json.data.total_amount + consumableAmount) * json.data.iva )
                //setTotalAmount((json.data.total_amount + consumableAmount) * (1+ json.data.iva))
              } else {
                setSubtotalAmount(json.data.subtotal_amount + consumableAmount)
                setIVAAmount((json.data.subtotal_amount + consumableAmount) * countryIVA)
                setTotalAmount(json.data.total_amount + consumableAmount)
              }
            } else {
              if (!from_policy) {
                setIVAAmount(json.data.iva_amount)
                setSubtotalAmount(json.data.subtotal_amount)
                if (totalAmount != 0) {
                  setTotalAmount(json.data.total_amount)
                }
              }
            }
            setFirstLoad(false)
            if (!from_consumables) {
              setConsumables(json.consumables.data.items)
            }
          } else {
            console.log("No hay precio.")
          }
        })
        .catch(error => console.log(error));
    }
  }


  function fetchVisitPayments(object_id, object_class) {
    return fetch(`/api/v1/payments?object_id=${object_id}&object_class=${object_class}`)
      .then(response => response.json())
      .then(json => {
        if (json.data) {
          if (json.data.length > 0 && json.data[0].status == "completed") {
            setServiceStatus("created")
          }
          setPaymentData(json.data)


        } else {
          console.log("No hay precio.")
        }
      })
      .catch(error => console.log(error));
  }

  function validateForm() {
    let messages = [];

    if (selectedProductRows.length == 0) {
      messages.push(t('customer.newService.flashAlert.selectedProductRows'))
    }
    if (service_type == "" || service_type == null) {
      messages.push("Debe seleccionar el tipo de servicio a solicitar")
      setServiceTypeErrorMessage(t('customer.newService.flashAlert.serviceType'))
    }
    if (subcategory == "" || subcategory == null) {
      messages.push("Debe seleccionar la subcategoria de servicio a solicitar")
      setSubcategoryErrorMessage(t('customer.newService.flashAlert.subCategory'))
    }
    if (requested == "" || requested == null) {
      messages.push("Debe indicar como fue solicitado el servicio")
      setRequestedErrorMessage(t('customer.newService.flashAlert.requested'))
    }
    if (requestChannel == "" || requestChannel == null) {
      messages.push("Debe indicar el canal de la solicitud")
      setRequestChannelErrorMessage(t('customer.newService.flashAlert.requestChannel'))
    }

    if ((background == "" || background == null) && service_type != 'Póliza de Mantenimiento') {
      messages.push(t('customer.newService.flashAlert.indicateProblem'))
      setBackgroundErrorMessage("Debe indicar antecedentes del problema")
    }

    if (event.start == "" || event.start == null) {
      messages.push(t('customer.newService.flashAlert.startDate'))
      setEventErrorMessage("Debe seleccionar una fecha")

    }

    if (noPaymentCheck) {
      if (noPaymentOption == "" || noPaymentOption == null) {
        messages.push(t('customer.newService.flashAlert.noPaymentOption'))
        setNoPaymenErrorMessage("Debe seleccionar una opcción de no pago")

      }

    } else {
      if (selectedPaymentDate == "" || selectedPaymentDate == null) {
        messages.push(t('customer.newService.flashAlert.selectedPaymentDate'))
        setSelectedPaymentDateErrorMessage("Debe seleccionar fecha limite de pago")

      }

    }

    if (service_type == 'Póliza de Mantenimiento' && selectedPolicies == "") {
      messages.push(t('customer.newService.flashAlert.selectedPolicies'))
    }

    messages.forEach(element => {
      flash_alert(t('customer.newService.flashAlert.attention'), element, "warning")
    });

    if (messages.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  function saveService(redirect_param = true, schedule_visit) {
    var body = new FormData();
    body.set('service_id', serviceID);
    body.set('customer_id', customer_id);
    if (visit) {
      body.set('visit_id', visit.id);
    }
    body.set('address', checked);

    if (redirect_param && noPaymentOption == 'Pagado en cotización') {
      body.set('assigned_quotation_id', assignedQuotationId)
    }

    body.set('spare_parts_amount', sparePartsAmount);
    body.set('address_fn', checkedFN);
    body.set('service_type', service_type);
    body.set('subcategory', subcategory);
    body.set('requested', requested);
    body.set('request_channel', requestChannel);
    body.set('distributor_name', distributorName);
    body.set('distributor_email', distributorEmail);
    body.set('customer_products_id', selectedProductRows.map(function (product_row) {
      return (product_row.id);
    }));



    // Service Totals
    body.set('technicians_number', techinicianNumber);
    body.set('hour_amount', hourAmout);
    body.set('fee_amount', feeAmount);
    body.set('labor_amount', laborAmount);
    body.set('viatic_amount', viaticAmout);
    body.set('subtotal_amount', subtotalAmount);
    body.set('iva_amount', ivaAmount);
    body.set('total_hours', totalhours);
    body.set('total_amount', totalAmount);


    body.set('background', background);
    body.set('no_payment', noPaymentCheck);
    body.set('payment_channel', paymentChannel);
    body.set('payment_date', selectedPaymentDate);
    body.set('no_payment_reason', noPaymentOption);
    body.set('invoice', (invoiceCheck === "si" ? true : false));
    body.set('status', (schedule_visit ? schedule_visit : serviceStatus));
    body.set('event_start', event.start);
    body.set('event_end', event.end);
    body.set('technicians_ids', technicians_ids);
    body.set('payment_state', ((paymentData.length > 0 && paymentData[0].status == "completed") ? "paid" : "pending"));
    body.set('customerEmail', customerEmail);
    body.set('paymentEmailAdditional', paymentEmailAdditional);
    body.set('isPaymentEmail', isPaymentEmail);
    body.set('from', from);

    if (service_type == 'Póliza de Mantenimiento') {
      body.set('policy_id', selectedPolicies);
    }

    files.forEach((file) => {
      body.append('images[]', JSON.stringify(file));
    });

    if (consumables) {
      body.append('consumables[]', "{}");
    }

    selectedConsumablesRows.forEach((consumable) => {
      body.append('consumables[]', JSON.stringify(consumable));
    });

    return axios.post(`/api/v1/services/${serviceID}/visits`, body, {headers: headers})
      .then(response => {
        if (redirect_param) {
          flash_alert(t('customer.showCustomer.flashAlert.success'), t('customer.showCustomer.flashAlert.updateService'), "success")
        }
        setRedirect(redirect_param);
      })
      .catch(e => {
        if (e.response.data) {
          console.log(e.response)
          setLoading(false);
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });
  }


  //////////////////////////////////////////////////////////////////
  /// Handles

  const handlepaymentChannel = (event, newpaymentChannel) => {
    if (newpaymentChannel == "online" || newpaymentChannel == "transfer") {
      setServiceStatus("created")
    }
    setPaymentChannel(newpaymentChannel);
  };
  const handleInvoiceCheckChange = (event) => {
    setInvoiceCheck(event.target.value);
  };

  const handlePaymentDateChange = (date) => {
    setSelectedPaymentDate(date);
  };


  function handleCountryInputs(country_iso) {
    if (country_iso == "CL") {
      setPersonCheck("hidden");
      setZipcodeCheck("hidden");
      setDelegationCheck("hidden");
      setColonyCheck("hidden");
      setStateLabel("Comuna/Región");
      setExtNumberLabel("Número");
      setIntNumberLabel("Depto");
      setRUTCheck("");
    } else {
      setPersonCheck("");
      setRUTCheck("hidden");
      setZipcodeCheck("");
      setDelegationCheck("");
      setColonyCheck("");
      setStateLabel("Estado");
      setExtNumberLabel("Número Exterior");
      setIntNumberLabel("Número Interior");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) {
      setLoading(false);
      return false;
    }
    if (paymentChannel == "online" || paymentChannel == "transfer") {
      setPaymentEmailDialog(true)
    } else {
      if (!loading) {
        setLoading(true);
      }
      saveService();
    }
  }

  function handleServiceTypeChange(e) {
    setServiceType(e)
    const serviceTypes = serviceTypeLabels(i18next.language)
    console.log({serviceTypes})
    const serviceTypeKey = Object.keys(serviceTypes).find(serviceTypeLabel => serviceTypes[serviceTypeLabel].key === e)
    setSubcategory('')
    const subcategories = serviceTypeSubcategories(i18next.language)
    setSubcategoryOptions(subcategories[serviceTypeKey])

    if (e === 'Reparaciones en Taller') {
      if (selectedProductRows.length > 0) {
        setoggledClearProductsRows(false)
      } else {
        setoggledClearProductsRows(true)
      }
      setProductTableDisabled(false)
    } else {
      setoggledClearProductsRows(true)
      setProductTableDisabled(false)
    }
  }

  function handleRequestedChange(e) {
    setRequested(e.target.value)
    const requestedDistributor = requestedLabels(i18next.language).find(requested => requested.key === 'Distribuidor autorizado')?.key || null
    if (e.target.value === requestedDistributor) {
      setDistributorCheck('')
    } else {
      setDistributorCheck('hidden')
    }
  }

  async function onServiceChangeFiles(e) {
    if (e.length > 0) {
      const dT = [];
      e.forEach(async function (item) {

        await getBase64(item)
          .then((encFile) => {
            dT.push(encFile)
            setFiles(dT);
          }).catch(error => console.log("error"));

      });

    }
  };

  function handleProductRowChange(state) {
    // setoggledClearProductsRows
    setoggledClearProductsRows(true)
    setSelectedProductRows(state.selectedRows)
    fetchServiceTotal(country, state.selectedRows.map((product) => product.id), zipcode, administrative_demarcation?.admin_name_3)
    if (service_type == 'Reparaciones en Taller' && state.selectedRows.length > 0) {
      setProductTableDisabled(true)
    }
  }

  function handlePolicyRowChange(policy) {
    setCurrentPolicy(policy);
    setSelectedPoliciesRows(policy.id);
  }

  function handleConsumableRowChange(state) {
    if (service_type == 'Mantenimiento') {
      setConsumableAmount(state.selectedRows.map(item => item.sub_total_consumable_amount_without_events).reduce((prev, curr) => prev + curr, 0))
    } else {
      setConsumableAmount(0)
    }
    setSelectedConsumablesRows(state.selectedRows.map(function (consumable_row) {
      return ({amount: consumable_row.sub_total_consumable_amount_without_events, total_boxes: consumable_row.total_boxes_without_events, product_id: consumable_row.consumable.product_id});
    }));
  }

  function consumableSelectableRowCriteria(row) {
    if (selectedConsumablesRows.length > 0) {
      return selectedConsumablesRows.find(product => product.product_id === row.consumable.product_id) != undefined;
    } else {
      return true;
    }
  }


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

  //////////////////////////////////////////////////////////////////

  let redirect_check = []
  if (redirect) {
    redirect_check.push(
      <Redirect key="redirect-to-customers" to={`/customers/${customer_id}/services/${serviceID}/edit_service`}><EditService setLoading={setLoading} headers={props.headers} match={props.match} current_user={props.current_user} /></Redirect>
    );
  }

  return (
    <React.Fragment>
      {redirect_check}

      <Paper className="custom-paper">
        <Grid container spacing={3}>
          <Link className="mdl-navigation__link  back-link back-link" to={`/customers/${customer_id}/services/${serviceID}/edit_service`}>
            <i className="material-icons">keyboard_arrow_left</i> {t('globalText.back')}
          </Link>
          <Grid item xs={12}>
            <h1>{t('customer.showCustomer.visitNumber')} {visit_number} - {t('customer.showCustomer.services')} {serviceNumber}</h1>
          </Grid>
        </Grid>

      </Paper>

      <CustomerDetails
        customer_id={customer_id}
        country_names={country_names_g}
        country={country}
        zipcode={zipcode}
        personCheck={personCheck}
        selectedPerson={selectedPerson}
        rut={rut}
        RUTCheck={RUTCheck}
        zipcodeCheck={zipcodeCheck}
        stateLabel={stateLabel}
        administrative_demarcation={administrative_demarcation}
        state={state}
        delegationCheck={delegationCheck}
        delegation={delegation}
        colony={colony}
        street_type={street_type}
        street_name={street_name}
        ext_number={ext_number}
        int_number={int_number}
        phone={phone}
        reference={reference}
        additionalsAddresses={additionalsAddresses}
        colonyCheck={colonyCheck}
        extNumberLabel={extNumberLabel}
        intNumberLabel={intNumberLabel}
        headers={headers}
      />

      <br />

      <ServiceInfoForm
        costCenters={costCenters}
        setSelectedCostCenterId={setSelectedCostCenterId}
        selectedCostCenterId={selectedCostCenterId}
        submit_type="new_visit"
        spare_part_columns={spare_part_columns}
        requested_spare_parts={props.requested_spare_parts}
        classes={classes}
        service_typeErrorMessage={service_typeErrorMessage}
        service_type={service_type}
        service_types_g={service_types_g}
        handleServiceTypeChange={handleServiceTypeChange}
        subcategoryErrorMessage={subcategoryErrorMessage}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        subcategoryOptions={subcategory_options}
        requestedErrorMessage={requestedErrorMessage}
        requested={requested}
        handleRequestedChange={handleRequestedChange}
        requestedBy={requestedLabels(i18next.language)}
        requestChannelErrorMessage={requestChannelErrorMessage}
        requestChannel={requestChannel}
        setRequestChannel={setRequestChannel}
        channels={channels}
        distributorCheck={distributorCheck}
        distributorName={distributorName}
        distributorEmail={distributorEmail}
        setDistributorName={setDistributorName}
        setDistributorEmail={setDistributorEmail}
        policies={policies}
        country={country}
        handlePolicyRowChange={handlePolicyRowChange}
        selectedPolicies={selectedPolicies}
        products={products}
        product_columns={product_columns}
        handleProductRowChange={handleProductRowChange}
        selectedProductRows={selectedProductRows}
        consumables={consumables}
        consumable_columns={consumable_columns}
        handleConsumableRowChange={handleConsumableRowChange}
        consumableSelectableRowCriteria={consumableSelectableRowCriteria}
        background={background}
        setBackground={setBackground}
        backgroundErrorMessage={backgroundErrorMessage}
        onServiceChangeFiles={onServiceChangeFiles}
        handleMessage={handleMessage}
        serviceFiles={serviceFiles}
        setServiceFiles={setServiceFiles}
        toggledClearProductsRows={toggledClearProductsRows}
        productTableDisabled={productTableDisabled}
  />

      <br />

      <Paper className="custom-paper">
        <h1 className="panel-custom-title">{t('services.visits.instalationAddress')}</h1>

        <List>

          <ListItem key="principal" role={undefined} dense button selected={checked == "principal"}>
            <ListItemIcon className="service-address-label">
              <FormControlLabel value="principal" control={<Radio color="primary" />} label="" checked={checked == "principal"} disabled
                tabIndex={-1}
              />

            </ListItemIcon>
            <ListItemText
              id={"radio-address-list-label-principal"}
              primary={"Principal"}
              secondary={`${street_type} ${street_name}, ${ext_number} ${int_number}, ${administrative_demarcation != null ? administrative_demarcation.admin3_admin1 : state}${zipcode != "" ? (", Código Postal: " + zipcode) : ""}`}
            />
            <ListItemSecondaryAction>

            </ListItemSecondaryAction>
          </ListItem>
          {additionalsAddresses.map((additional_address) => {
            const labelId = `radio-address-list-label-${additional_address.id}`;
            return (
              <ListItem key={additional_address.id} role={undefined} dense button selected={checked == additional_address.id}>
                <ListItemIcon className="service-address-label">
                  <FormControlLabel value={additional_address.id} control={<Radio color="primary" />} label="" checked={checked == additional_address.id} disabled
                    tabIndex={-1}
                  />

                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={additional_address.name}
                  secondary={`${additional_address.street_type} ${additional_address.street_name}, ${additional_address.ext_number} ${additional_address.int_number}, ${additional_address.administrative_demarcation != null ? additional_address.administrative_demarcation.admin3_admin1 : additional_address.state}${additional_address.zipcode != "" ? (", Código Postal: " + additional_address.zipcode) : ""}`}
                />
                <ListItemSecondaryAction>

                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Paper>

      <br />

      <Paper className="custom-paper">
        <h1 className="panel-custom-title">{t('customer.newService.diary.title')}</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <p className="service-subtitle">{t('customer.newService.diary.subTitle')}</p>
            {(country_change) &&
              <NewScheduleDialog
                schedule_type="service"
                btn_classname={""}
                btn_text={t('customer.newService.diary.calendarButton')}
                customer_id={customer_id}
                country={country}
                selectedProductRows={selectedProductRows}
                service_type={service_type}
                subcategory={subcategory}
                requested={requested}
                techinicianNumber={techinicianNumber}
                zipcode={zipcode}
                administrative_demarcation={administrative_demarcation}
                setTechinicianNumber={setTechinicianNumber}
                event={event}
                setEvent={setEvent}
                technicians_ids={technicians_ids}
                setTechniciansIds={setTechniciansIds}
                saveService={saveService}
                technicians={technicians}
                setTechnicians={setTechnicians}
                totalhours={totalhours}
              />
            }
            <FormHelperText className="brand-error-message">{eventErrorMessage}</FormHelperText>
          </Grid>
          <Grid item xs={12} sm={6}>
            {event.start != "" &&
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <p className="service-subtitle">{t('customer.newService.diary.selectedDate')}</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className="service-price-table-label">{t('customer.newService.diary.dayAndHour')}</span>
                  <span className="service-scheddule-value">{date_event_format(event.start, event.end)}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className="service-price-table-label">{t('customer.newService.diary.duration')}</span>
                  <span className="service-scheddule-value">{date_difference_in_hours(event.start, event.end)} {pluralize("hora", date_difference_in_hours(event.start, event.end))}</span>
                </Grid>
                <Grid item xs={12}>
                  <span className="service-price-table-label">{t('customer.newService.diary.technicians')}</span>
                  <span className="service-scheddule-value">
                    {technicians && technicians.map((technician, index) => (
                      <span>
                        {technician.user && ((technician.enterprise != "" && technician.enterprise != null) ? technician.user.fullname + " (" + technician.enterprise + ")" : technician.user.fullname)}{index != technicians.length - 1 ? "," : ""}&nbsp;
                      </span>
                    ))}
                  </span>
                </Grid>

              </Grid>

            }
          </Grid>
        </Grid>
      </Paper>

      <br />

      <Paper className="custom-paper">
        <h1 className="panel-custom-title">{t('customer.newService.paymentService.title')}</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p className="service-subtitle">{t('customer.newService.paymentService.subTitle')}</p>
                <FormControlLabel value={noPaymentCheck} control={<Checkbox color="primary" />} label={t('customer.newService.paymentService.nopay')} checked={noPaymentCheck}
                  tabIndex={-1} onChange={(e) => setNoPaymentCheck(!noPaymentCheck)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className={noPaymentCheck ? "" : "hidden"}>
              <Grid item xs={12}>
                <FormControl variant="outlined" className="MuiFormControl-fullWidth">
                  <InputLabel id="noPaymentOption-simple-select-outlined-label">{t('customer.newService.paymentService.reasonForNonPayment')}</InputLabel>
                  <Select
                    labelId="noPaymentOption-simple-select-outlined-label"
                    id="noPaymentOption-simple-select-outlined"
                    value={noPaymentOption}
                    onChange={(e) => setNoPaymentOption(e.target.value)}
                    label={t('customer.newService.paymentService.reasonForNonPayment')}
                    name="noPaymentOption"
                    error={noPaymenErrorMessage != ""}
                  >
                    {noPaymentsOptions.map((value) => (
                      <MenuItem key={"noPaymentOption-" + value} value={value}>{value}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText className="brand-error-message">{noPaymenErrorMessage}</FormHelperText>
                </FormControl>
              </Grid>
              {
                noPaymentOption == 'Pagado en cotización' &&
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="assignedQuotation-label">{t('visits.quotes.title')}</InputLabel>
                    <Select
                      labelId="assignedQuotation-label"
                      value={assignedQuotationId}
                      onChange={handleAssignedQuotation}
                      label="Cotización"
                    >
                      {quotations.map((quotation) => (
                        <MenuItem disabled={!!quotation.assigned_visit_id} key={`assignedQuotation-${quotation.id}`} value={quotation.id}>{`Cotización N° ${quotation.quotation_number}`}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              }
            </Grid>
            <Grid container spacing={2} className={noPaymentCheck ? "hidden" : ""}>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  value={paymentChannel}
                  exclusive
                  onChange={handlepaymentChannel}
                  aria-label="text paymentChannel"
                  className="service-payment-method-group"
                >
                  <ToggleButton className="service-payment-method-btn" value="online" aria-label="online">
                    {t('customer.newService.paymentService.paymentMethod.online')}
                  </ToggleButton>

                  <ToggleButton className="service-payment-method-btn" value="transfer" aria-label="transfer">
                    {t('customer.newService.paymentService.paymentMethod.transfer')}
                  </ToggleButton>

                  <ToggleButton className="service-payment-method-btn" value="phone" aria-label="phone">
                    {t('customer.newService.paymentService.paymentMethod.payForphone')}
                  </ToggleButton>

                  <ToggleButton className="service-payment-method-btn" value="pay_at_home" aria-label="pay_at_home">
                    {t('customer.newService.paymentService.paymentMethod.payAtHome')}
                  </ToggleButton>

                  <ToggleButton className="service-payment-method-btn" value="bank_deposit" aria-label="bank_deposit">
                    {t('customer.newService.paymentService.paymentMethod.bankDeposit')}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12} className={paymentData.length > 0 ? "" : "hidden"}>
                {
                  paymentData.length > 0 && paymentData[0].status == "completed" ? <p>{t('customer.newService.paymentService.paymentCompleted')}</p> : ""
                }
              </Grid>
              <Grid item xs={12} className={paymentChannel == "phone" ? "" : "hidden"}>
                {
                  (paymentData.length > 0 && paymentData[0].status != "completed" && totalAmount > 0) || paymentData.length < 1 ?
                    <PaymentMethods
                      cols={4}
                      country={country}
                      serviceID={(visit ? visit.id : serviceID)}
                      customer_id={customer_id}
                      totalAmount={totalAmount}
                      object_class={"Visita"}
                      onPaymentCallback={() => saveService(false)}
                    />
                    : <p>{t('customer.newService.paymentService.productAndService')}</p>
                }
              </Grid>
              <Grid item xs={12}>
                <CopyToClipboard text={paymentLink}
                  onCopy={() => flash_alert("Copiado", "Se ha copiado el enlace. Puede pegarlo en nueva ventana para verificar.", "success")}>
                  <a className="mdl-navigation__link brand-primary-link "><i className="material-icons">file_copy</i> {t('customer.newService.paymentService.copyPaymentLink')}</a>
                </CopyToClipboard>
              </Grid>
              <Grid item xs={12}>
                <p className="service-payemnt-method-p">{t('customer.newService.paymentService.customerBill?')}</p>
                <FormControlLabel value="si" control={
                  <Radio
                    checked={invoiceCheck === "si"}
                    onChange={handleInvoiceCheckChange}
                    value={"si"}
                    color="primary"
                    name="radio-button-invoice-check"
                    inputProps={{'aria-label': 'Si'}}
                  />
                } label={t('customer.newService.paymentService.yes')} />

                <FormControlLabel value="no" control={
                  <Radio
                    checked={invoiceCheck === "no"}
                    onChange={handleInvoiceCheckChange}
                    value={"no"}
                    color="primary"
                    name="radio-button-invoice-check"
                    inputProps={{'aria-label': 'No'}}
                  />
                } label={t('customer.newService.paymentService.no')} />
                {invoiceCheck === "si" &&
                  <div>
                    <p className="service-payemnt-method-p">{t('customer.newService.paymentService.generateServiceButton')}</p>
                    <List>
                      <ListItem key="principal" className="service-address-list-item" role={undefined} dense button onClick={handleToggleFN("principal")}>
                        <ListItemIcon className="service-address-label">
                          <FormControlLabel value="principal" control={<Radio color="primary" />} label="" checked={checkedFN == "principal"}
                            tabIndex={-1}
                          />

                        </ListItemIcon>
                        <ListItemText
                          id={"radio-address-list-label-principal"}
                          primary={"Principal"}
                          secondary={`${street_type_fn} ${street_name_fn}, ${ext_number_fn} ${int_number_fn}, ${administrative_demarcation_fn != null ? administrative_demarcation.admin3_admin1 : state_fn}${zipcode_fn != "" ? (", Código Postal: " + zipcode_fn) : ""}`}
                        />
                        <ListItemSecondaryAction>

                        </ListItemSecondaryAction>
                      </ListItem>
                      {/*additionalsAddresses.map((additional_address) => {
                                            const labelId = `radio-address-list-label-${additional_address_fn.id}`;
                                            return (
                                            <ListItem key={additional_address.id} role={undefined} dense button onClick={handleToggle(additional_address.id)}>
                                                <ListItemIcon className="service-address-label">
                                                <FormControlLabel value={additional_address.id} control={<Radio color="primary"/>} label="" checked={checked == additional_address.id}
                                                    tabIndex={-1}
                                                />
                                                
                                                </ListItemIcon>
                                                <ListItemText 
                                                    id={labelId}
                                                    primary={additional_address.name}
                                                    secondary={`${additional_address.street_type} ${additional_address.street_name}, ${additional_address.ext_number} ${additional_address.int_number}, ${additional_address.administrative_demarcation != null ?  additional_address.administrative_demarcation.admin3_admin1 : additional_address.state}${additional_address.zipcode != "" ? (", Código Postal: " + additional_address.zipcode) : "" }`} 
                                                />
                                                <ListItemSecondaryAction>
                                                
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            );
                                        })*/}
                    </List>
                  </div>
                }
              </Grid>

            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <br />
                <PaymentEmailDialog
                  email={customerEmail}
                  paymentEmailDialog={paymentEmailDialog}
                  setPaymentEmailDialog={setPaymentEmailDialog}
                  loading={loading}
                  setLoading={setLoading}
                  saveService={saveService}
                  paymentEmailAdditional={paymentEmailAdditional}
                  setPaymentEmailAdditional={setPaymentEmailAdditional}
                  isPaymentEmail={isPaymentEmail}
                  setIsPaymentEmail={setIsPaymentEmail}
                />
                <div className={classes.wrapper}>
                  <Button id="service-save" disabled={loading} type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                    {t('customer.newService.paymentService.generateServiceButton')}
                  </Button>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>

              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} className="service-price-table-container">
            <p className="service-subtitle">{t('customer.newService.paymentService.serviceDetails.title')}</p>

            <span className="service-price-table-label">{t('customer.newService.paymentService.serviceDetails.concept')}</span>
            <span className="service-price-table-value">{service_type}{subcategory != "" ? (", " + subcategory) : ""}</span>

            <span className="service-price-table-label">{t('services.visits.payments.paymentData.amount')}</span>
            <span className="service-price-table-value">{money_format(country, totalAmount)}
              <Button color="primary" onClick={handleClickOpenTotalDialog}>
                <i className="material-icons">{t('globalText.edit')}</i>
              </Button>
            </span>

            <Dialog open={openTotalDialog} onClose={handleCloseTotalDialog} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">{t('services.visits.changeTotalValue')}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {t('services.visits.changeValue')}
                </DialogContentText>
                <TextField fullWidth type="number" variant="outlined" label={t('services.visits.totalService')} name="total_service" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseTotalDialog} color="primary">
                  {t('globalText.ok')}
                </Button>
              </DialogActions>
            </Dialog>

            <p>
              {t('customer.newService.paymentService.serviceDetails.totalHours')} <span className="pull-right">{totalhours}</span>
            </p>


            <p>
              {t('customer.newService.paymentService.serviceDetails.hourAmount')} <span className="pull-right">{money_format(country, hourAmout)}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.feeAmount')} <span className="pull-right">{money_format(country, feeAmount)}</span>
            </p>

            <p>
              Refacciones <span className="pull-right">{money_format(country, sparePartsAmount)}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.consumables')} <span className="pull-right">{money_format(country, consumableAmount)}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.laborAmount')}<span className="pull-right">{money_format(country, laborAmount)}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.viaticAmount')}<span className="pull-right">{money_format(country, viaticAmout)}</span>
            </p>

            <hr />
            <p>
              {t('customer.newService.paymentService.serviceDetails.subTotalAmount')}<span className="pull-right">{money_format(country, subtotalAmount)}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.ivaAmount')}<span className="pull-right">{money_format(country, ivaAmount)}</span>
            </p>

            <hr />

            <p>
              {t('customer.newService.paymentService.serviceDetails.totalAmount')}<span className="pull-right">{money_format(country, Number(totalAmount))}</span>
            </p>


            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
              <KeyboardDatePicker
                className="payment-date-input"
                id="date-payment-dialog"
                label={t('customer.newService.paymentService.serviceDetails.paydayLimit')}
                format="dd/MM/yyyy"
                value={selectedPaymentDate}
                onChange={handlePaymentDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <FormHelperText className="brand-error-message">{selectedPaymentDateErrorMessage}</FormHelperText>



            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>

      </Paper>





    </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({
  requested_spare_parts: state => state.requested_spare_parts,
  spare_parts: state => state.spare_parts,
  current_user: state => state.current_user,
});
const mapDispatchToProps = {getRequestedSpareParts};
export default connect(structuredSelector, mapDispatchToProps)(NewVisit)
