import React, { useState, useEffect } from 'react';
import CustomerProductEan from "components/customers/common/CustomerProductEan";
import ReactDOM from 'react-dom'
import { Chip } from "@material-ui/core";
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import { canManage } from 'redux-cancan';
import CustomerDetails from "components/customers/CustomerDetails";
import NewScheduleDialog from "components/services/NewScheduleDialog";
import ServiceInfo from "components/services/ServiceInfo";
import ServiceProductsDetail from "components/services/ServiceProductsDetail";
import ServicePayment from "components/services/ServicePayment";
import ServiceVisits from "components/services/visits/ServiceVisits";
import ServicePrediagnosis from "components/services/ServicePrediagnosis";
import ServiceSparePartsRequest from "components/services/ServiceSparePartsRequest";

import QuotationsList from "components/services/quotations/QuotationsList";

import SurveyService from "components/surveys/SurveyService";

import { is_Delivery } from "constants/user_functions"

import PaymentEmailDialog from "components/services/PaymentEmailDialog";
import CancelServiceDialog from "components/services/CancelServiceDialog";
import DeleteSparePartDialog from "components/services/DeleteSparePartDialog";
import EditSparePartDialog from "components/services/EditSparePartDialog";
import FinishServiceDialog from "components/services/FinishServiceDialog";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { country_names_g, street_types_cl_g } from 'components/customers/CustomerForm';
import { csrf, headers, headers_www_form, money_format, date_event_format, date_difference_in_hours, api_token, site_url, date_format_without_time, date_format_without_time_and_zone } from "constants/csrf"

import ShowCustomer from "components/customers/ShowCustomer";
import { createStyles, makeStyles } from '@material-ui/core/styles';
// Button loading
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactCountryFlag from "react-country-flag";
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import MaterialTable from 'react-data-table-component';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

//Accordeon 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Skeleton from '@material-ui/lab/Skeleton';

import { FileIcon, defaultStyles } from 'react-file-icon';
import mime from "mime-to-extensions";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const GET_PRODUCTS_REQUEST = "GET_PRODUCTS_REQUEST";
const GET_PRODUCTS_SUCCESS = "GET_PRODUCTS_SUCCESS";

const GET_SPARE_PARTS_REQUEST = "GET_SPARE_PARTS_REQUEST";
const GET_SPARE_PARTS_SUCCESS = "GET_SPARE_PARTS_SUCCESS";



const GET_REQUESTED_SPARE_PARTS_REQUEST = "GET_REQUESTED_SPARE_PARTS_REQUEST";
const GET_REQUESTED_SPARE_PARTS_SUCCESS = "GET_REQUESTED_SPARE_PARTS_SUCCESS";




const service_types_g = ["Instalación", "Mantenimiento", "Reparación", "Home Program", "Reparaciones en Taller", "Entregas/Despachos"]

const inst_options = ["Profesional", "Doméstico"]
const main_options = ["Mantenimiento Regular", "Certificado de servicio doméstico", "Certificado de mantenimiento Profesional", "Certificado de mantenimiento Doméstico"]
const repair_options = ["Profesional", "Doméstico", "Garantía de reparación previa - Profesional", "Garantía de reparación previa - Doméstico", "Garantía de Manufactura", "Garantía de instalación - Profesional", "Garantía de instalación - Doméstico", "Cortesía - Cargo a ventas Profesional", "Cortesía - Cargo a ventas Doméstico", "Cortesía - Cargo a Servicio"]
const mp_options = ["No existen sub-categorías"]
const repair_t_options = ["Option 1", "Option 2"]
const delivery_options = ["No existen sub-categorías"]

const requested_by = ["Cliente directo", "Distribuidor autorizado"]

const channels = ["Teléfono", "App Clientes", "Web", "Redes sociales"]

const fee_amount_cl = [25600]
const fee_amount_mx = [690]



// No Payment Options
const no_payment_options = ["Cliente paga en domicilio", "Cliente realiza depósito bancario", "Garantía de producto/manufactura", "Garantía Instalación/Reparación", "Instalación sin costo", "Cortesía"]
const country_names = [{ "name": "Indefinido", "iso": "" }, { "name": "Chile", "iso": "CL" }, { "name": "Mexico", "iso": "MX" }]

const customer_product_columns = [
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
    sortable: true,
    cell: row => (
      <CustomerProductEan key={row.serial_id} serial_id={row.serial_id} b2b_ean={row.b2b_ean}/>
    )
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
        {(row.reinstalation_date == null ? (row.instalation_date == null ? "No" : date_format_without_time_and_zone(row.instalation_date)) : date_format_without_time_and_zone(row.reinstalation_date) + " reinstalado")}
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
    name: i18next.t('globalTables.customerProductColumns.policy'),
    selector: 'policy',
    sortable: true,
    hide: 'md',
  },
  {
    name: i18next.t('globalTables.customerProductColumns.status'),
    selector: 'status',
    sortable: true,
    hide: 'md',
  }
];

const spare_part_columns = [
  {
    name: i18next.t('globalTables.sparePartColumns.tnr'),
    selector: 'spare_part.tnr',
    sortable: true,
    hide: 'sm',
  },
  {
    name: i18next.t('globalTables.sparePartColumns.name'),
    selector: 'spare_part.name',
    sortable: true,
    hide: 'md',
  },
  {
    name: i18next.t('globalTables.sparePartColumns.quantity'),
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
        <EditSparePartDialog key={"EditSparePartDialog" + row.id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} quantity={row.quantity} requested_quantity={row.requested_quantity} delivery_status={row.delivery_status} background={row.background} from={"prediagnosis"} headers={headers} />
        <DeleteSparePartDialog key={"DeleteSparePartDialog" + row.id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} from={"prediagnosis"} headers={headers} />
      </span>
    ),
  }
];

const spare_part_columns_no_actions = [

  {
    name: i18next.t('globalTables.sparePartColumnsNoActions.tnr'),
    selector: 'spare_part.tnr',
    sortable: true,
    hide: 'sm',
  },
  {
    name: i18next.t('globalTables.sparePartColumnsNoActions.name'),
    selector: 'spare_part.name',
    sortable: true,
    hide: 'md',
  },
  {
    name: i18next.t('globalTables.sparePartColumnsNoActions.quantity'),
    selector: 'quantity',
    sortable: true,
    hide: 'md',
  }
];





const consumable_columns = [
  {
    name: "TNR",
    selector: 'consumable.product.tnr',
    sortable: true
  },
  {
    name: "Nombre",
    selector: 'consumable.name',
    sortable: true,
    hide: 'sm',
  },
  {
    name: i18next.t('globalTables.consumableColumns.requiredQuantity'),
    selector: 'total_boxes_without_events',
    sortable: true
  }
];


const products_columns = [

  {
    name: i18next.t('globalTables.productsColumns.name'),
    selector: 'name',
    sortable: true,
    hide: 'md',
  },
  {
    name: i18next.t('globalTables.productsColumns.tnr'),
    selector: 'tnr',
    sortable: true,
    hide: 'md',
  },
];



const techinicians_dialog = [];


function getProducts(page = 1, per_page = 10, filterText = "", country = "") {
  return dispatch => {
    dispatch({ type: GET_PRODUCTS_REQUEST });
    return fetch(`/api/v1/products?page=` + page + `&per_page=` + per_page + `&keywords=` + filterText + `&countries=` + country)
      .then(response => response.json())
      .then(json => dispatch(getProductsSuccess(json)))
      .catch(error => console.log(error));
  };
};

export function getProductsSuccess(json) {
  return {
    type: GET_PRODUCTS_SUCCESS,
    json
  };
};



function getSpareParts(service_id) {
  return dispatch => {
    dispatch({ type: GET_SPARE_PARTS_REQUEST });
    return fetch(`/api/v1/services/${service_id}/spare_parts`)
      .then(response => response.json())
      .then(json => dispatch(getSparePartsSuccess(json)))
      .catch(error => console.log(error));
  };
};
export function getSparePartsSuccess(json) {
  return {
    type: GET_SPARE_PARTS_SUCCESS,
    json
  };
};


function getRequestedSpareParts(service_id) {
  return dispatch => {
    dispatch({ type: GET_REQUESTED_SPARE_PARTS_REQUEST });
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



function EditService(props) {
  const {t} = useTranslation()
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
    buttonProgressRelative: {
      position: 'relative',
      left: '50%',
    },

  }));

  const classes = useStyles();

  // Customer Info
  const [projectCustomer, setProjectCustomer] = useState({})
  const [names, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
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
  const [cellphone, setCellphone] = useState("");
  const [reference, setReference] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [country, setCountry] = useState("");
  const [countryIVA, setCountryIVA] = useState(0.16);
  const [rut, setRut] = useState("");
  const [administrative_demarcation, setAdministrativeDemarcation] = useState({});
  // Bill Address
  const [business_name, setBusinessName] = useState("");
  const [rfc, setRFC] = useState("");
  const [email_fn, setEmailFn] = useState("");
  const [zipcode_fn, setZipcodeFn] = useState("");
  const [state_fn, setStateFn] = useState("");
  const [delegation_fn, setDelegationFn] = useState("");
  const [colony_fn, setColonyFn] = useState("");
  const [street_type_fn, setStreettypeFn] = useState("");
  const [street_name_fn, setStreetNameFn] = useState("");
  const [ext_number_fn, setExtNumberFn] = useState("");
  const [int_number_fn, setIntNumberFn] = useState("");
  const [phone_fn, setPhoneFn] = useState("");
  const [email2, setEmail2] = useState("");
  const [commercial_business, setCommercialBusiness] = useState("");
  const [tradename, setTradename] = useState("");
  const [administrative_demarcation_fn, setAdministrativeDemarcationFn] = useState({});

  // ADDITIONALS
  const [additionals, setaAdditionals] = useState([]);

  // ADDITIONALS ADDRESS
  const [additionalsAddresses, setAdditionalsAddresses] = useState([]);


  // CHECKS
  const [personCheck, setPersonCheck] = useState("");
  const [RUTCheck, setRUTCheck] = useState("hidden");
  const [zipcodeCheck, setZipcodeCheck] = useState("");
  const [delegationCheck, setDelegationCheck] = useState("");
  const [stateLabel, setStateLabel] = useState("Estado");
  const [colonyCheck, setColonyCheck] = useState("");
  const [extNumberLabel, setExtNumberLabel] = useState("Numero Exterior");
  const [intNumberLabel, setIntNumberLabel] = useState("Numero Interior");
  const [commercialBusinessCheck, setCommercialBusinessCheck] = useState("hidden")
  const [country_change, setCountryChange] = useState(false);
  const [rfcLabel, setRFCLabel] = useState("RFC");
  const [personPCheck, setPersonPCheck] = useState("");
  const [personMCheck, setPersonMCheck] = useState("");


  // Additional Info

  const [redirect, setRedirect] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);

  const [loading, setLoading] = React.useState(false);
  // Service info
  const [serviceID, setServiceID] = useState("");
  const [serviceNumber, setServiceNumber] = useState("");
  const [serviceStatusLabel, setServiceStatusLabel] = useState("");
  const [ibs_number, setIBSNumber] = useState("");
  const [service_type, setServiceType] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [requested, setRequested] = useState("");
  const [requestChannel, setRequestChannel] = useState("");
  const [subcategory_options, setSubcategoryOptions] = useState([]);
  //const [servicePriceData, setServicePriceData] = useState([]);
  const [serviceStatus, setServiceStatus] = useState("new");
  const [serviceFiles, setServiceFiles] = useState([]);
  const [paymentFiles, setPaymentFiles] = useState([]);

  const [event, setEvent] = useState({ start: "", end: "" });
  const [technicians, setTechnicians] = useState([]);
  const [visits, setVisits] = useState([]);

  const [policy_id, setPolicyiId] = useState("");


  const [technicians_ids, setTechniciansIds] = useState("");
  const [techinicianNumber, setTechinicianNumber] = useState(1);
  const [principal_technician, setPrincipalTechnician] = useState('');
  const [service_technicians, setServiceTechnicians] = useState([]);

  const [spare_part_delivery_date, setSparePartDeliveryDate] = React.useState(new Date());

  const [hourAmout, setHourAmout] = useState(0);
  const [feeAmount, setFeeAmount] = useState(0);
  const [consumableAmount, setConsumableAmount] = useState(0);
  const [laborAmount, setLaborAmount] = useState(0);
  const [ivaAmount, setIVAAmount] = useState(0);
  const [subtotalAmount, setSubtotalAmount] = useState(0);
  const [viaticAmout, setViaticAmout] = useState(0);
  const [totalhours, setTotalhours] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [noPaymentCheck, setNoPaymentCheck] = useState(false);
  const [noPaymentOption, setNoPaymentOption] = useState("");
  const [selectedPaymentDate, setSelectedPaymentDate] = React.useState(new Date());
  const [customerPaymentDate, setCustomerPaymentDate] = React.useState(new Date());
  const [paymentData, setPaymentData] = useState([]);
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentLinkBoolean, setPaymentLinkBoolean] = useState(false);
  const [validated_payment, setValidatedPayment] = useState(false);
  // Distributor
  const [distributorName, setDistributorName] = useState("");
  const [distributorEmail, setDistributorEmail] = useState("");
  const [distributorCheck, setDistributorCheck] = useState("hidden");

  // Products
  const [products, setProducts] = useState([]);
  const [selectedProductRows, setSelectedProductRows] = useState([]);
  // Refacciones
  const [selectedSparePartsRows, setSelectedSparePartsRows] = useState([]);
  const [selectedRequestedSparePartsRows, setSelectedRequestedSparePartsRows] = useState([]);


  const [background, setBackground] = useState("");
  const [backgroundPrediagnosis, setBackgroundPrediagnosis] = useState("");
  const [checkBackgroundPrediagnosis, setCheckBackgroundPrediagnosis] = useState(false);

  const [files, setFiles] = useState([]);
  const [productLoadingCP, setProductLoadingCP] = useState(false);
  const [displayProducTable, setDisplayProducTable] = useState("block");
  const [userLoading, setUserLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");
  // Comsumable
  const [consumables, setConsumables] = useState([]);
  const [selectedConsumables, setSelectedConsumables] = useState([]);
  const [selectedConsumablesRows, setSelectedConsumablesRows] = useState([]);

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


  // PaymentDialog
  const [paymentEmailAdditional, setPaymentEmailAdditional] = useState("");
  const [isPaymentEmail, setIsPaymentEmail] = useState(false);
  const [paymentEmailDialog, setPaymentEmailDialog] = React.useState(false);


  // Cancel service dialog
  const [cancelServiceDialog, setCancelServiceDialog] = React.useState(false);
  const [backgroundCancelService, setBackgroundCancelService] = useState("");
  const [cancelReason, setCancelReason] = React.useState('');
  const [doCancelService, setDoCancelService] = React.useState(false);

  // Permissions
  const [canCancelCervice, setCanCancelCervice] = React.useState(false);
  const [canAddSparePart, setCanAddSparePart] = React.useState(false);
  const [canEditSparePart, setCanEditSparePart] = React.useState(false);
  const [canEditRequestSparePart, setCanEditRequestSparePart] = React.useState(false);
  const [canConfirmVisit, setConfirmVisit] = React.useState(false);


  // Finish Dialog
  const [finishServiceDialog, setFinishServiceDialog] = React.useState(false);
  const [doFinishService, setDoFinishService] = React.useState(false);


  // QUOTATIONS

  const [quotations, setQuotations] = useState([]);

  // Survey

  const [survey, setSurvey] = useState({});


  const handleClickOpenFinishServiceDialog = () => {
    setFinishServiceDialog(true);
  };

  const handleCloseFinishServiceDialog = () => {
    setFinishServiceDialog(false);
  };



  const handleClickOpenTotalDialog = () => {
    setOpenTotalDialog(true);
  };

  const handleCloseTotalDialog = () => {
    setOpenTotalDialog(false);
  };

  // Delete image dialog
  const [openDeleteImageDialog, setOpenDeleteImageDialog] = React.useState(false);
  const [currentDeleteImage, setCurrentDeleteImage] = React.useState("");

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

        let files_t = serviceFiles.filter(file => String(file.id) != String(currentDeleteImage));
        setServiceFiles(files_t)
        let payment_files_t = paymentFiles.filter(file => String(file.id) != String(currentDeleteImage));
        setPaymentFiles(payment_files_t);
        flash_alert("Eliminado!", "El archivo ha sido eliminado correctamente", "success")
      })
      .catch(e => {
        flash_alert("Error!", "No se ha podido eliminar el archivo", "danger")

      });
  };


  const handlepaymentChannel = (event, newpaymentChannel) => {
    setPaymentChannel(newpaymentChannel);
  };
  const handleInvoiceCheckChange = (event) => {
    setInvoiceCheck(event.target.value);
  };

  const handlePaymentDateChange = (date) => {
    setSelectedPaymentDate(date);
  };

  const handleCustomerPaymentDateChange = (date) => {
    setCustomerPaymentDate(date);
  };


  const handleSparePartDeliveryDateChange = (date) => {
    setSparePartDeliveryDate(date);
  };

  async function fetchServiceData() {
    let service_id = props.match.params.service_id;
    setLoading(true)
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
        fetchServicePayments(json.id, "Servicio")
        setRequested(json.requested)
        setRequestChannel(json.request_channel)
        setTechinicianNumber(json.technicians_number)

        setTotalhours(json.total_hours)

        setHourAmout(json.hour_amount)
        setFeeAmount(json.fee_amount)
        setLaborAmount(json.labor_amount)
        setIVAAmount(json.iva_amount)
        setSubtotalAmount(json.subtotal_amount)
        setViaticAmout(json.viatic_amount)

        setDistributorName(json.distributor_name)
        setDistributorEmail(json.distributor_email)
        setServiceStatus(json.status)
        if (json.requested) {
          setDistributorCheck(json.requested != "Cliente directo" ? "" : "hidden")
        }
        setSelectedProductRows(json.customer_products);
        setBackground(json.background)
        setBackgroundPrediagnosis(json.background_prediagnosis)
        setCheckBackgroundPrediagnosis((json.background_prediagnosis != "" && json.background_prediagnosis != null))

        setNoPaymentCheck(json.no_payment)
        setPaymentChannel(json.payment_channel)
        setSelectedPaymentDate(json.payment_date)
        setNoPaymentOption(json.no_payment_reason)
        setInvoiceCheck(json.invoice ? "si" : "No")
        setProducts(json.customer_products)
        setServiceFiles(json.file_resources)
        setPaymentFiles(json.payment_resources)
        setCustomerPaymentDate(json.customer_payment_date)
        setPrincipalTechnician(json.principal_technician)
        setSparePartDeliveryDate(json.spare_part_delivery_date)
        setIBSNumber(json.ibs_number)
        setValidatedPayment(json.validated_payment)
        if (json.calendar_events.length > 0) {
          setTechnicians(json.technicians)
          setEvent({ start: json.calendar_events[0].start_date, end: json.calendar_events[0].finish_date })
          setServiceTechnicians(json.service_technicians)

        }

        setSelectedConsumables(json.service_products)
        setConsumableAmount(json.service_products.map(item => item.amount).reduce((prev, curr) => prev + curr, 0))
        setSelectedConsumablesRows(json.service_products.map(function(consumable_row) {
          return ({ amount: String(consumable_row.amount), total_boxes: String(consumable_row.quantity), product_id: String(consumable_row.product_id) });
        }));

        setPolicyiId(json.policy_id)

        //If canceled
        setBackgroundCancelService(json.background_cancel_service);
        setBackgroundCancelService(json.background_cancel_service);
        setCancelReason(json.cancel_reason);
        // DUMMY VISITS 
        setVisits(json.visits)
        setQuotations(json.quotations)

        // Survey
        setSurvey(json.current_survey)

      }).finally(function() {
        setLoading(false)
      });
  }


  async function fetchServiceStatusLabelData() {
    let service_id = props.match.params.service_id;
    setLoading(true)
    return fetch(`/api/v1/services/${service_id}/status_label`)
      .then(response => response.json())
      .then(json => {
        setServiceStatusLabel(json.status_label)
      }).finally(function() {
        setLoading(false)
      });
  }



  async function fetchProducts() {
    props.getProducts(page, perPage, filterText, country);
  }



  async function fetchSpareParts() {
    let service_id = props.match.params.service_id;
    props.getSpareParts(service_id);
  }

  async function fetchRequestedSpareParts() {
    let service_id = props.match.params.service_id;
    props.getRequestedSpareParts(service_id);
  }



  useEffect(() => {

    async function fetchUserData() {
      let userId = props.match.params.id;
      return fetch(`/api/v1/customers/${userId}`)
        .then(response => response.json())
        .then(json => {
          console.log(json);
          setCustomerId(json.data.id)
          setFirstname(json.data.names)
          setLastname(json.data.lastname)
          setSurname(json.data.surname)
          setEmail(json.data.email)
          setZipcode(json.data.zipcode)
          setState(json.data.state)
          setDelegation(json.data.delegation)
          setColony(json.data.colony)
          setStreettype(json.data.street_type)
          setStreetName(json.data.street_name)
          setExtNumber(json.data.ext_number)
          setIntNumber(json.data.int_number)
          setPhone(json.data.phone)
          setCellphone(json.data.cellphone)
          setReference(json.data.reference)
          setBusinessName(json.data.business_name)
          setRFC(json.data.rfc)
          setEmailFn(json.data.email_fn)
          setZipcodeFn(json.data.zipcode_fn)
          setStateFn(json.data.state_fn)
          setDelegationFn(json.data.delegation_fn)
          setColonyFn(json.data.colony_fn)
          setStreettypeFn(json.data.street_type_fn)
          setStreetNameFn(json.data.street_name_fn)
          setExtNumberFn(json.data.ext_number_fn)
          setIntNumberFn(json.data.int_number_fn)
          setPhoneFn(json.data.phone_fn)
          setSelectedPerson(json.data.person_type)
          setProjectCustomer(json.data.project_customer || {})

          setEmail2(json.data.email2)
          setCommercialBusiness(json.data.commercial_business)
          setTradename(json.data.tradename)
          setaAdditionals(json.data.additionals)

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
          // HANDLRE COUNTRY INFO
          handleCountryInputs(json.data.country.iso)

        })
    }
    fetchUserData();

    fetchServiceData();

    fetchProducts();

    fetchSpareParts();

    fetchRequestedSpareParts();


  }, []);

  useEffect(() => {
    if (country) {
      if (props.current_user || props.current_user.countries.find(object => object["iso"] == country)) {
      } else {
        setRedirect(true)
      }
    }


  }, [country]);

  useEffect(() => {
    if (selectedProductRows) {
      fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation.admin_name_3)
    }
  }, [service_type, selectedConsumablesRows]);

  useEffect(() => {
    setPaymentLink(`${site_url(process.env.RAILS_ENV)}/payments?object_id=${serviceID}&object_class=Servicio&customer_id=${customer_id}&amount=${totalAmount}`)

    if (canManage('/services/cancel')) {
      setCanCancelCervice(true)
    }
    if (canManage('/services/add_spare_part')) {
      setCanAddSparePart(true)
    }
    if (canManage('/services/confirm_visit')) {
      setConfirmVisit(true)
    }

    if (canManage('/services/edit_spare_part')) {
      setCanEditSparePart(true)
    }

    if (canManage('/services/edit_request_spare_part')) {
      setCanEditRequestSparePart(true)
    }

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
    if (doCancelService) {
      setCancelServiceDialog(false);
      if (!loading) {
        setLoading(true);
      }
      saveService();
    }
  }, [doCancelService]);

  useEffect(() => {
    if (doFinishService) {
      setServiceStatus("finished")
      setFinishServiceDialog(false);
      setDoFinishService(false)
      if (!loading) {
        setLoading(true);

      }
      saveService("finish_submit");
    }
  }, [doFinishService]);

  function scheduleCallBack() {
    fetchServiceData();
    fetchProducts();
    fetchSpareParts();
    fetchRequestedSpareParts();
    props.getSpareParts(serviceID);
    props.getRequestedSpareParts(serviceID);

  };



  function fetchServiceTotal(country_code, products_ids, zipcode_t, administrative_demarcation_name_t) {
    if (products_ids.length > 0) {
      const params = {
        fee_amount: feeAmount,
        labor_price: laborAmount,
        country: country_code,
        products_ids: products_ids.join(','),
        service_type: service_type,
        subcategory: subcategory,
        zipcode: zipcode_t,
        administrative_demarcation_name: administrative_demarcation_name_t,
      }
      return axios.get(`/api/v1/services/${serviceID}/total_price`, { params })
        .then(({ data: json }) => {
          if (json.data) {

            setTechinicianNumber(json.data.total_technicians)
            setTotalhours(json.data.total_hours)
            setViaticAmout(json.data.viatic_value)
            setHourAmout(json.data.hour_amount)
            setFeeAmount(json.data.fee_amount)
            setLaborAmount(json.data.labor_price)
            if (!firstLoad) {
              if (service_type == 'Póliza de Mantenimiento') {
                //setSubtotalAmount(json.data.total_amount + consumableAmount)
                //setIVAAmount((json.data.total_amount + consumableAmount) * json.data.iva )
                //setTotalAmount((json.data.total_amount + consumableAmount) * (1+ json.data.iva))
              } else {
                setIVAAmount(json.data.iva_amount)
                setSubtotalAmount(json.data.subtotal_amount)
                setTotalAmount(json.data.total_amount + consumableAmount)
              }
            }
            setFirstLoad(false)
            setConsumables(json.consumables.data.items)


          } else {
            console.log("No hay precio.")
          }
        })
        .catch(error => console.log(error));
    }
  }




  function fetchServicePayments(object_id, object_class) {
    return fetch(`/api/v1/payments?object_id=${object_id}&object_class=${object_class}`)
      .then(response => response.json())
      .then(json => {
        if (json.data) {
          if (json.data.length > 0 && json.data[0].status == "completed") {
            setServiceStatus("paid")
          }
          setPaymentData(json.data)


        } else {
          console.log("No hay precio.")
        }
      })
      .catch(error => console.log(error));
  }


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


  function handleSparePartSubmit(event) {
    event.preventDefault();

    if (spare_part_delivery_date) {
      if (!loading) {
        setLoading(true);
      }
      saveService("spare_part_submit");

    } else {
      flash_alert("Error", "Debe indicar una fecha de recepción de refacciones.", "danger")
    }

  }


  function handlePrediagnosisSubmit(event) {
    event.preventDefault();


    saveService("prediagnosis_submit");


  }



  function handleIBSSubmit(event) {
    event.preventDefault();

    if (!loading) {
      setLoading(true);
    }
    saveService("IBS_submit");

  }

  function handleValidatePaymentSubmit(event) {
    event.preventDefault();
    if (files.length > 0 || paymentFiles.length > 0) {

      setValidatedPayment(true)
      if (!loading) {
        setLoading(true);
      }
      saveService("validate_payment_submit");
    } else {
      flash_alert("Error", "Debe adjuntar un respaldo del pago.", "danger")
    }




  }




  function handleServiceTypeChange(e) {
    setServiceType(e);
    setSubcategory("");
    if (e == service_types_g[0]) {
      setSubcategoryOptions(inst_options)
    } else if (e == service_types_g[1]) {
      setSubcategoryOptions(main_options)
    } else if (e == service_types_g[2]) {
      setSubcategoryOptions(repair_options)
    } else if (e == service_types_g[3]) {
      setSubcategoryOptions(mp_options)
    } else if (e == service_types_g[4]) {
      setSubcategoryOptions(repair_t_options)
    } else if (e == service_types_g[5]) {
      setSubcategoryOptions(delivery_options)
    }

  }

  function handleRequestedChange(e) {
    setRequested(e.target.value)
    if (e.target.value == requested_by[1]) {
      setDistributorCheck("")
    } else {
      setDistributorCheck("hidden")
    }
  }

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

  // Products table
  async function handleProductsPageChange(newPage) {
    setUserLoading(true);
    props.getProducts(newPage, perPage, filterText, country);
    setUserLoading(false);
  }

  async function handleProductsPerRowsChange(newPerPage, newPage) {
    setUserLoading(true);
    props.getProducts(newPage, newPerPage, filterText, country);
    setUserLoading(false);
    setPerpage(newPerPage);
  }

  function handleProductRowChange(state) {

    setSelectedSparePartsRows(state.selectedRows);
  }

  function handleRequestSparePartRowChange(state) {

    setSelectedRequestedSparePartsRows(state.selectedRows);
  }


  async function changeFilterText(e) {
    setFiltertext(e.target.value);
    props.getProducts(page, perPage, e.target.value, country);
  }

  function handleClear() {
    setFiltertext("");
    props.getProducts(page, perPage, "", country);
  }

  function handleAddSparePart(e) {
    console.log("agregando productos al cliente");
    if (selectedSparePartsRows.length > 0) {
      console.log(selectedSparePartsRows)
      var body = new FormData();
      body.set('products', selectedSparePartsRows.map(function(product) {
        return product.id;
      }))
      return axios.post(`/api/v1/services/${serviceID}/create_spare_part`, body, { headers: props.headers })
        .then(response => {
          props.getSpareParts(serviceID);
          props.getRequestedSpareParts(serviceID);
          flash_alert("", "Producto agregado satisfactoriamente", "success")
        })
        .catch(e => {
          console.log(e.response.data);
          if (e.response.data) {
            flash_alert("Error", e.response.data[0][1], "danger")

          }
        });

    } else {
      flash_alert("", "Debe seleccionar un producto para agregarlo al cliente", "error")
    }
  }

  function handleMessage(message, type) {
    if (type == "error") {
      flash_alert("", "El archivo supera los 10 MB de límite o no cumple con el formato esperado", "error")
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

  function handleCancelServiceDialog() {
    setCancelServiceDialog(!cancelServiceDialog);
  }


  function saveService(redirect_param = true, custom_event = null) {
    var body = new FormData();
    setLoading(true)
    body.set('customer_id', customer_id);
    //body.set('address', checked);
    //body.set('address_fn', checkedFN);
    body.set('service_type', service_type);
    body.set('subcategory', subcategory);
    body.set('requested', requested);
    body.set('request_channel', requestChannel);
    body.set('distributor_name', distributorName);
    body.set('distributor_email', distributorEmail);
    body.set('customer_products_id', selectedProductRows.map(function(product_row) {
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
    if (redirect_param == 'prediagnosis_submit') {
      body.set('background_prediagnosis', backgroundPrediagnosis);
    }

    body.set('no_payment', noPaymentCheck);
    body.set('payment_channel', paymentChannel);
    body.set('payment_date', selectedPaymentDate);
    body.set('no_payment_reason', noPaymentOption);
    body.set('invoice', (invoiceCheck === "si" ? true : false));

    if (custom_event) {
      body.set('event_start', custom_event.start);
      body.set('event_end', custom_event.end);
    } else {
      body.set('event_start', event.start);
      body.set('event_end', event.end);
    }
    body.set('technicians_ids', technicians_ids);
    body.set('payment_state', (paymentData.length > 0 && paymentData[0].status != "completed" ? "pending" : "paid"));
    body.set('customerEmail', customerEmail);
    body.set('paymentEmailAdditional', paymentEmailAdditional);
    body.set('isPaymentEmail', isPaymentEmail);
    body.set('customer_payment_date', customerPaymentDate);
    body.set('ibs_number', ibs_number);
    body.set('spare_part_delivery_date', spare_part_delivery_date);
    body.set('principal_technician', principal_technician);
    body.set('validated_payment', (redirect_param == "validate_payment_submit" ? true : validated_payment));
    body.set('submit_type', redirect_param);

    let update_message = "El servicio ha sido actualizado satisfactoriamente";
    // Cancel Service Variables
    if (doCancelService) {
      body.set('background_cancel_service', backgroundCancelService)
      body.set('cancel_reason', cancelReason)
      body.set('do_cancel_service', doCancelService)
      update_message = "Servicio cancelado satisfactoriamente"
    }

    if (doFinishService) {
      update_message = "Servicio finalizado satisfactoriamente"
      body.set('status', "finished");
    } else {
      body.set('status', serviceStatus);
    }

    files.forEach((file) => {
      body.append('payment_files[]', JSON.stringify(file));
    });

    if (selectedConsumablesRows && selectedConsumablesRows.length > 0) {
      selectedConsumablesRows.forEach((consumable) => {
        body.append('consumables[]', JSON.stringify(consumable));
      });
    }
    body.set('requested_spare_parts_ids', selectedRequestedSparePartsRows.map(function(spare_part) {
      return (spare_part.id);
    }));
    return axios.patch(`/api/v1/customers/${customer_id}/services/${serviceID}/update_service`, body, { headers: headers_www_form })
      .then(response => {
        if (redirect_param == 'prediagnosis_submit' || redirect_param == "spare_part_submit" || redirect_param == "IBS_submit" || redirect_param == "validate_payment_submit" || redirect_param == "finish_submit") {
          flash_alert("Servicio actualizado con éxito", update_message, "success");
          setRedirect(false);
          setFiles([]);
          redirect_param = false
        } else if (redirect_param) {
          flash_alert("Operación exitosa", update_message, "success")
          setRedirect(redirect_param);
        } else {
          setRedirect(redirect_param);
        }
        setLoading(false);
        if (!redirect_param) {
          fetchServiceData();
          fetchProducts();
          fetchSpareParts();
          fetchRequestedSpareParts();
          props.getSpareParts(serviceID);
          props.getRequestedSpareParts(serviceID);
        }
      })
      .catch(e => {
        if (e.response.data) {
          setLoading(false);
          console.log(e.response.data);
          for (var key in e.response.data) {
            flash_alert("Error", e.response.data[key], "danger")
          }
        }
      });
  }


  function serviceCallbacks() {
    fetchServiceData();
    fetchProducts();
    fetchSpareParts();
    fetchRequestedSpareParts();
    props.getSpareParts(serviceID);
    props.getRequestedSpareParts(serviceID);
  }

  function softScheduleCallBack() {
    fetchServiceStatusLabelData();
  };



  let redirect_check = []
  if (redirect) {
    redirect_check.push(
      <Redirect key="redirect-to-customers" to={`/customers/${customer_id}/show`}><ShowCustomer setLoading={props.setLoading} headers={props.headers} match={props.match} /></Redirect>
    );
  }

  return (
    <React.Fragment>
      {redirect_check}
      <Paper className="custom-paper">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={8}>
            {(!serviceID || !customer_id) &&
              <>
                <Skeleton height={21} />
                <Skeleton height={18} />
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={1}>
                    <Skeleton animation="wave" variant="circle" width={40} height={40} />
                  </Grid>
                  <Grid item xs={12} sm={11}>
                    <Skeleton />
                  </Grid>
                </Grid>
              </>
              ||
              <>
                <h1>
                  {t('services.edit.serviceTo')} <span style={{textDecoration: "underline"}}>
                    <Link to={`/customers/${customer_id}/show`}>{names}</Link>
                  </span>
                  <span className={personPCheck}> {lastname}{surname}</span>
                  <span className={personMCheck}> {tradename}</span>
                  <span>
                    {
                      Object.keys(projectCustomer).length && 
                        <Chip label="Proyecto" color="primary" variant="default" size="small"/>
                    }
                  </span>
                </h1>
                <Grid container spacing={1}>
                  <Grid item className="mg-bottom-15" xs={12} >
                    <span className="service-high-info">{t('services.number')}: {serviceNumber}</span>
                    <span className="service-high-separator">-</span>
                    <span className="service-high-info">{t('services.statusLabel')}: {serviceStatusLabel}</span>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <ReactCountryFlag
                      countryCode={country}
                      svg
                      style={{
                        width: '2em',
                        height: '2em',
                        marginRight: "15px",
                      }}
                      title={country}
                    />
                  </Grid>
                  <Grid className={personCheck} item xs={12} sm={2}>
                    {t('services.edit.person')} {selectedPerson == "person_p" ? t('services.edit.physicalPerson') : t('services.edit.moralPerson')}
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <span className={RUTCheck}>{rut} - </span>
                    {email} - {email2} - {cellphone}
                  </Grid>
                </Grid>
              </>
            }
          </Grid>
          <Grid item xs={12} sm={4} container
            className={classes.root}
            direction="row"
            justify="flex-end"
            alignItems="center">
            <CancelServiceDialog
              serviceNumber={serviceNumber}
              cancelServiceDialog={cancelServiceDialog}
              setCancelServiceDialog={setCancelServiceDialog}
              backgroundCancelService={backgroundCancelService}
              setBackgroundCancelService={setBackgroundCancelService}
              cancelReason={cancelReason}
              setCancelReason={setCancelReason}
              doCancelService={doCancelService}
              setDoCancelService={setDoCancelService}
            />

            {!(serviceStatusLabel == 'Cancelado') && (canCancelCervice &&
              <Button onClick={() => handleCancelServiceDialog()} className="cancel-link mg-r-15" id="cancel-service" variant="outlined" color="primary" disabled={!serviceID}>
                {t('services.edit.cancelServices')}
              </Button>)
            }

            {
              !(serviceStatusLabel == 'Cancelado') &&
              <Button id="finish-service" variant="contained" color="primary" onClick={() => handleClickOpenFinishServiceDialog()} disabled={!serviceID}>
                {t('services.edit.endService')}
              </Button>
            }

            <FinishServiceDialog
              serviceNumber={serviceNumber}
              finishServiceDialog={finishServiceDialog}
              handleClickOpenFinishServiceDialog={handleClickOpenFinishServiceDialog}
              handleCloseFinishServiceDialog={handleCloseFinishServiceDialog}
              doFinishService={doFinishService}
              setDoFinishService={setDoFinishService}
            />



          </Grid>
        </Grid>
      </Paper>

      <br />


      <CustomerDetails
        customer_id={customer_id}
        country_names={country_names}
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
        no_customer_data={true}
      />


      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header" >
          <h1 className="panel-custom-title">{t('services.taxData.title')}</h1>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={12} className="show-customer-edit-link">
              <Link className="mdl-navigation__link brand-primary-link customers-edit-link" to={`/customers/${customer_id}/edit`}>
                <i className="material-icons">edit</i> {t('globalText.edit')}
              </Link>
            </Grid>
            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {t('services.taxData.businessName')}
              </p>
              <p className="normal-label">
                {business_name && business_name || t('globalText.noInfo')}
              </p>
            </Grid>
            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {rfcLabel}
              </p>
              <p className="normal-label">
                {rfc && rfc || t('globalText.noInfo')}
              </p>
            </Grid>

            <Grid className={commercialBusinessCheck} item xs={12} sm={3}>
              <p className="light-label">
                {t('services.taxData.commercialBusinessCheck')}
              </p>
              <p className="normal-label">
                {commercial_business && commercial_business || t('globalText.noInfo')}
              </p>
            </Grid>

            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {t('services.taxData.email')}
              </p>
              <p className="normal-label">
                {email_fn && email_fn || t('globalText.noInfo')}
              </p>
            </Grid>


            <Grid className={zipcodeCheck} item xs={12} sm={3}>
              <p className="light-label">
                {t('services.taxData.zipcodeCheck')}
              </p>
              <p className="normal-label">
                {zipcode_fn && zipcode_fn || t('globalText.noInfo')}
              </p>
            </Grid>
            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {stateLabel}
              </p>
              <p className="normal-label">
                {administrative_demarcation_fn && (administrative_demarcation_fn != null ? administrative_demarcation_fn.admin3_admin1 : state_fn) || t('globalText.noInfo')}
              </p>
            </Grid>
            <Grid className={delegationCheck} item xs={12} sm={3}>
              <p className="light-label">
                {t('services.taxData.delegationCheck')}
              </p>
              <p className="normal-label">
                {delegation_fn && delegation_fn || t('globalText.noInfo')}
              </p>
            </Grid>
            <Grid className={colonyCheck} item xs={12} sm={3}>
              <p className="light-label">
               {t('services.taxData.colony')}
              </p>
              <p className="normal-label">
                {colony_fn && colony_fn || t('globalText.noInfo')}
              </p>
            </Grid>
            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {t('services.taxData.StreetType')}
              </p>
              <p className="normal-label">
                {street_type_fn && street_type_fn || t('globalText.noInfo')}
              </p>
            </Grid>
            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {t('services.taxData.streetName')}
              </p>
              <p className="normal-label">
                {street_name_fn && street_name_fn || t('globalText.noInfo')}
              </p>
            </Grid>
            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {extNumberLabel}
              </p>
              <p className="normal-label">
                {ext_number_fn && ext_number_fn || t('globalText.noInfo')}
              </p>
            </Grid>

            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {intNumberLabel}
              </p>
              <p className="normal-label">
                {int_number_fn && int_number_fn || t('globalText.noInfo')}
              </p>
            </Grid>

            <Grid item xs={12} sm={3}>
              <p className="light-label">
                {t('services.taxData.phone')}
              </p>
              <p className="normal-label">
                {phone_fn && phone_fn || t('globalText.noInfo')}
              </p>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="paneladditional-header"
        >
          <h1 className="panel-custom-title">{t('services.additional.title')}</h1>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <List dense className={classes.root}>
                {additionals.map((additional) => {
                  const labelId = `checkbox-list-secondary-label-${additional.id}`;
                  return (
                    <ListItem key={"additional" + additional.id} button>
                      <ListItemAvatar className="additional-icon">
                        <i className="material-icons">account_circle</i>
                      </ListItemAvatar>
                      <ListItemText id={labelId} primary={`${additional.names} ${additional.lastname}: ${additional.email}`} />
                      <ListItemSecondaryAction>
                        <Link className="mdl-navigation__link brand-primary-link additional-edit-link" to={`/customers/${customer_id}/additional/${additional.id}/edit`}>
                          <i className="material-icons">edit</i>
                        </Link>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="primary">
                <Link className="mdl-navigation__link brand-primary-link add-additional-edit-link" to={`/customers/${customer_id}/additional`}>
                  <i className="material-icons">person_add</i>&nbsp;&nbsp;{t('services.additional.addAdditionalButton')}
                </Link>
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <br />
      {
        (serviceStatusLabel == "Completado" || serviceStatusLabel == "Finalizado") &&
        <SurveyService
          serviceID={serviceID}
          survey={survey}
        />
      }

      <br />

      <span>
        <ServiceInfo
          service_id={props.match.params.service_id}
          customer_id={customer_id}
          service_type={service_type}
          subcategory={subcategory}
          requested={requested}
          requestChannel={requestChannel}
          distributorName={distributorName}
          distributorEmail={distributorEmail}
          distributorCheck={distributorCheck}
          ibs_number={ibs_number}
          setIBSNumber={setIBSNumber}
          loading={loading}
          handleSubmit={handleIBSSubmit}
          classes={classes}
          policy_id={policy_id}
        />

        <br />

        <ServiceProductsDetail
          customer_product_columns={customer_product_columns}
          selectedProductRows={selectedProductRows}
          productLoadingCP={productLoadingCP}
          background={background}
          serviceFiles={serviceFiles}
          handleClickOpenImageDialog={handleClickOpenImageDialog}
          openDeleteImageDialog={openDeleteImageDialog}
          handleCloseImageDialog={handleCloseImageDialog}
          handleDeleteImage={handleDeleteImage}
        />

        <br />

        <ServiceVisits
          key="service_visits"
          quotations={quotations}
          subcategory={subcategory}
          visits={visits}
          serviceID={serviceID}
          service_technicians={service_technicians}
          canConfirmVisit={canConfirmVisit}
          ibsNumber={ibs_number}
          customer_id={customer_id}
          country={country}
          selectedProductRows={selectedProductRows}
          service_type={service_type}
          requested={requested}
          paymentChannel={paymentChannel}
          noPaymentCheck={noPaymentCheck}
          noPaymentOption={noPaymentOption}
          validated_payment={validated_payment}
          invoiceCheck={invoiceCheck}
          paymentFiles={paymentFiles}
          selectedConsumables={selectedConsumables}
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
          // Callbacks
          scheduleCallBack={scheduleCallBack}

          // Totals
          selectedPaymentDate={selectedPaymentDate}
          customerPaymentDate={customerPaymentDate}
          totalhours={totalhours}
          hourAmout={hourAmout}
          feeAmount={feeAmount}
          laborAmount={laborAmount}
          viaticAmout={viaticAmout}
          consumableAmount={consumableAmount}
          ivaAmount={ivaAmount}
          subtotalAmount={subtotalAmount}
          totalAmount={totalAmount}

          // Bill address
          zipcode_fn={zipcode_fn}
          state_fn={state_fn}
          delegation_fn={delegation_fn}
          colony_fn={colony_fn}
          street_type_fn={street_type_fn}
          street_name_fn={street_name_fn}
          ext_number_fn={ext_number_fn}
          int_number_fn={int_number_fn}
          phone_fn={phone_fn}
          administrative_demarcation_fn={administrative_demarcation_fn}

          //Callbacks
          callbacks={serviceCallbacks}
        />

        <br />

        {
          !is_Delivery(props.current_user) &&
          <QuotationsList
            totalAmount={totalAmount}
            paymentChannel={props.paymentChannel}
            key="service_quotations"
            current_user={props.current_user}
            visits={visits}
            quotations={quotations}
            serviceID={serviceID}
            /* PARA CALCULAR TOTAL DE SERVICIO POR PRODUCTO*/
            // country ,zipcode, administrative_demarcation.admin_name_3

            serviceStatusLabel={serviceStatusLabel}
            service_technicians={service_technicians}
            canConfirmVisit={canConfirmVisit}
            email={email}
            email2={email2}
            customer_id={customer_id}
            country={country}
            countryIVA={countryIVA}
            selectedProductRows={selectedProductRows}
            service_type={service_type}
            subcategory={subcategory}
            requested={requested}
            paymentChannel={paymentChannel}
            noPaymentCheck={noPaymentCheck}
            noPaymentOption={noPaymentOption}
            validated_payment={validated_payment}
            invoiceCheck={invoiceCheck}
            paymentFiles={paymentFiles}
            selectedConsumables={selectedConsumables}
            techinicianNumber={techinicianNumber}
            totalAmount={totalAmount}
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
            // Callbacks
            scheduleCallBack={scheduleCallBack}
            setLoading={setLoading}
            // Totals
            selectedPaymentDate={selectedPaymentDate}
            customerPaymentDate={customerPaymentDate}
            totalhours={totalhours}
            hourAmout={hourAmout}
            feeAmount={feeAmount}
            laborAmount={laborAmount}
            viaticAmout={viaticAmout}
            consumableAmount={consumableAmount}
            ivaAmount={ivaAmount}
            subtotalAmount={subtotalAmount}
            totalAmount={totalAmount}

            // Bill address
            zipcode_fn={zipcode_fn}
            state_fn={state_fn}
            delegation_fn={delegation_fn}
            colony_fn={colony_fn}
            street_type_fn={street_type_fn}
            street_name_fn={street_name_fn}
            ext_number_fn={ext_number_fn}
            int_number_fn={int_number_fn}
            phone_fn={phone_fn}
            administrative_demarcation_fn={administrative_demarcation_fn}

            // ADD SPARE PARTS

            userLoading={userLoading}
            canAddSparePart={canAddSparePart}
            displayProducTable={displayProducTable}
            classes={classes}
            filterText={filterText}
            changeFilterText={changeFilterText}
            handleClear={handleClear}
            handleAddSparePart={handleAddSparePart}
            products_columns={products_columns}
            products={props.products}
            handleProductsPerRowsChange={handleProductsPerRowsChange}
            handleProductsPageChange={handleProductsPageChange}
            handleProductRowChange={handleProductRowChange}
            selectedSparePartsRows={selectedSparePartsRows}
            total={props.total}
            //Callbacks
            callbacks={serviceCallbacks}
          />
        }

        <br />

        {
          !is_Delivery(props.current_user) &&
          <ServicePrediagnosis
            spare_part_columns={(canEditSparePart ? spare_part_columns : spare_part_columns_no_actions)}
            spare_parts={props.spare_parts}
            current_user={props.current_user}
            userLoading={userLoading}
            canAddSparePart={canAddSparePart}
            displayProducTable={displayProducTable}
            classes={classes}
            filterText={filterText}
            changeFilterText={changeFilterText}
            handleClear={handleClear}
            handleAddSparePart={handleAddSparePart}
            products_columns={products_columns}
            products={props.products}
            handleProductsPerRowsChange={handleProductsPerRowsChange}
            handleProductsPageChange={handleProductsPageChange}
            handleProductRowChange={handleProductRowChange}
            total={props.total}
            backgroundPrediagnosis={backgroundPrediagnosis}
            setBackgroundPrediagnosis={setBackgroundPrediagnosis}
            checkBackgroundPrediagnosis={checkBackgroundPrediagnosis}
            loading={loading}
            setLoading={setLoading}
            saveService={saveService}
            handlePrediagnosisSubmit={handlePrediagnosisSubmit}
          />
        }
        <br />
        <ServiceSparePartsRequest
          classes={classes}
          handleSparePartSubmit={handleSparePartSubmit}
          spare_part_columns={spare_part_columns}
          canEditRequestSparePart={canEditRequestSparePart}
          spare_parts={props.requested_spare_parts}
          userLoading={userLoading}
          country_change={country_change}
          // Payment dialog
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
          handleRequestSparePartRowChange={handleRequestSparePartRowChange}
          spare_part_delivery_date={spare_part_delivery_date}
          handleSparePartDeliveryDateChange={handleSparePartDeliveryDateChange}
          principal_technician={principal_technician}
          setPrincipalTechnician={setPrincipalTechnician}
          service_technicians={service_technicians}
          // Schedule dialog
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
          technicians={technicians}
          setTechnicians={setTechnicians}
          totalhours={totalhours}
          // Callbacks
          scheduleCallBack={scheduleCallBack}
          softCallback={softScheduleCallBack}
        />

      </span>


    </React.Fragment>
  );

}
const structuredSelector = createStructuredSelector({
  spare_parts: state => state.spare_parts,
  requested_spare_parts: state => state.requested_spare_parts,
  products: state => state.products,
  page: state => state.page,
  perPage: state => state.perPage,
  total: state => state.total,
  current_user: state => state.current_user,
});
const mapDispatchToProps = { getProducts, getSpareParts, getRequestedSpareParts };
export default connect(structuredSelector, mapDispatchToProps)(EditService)
