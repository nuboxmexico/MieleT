import React, {useState, useEffect} from 'react'
import axios from 'axios';
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {createStructuredSelector} from "reselect"
import {Link} from 'react-router-dom'
import {Link as MuiLink} from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomerProductsTable from 'components/tables/CustomerProductsTable';

import {makeStyles} from '@material-ui/core/styles';
import {headers, money_format, date_format} from "constants/csrf"
import CustomerDetails from "components/customers/CustomerDetails"

import ProjectQuotations from "components/customers/ProjectQuotations"
import CustomerComplaints from "components/customers/CustomerComplaints"
import CustomerQuotations from "components/customers/CustomerQuotations"
import AdditionalProductForm from "components/products/AdditionalProductForm"
import DeletePolicyDialog from "components/policies/DeletePolicyDialog"
import ValidatePaymentPolicyDialog from "components/policies/ValidatePaymentPolicyDialog"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import {flash_alert} from 'components/App';
import MaterialTable from 'react-data-table-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';


import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';


// TABS
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const GET_PRODUCTS_REQUEST = "GET_PRODUCTS_REQUEST";
const GET_PRODUCTS_SUCCESS = "GET_PRODUCTS_SUCCESS";

const GET_USER_PRODUCTS_REQUEST = "GET_USER_PRODUCTS_REQUEST";
const GET_USER_PRODUCTS_SUCCESS = "GET_USER_PRODUCTS_SUCCESS";

const GET_SERVICES_REQUEST = "GET_SERVICES_REQUEST";
const GET_SERVICES_SUCCESS = "GET_SERVICES_SUCCESS";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  },
];

const policy_customer_product_columns = [
  {
    name: i18next.t('globalTables.productsColumns.tnr'),
    selector: 'customer_product.product.tnr',
    sortable: true,
    hide: 'sm'
  },
  {
    name: i18next.t('globalTables.productsColumns.product'),
    selector: 'customer_product.product.name',
    sortable: true,
    cell: row => (
      <span>
        {(row.customer_product.product.name == "" ? i18next.t('globalText.noInfo'): row.customer_product.product.name)}
      </span>
    ),
  },
];

const service_columns = [
  {
    name: i18next.t('globalTables.serviceColumns.number'),
    selector: 'number',
    sortable: true,
    cell: row => (
      <span>
        {(row.number == "" ? i18next.t('globalText.noInfo') : row.number)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.serviceColumns.ibsNumber'),
    selector: 'ibs_number',
    sortable: true,
    hide: 'sm',
    cell: row => (
      <span>
        {(!row.ibs_number ? i18next.t('globalText.noInfo'): row.ibs_number)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.serviceColumns.serviceType'),
    selector: 'service_type',
    sortable: true,
    hide: 'md'
  },
  {
    name: i18next.t('globalTables.serviceColumns.subCategory'),
    selector: 'subcategory',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(!row.subcategory ? i18next.t('globalText.noInfo') : row.subcategory)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.serviceColumns.requested'),
    selector: 'requested',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {
          (
            (!row.requested) ? (i18next.t('globalText.noInfo')) :
              (row.requested.toLowerCase() == "distribuidor autorizado" ? row.distributor_name + " " + row.distributor_email : row.requested)
          )
        }
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.serviceColumns.requestChannel'),
    selector: 'request_channel',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(row.request_channel == "" ? i18next.t('globalText.noInfo') : row.request_channel)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.serviceColumns.statusLabel'),
    selector: 'status_label',
    sortable: true,
    hide: 'md'
  },
  {
    name: i18next.t('globalTables.serviceColumns.visitNumber'),
    selector: 'last_visit',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(!(row.last_visit && row.last_visit.visit_number) ? i18next.t('globalText.noInfo') : row.last_visit.visit_number)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.serviceColumns.createdAt'),
    selector: 'created_at_date',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(row.request_channel == "App Clientes" ? row.created_at : row.created_at_date)}
      </span>
    ),

  },
  {
    name: i18next.t('globalTables.serviceColumns.actions'),
    selector: 'id',
    grow: true,
    minWidth: "120px",
    cell: row => (
      <div>
        <Link className="mdl-navigation__link brand-primary-link customers-show-link services-show-link mg-r-15" to={`/customers/${row.customer_id}/services/${row.id}/edit_service`}>
          <i className="material-icons material-icons-20">assignment</i> Detalles
        </Link>
      </div>
    ),
  },
];


function getProducts(page = 1, per_page = 5, filterText = "", country = "") {
  return dispatch => {
    dispatch({type: GET_PRODUCTS_REQUEST});
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


function getCustomerProducts(customer_id) {
  return dispatch => {
    dispatch({type: GET_USER_PRODUCTS_REQUEST});
    return fetch(`/api/v1/customers/${customer_id}/products`)
      .then(response => response.json())
      .then(json => dispatch(getCustomerProductsSuccess(json)))
      .catch(error => console.log(error));
  };
};
export function getCustomerProductsSuccess(json) {
  return {
    type: GET_USER_PRODUCTS_SUCCESS,
    json
  };
};


function getServices(page = 1, per_page = 5, customer_id = "", only_payed = true) {
  return dispatch => {
    dispatch({type: GET_SERVICES_REQUEST});
    return fetch(`/api/v1/services?page=` + page + `&per_page=` + per_page + `&customer_id=` + customer_id + `&only_payed=` + only_payed)
      .then(response => response.json())
      .then(json => dispatch(getServicesSuccess(json)))
      .catch(error => console.log(error));
  };
};

export function getServicesSuccess(json) {
  return {
    type: GET_SERVICES_SUCCESS,
    json
  };
};


function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={3} pb={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const country_names = [{"name": "Indefinido", "iso": ""}, {"name": "Chile", "iso": "CL"}, {"name": "Mexico", "iso": "MX"}, {"name": "Brasil", "iso": "BR"}]

const useStyles = makeStyles((theme) => ({
  root: {
    div: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
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
  },
}));

function ShowCustomer(props) {
  const {t} = useTranslation();
  const [projectCustomer, setProjectCustomer] = useState({})
  const [unitRealState, setUnitRealState] = useState({})
  const [customer_id, setCustomerId] = useState("");
  const [names, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
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
  const [selectedPerson, setSelectedPerson] = useState("");
  const [country, setCountry] = useState("");
  const [rut, setRut] = useState("");
  const [email2, setEmail2] = useState("");
  const [commercial_business, setCommercialBusiness] = useState("");
  const [tradename, setTradename] = useState("");
  const [administrative_demarcation, setAdministrativeDemarcation] = useState({});
  const [administrative_demarcation_fn, setAdministrativeDemarcationFn] = useState({});
  const [customerLoaded, setCustomerLoaded] = useState(false);

  // ADDITIONALS
  const [additionals, setaAdditionals] = useState([]);
  // ADDITIONALS ADDRESS
  const [additionalsAddresses, setaAdditionalsAddresses] = useState([]);
  // POLICIES
  const [policies, setPolicies] = useState([]);


  // CHECKS
  const [personCheck, setPersonCheck] = useState("");
  const [RUTCheck, setRUTCheck] = useState("hidden");
  const [zipcodeCheck, setZipcodeCheck] = useState("");
  const [delegationCheck, setDelegationCheck] = useState("");
  const [stateLabel, setStateLabel] = useState("Estado");
  const [colonyCheck, setColonyCheck] = useState("");
  const [extNumberLabel, setExtNumberLabel] = useState("Número Exterior");
  const [intNumberLabel, setIntNumberLabel] = useState("Número Interior");
  const [commercialBusinessCheck, setCommercialBusinessCheck] = useState("hidden");
  const [rfcLabel, setRFCLabel] = useState("RFC");
  const [personPCheck, setPersonPCheck] = useState("");
  const [personMCheck, setPersonMCheck] = useState("");

  // Products
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(5);
  const [filterText, setFiltertext] = useState("");

  const [userLoading, setUserLoading] = useState(false);
  const [userLoadingCP, setUserLoadingCP] = useState(false);
  const [userLoadingServices, setUserLoadingServices] = useState(false);


  const [selectedProductsRows, setSelectedProductsRows] = useState([]);

  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentServiceTab, setCurrentServiceTab] = useState(0);
  const [expandedPolicy, setExpandedPolicy] = useState(0);

  // Products additional
  const [checkedAdditionalProduct, setCheckedAdditionalProduct] = useState(false);
  const [displayProducTable, setDisplayProducTable] = useState("block");
  const [displayProducIcon, setDisplayProducIcon] = useState("extension");
  const [displayProducText, setDisplayProducText] = useState("Agregar producto no existente");
  const [numberProductForms, setnumberProductForms] = useState(1);
  const [additional_prodcut_forms, setAdditionalProdcutForms] = useState([]);
  const handleChangeAdditionalProduct = () => {
    setCheckedAdditionalProduct((prev) => !prev);
    setDisplayProducTable((checkedAdditionalProduct ? "block" : "none"));
    setDisplayProducIcon((checkedAdditionalProduct ? "extension" : "close"));
    setDisplayProducText((checkedAdditionalProduct ? "Agregar producto no existente" : "Cerrar producto no existente"));
    if (!checkedAdditionalProduct) {
      setnumberProductForms(1)
    }
  };

  // Serivices
  const [servicesPage, setServicesPage] = useState(1);
  const [servicesPerPage, setServicesPerpage] = useState(5);

  // Quotations
  const [quotations, setQuotations] = useState([])
  const [quotationProducts, setQuotationProducts] = useState([])


  useEffect(() => {
    async function fetchData() {
      let userId = props.match.params.id;

      return fetch(`/api/v1/customers/${userId}`)
        .then(response => response.json())
        .then(json => {
          setCustomerId(json.data.id)
          setProjectCustomer(json.data.project_customer || {})
          setUnitRealState(json.data.unit_real_state || {})
          fetchQuotations(json.data.email)
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
          if (json.data.country != null) {
            setCountry(json.data.country.iso)
            fetchProducts(json.data.country.iso);
          } else {
            fetchProducts("");
          }
          setAdministrativeDemarcation(json.data.administrative_demarcation)
          setAdministrativeDemarcationFn(json.data.administrative_demarcation_fn)

          setRut(json.data.rut)
          setEmail2(json.data.email2)
          setCommercialBusiness(json.data.commercial_business)
          setTradename(json.data.tradename)
          setaAdditionals(json.data.additionals)
          setPolicies(json.data.policies)
          if (json.data.policies.length > 0) {
            setExpandedPolicy(`accordeon-policy-${json.data.policies[0].id}`)
          }
          if (json.data.additional_addresses != null) {
            setaAdditionalsAddresses(json.data.additional_addresses)
          }
          // HANDLRE COUNTRY INFO
          handleCountryInputs(json.data.country.iso)
          handlePersonInputs(json.data.country.iso, json.data.person_type)
          setCustomerLoaded(true)
        })
        .catch(error => console.log(error));
    }
    fetchData();


    async function fetchQuotations(customer_email) {
      var body = new FormData();
      body.set('email', customer_email);
      return axios.post(`/api/v1/customers/get_quotations`, body, {headers: props.headers})
        .then(response => {
          setQuotations(response.data.data);
          console.log(response.data.data)
        })
        .catch(e => {
          if (e.response.data) {
            console.log("Error", e.response.data[0][1], "danger")

          }
        });
    }

    async function fetchProducts(country_t) {
      props.getProducts(page, perPage, filterText, country_t);
    }

    async function fetchCustomerProducts() {
      let userId = props.match.params.id;
      props.getCustomerProducts(userId);
    }
    fetchCustomerProducts();
    async function fetchServices() {
      let userId = props.match.params.id;
      props.getServices(servicesPage, servicesPerPage, userId);
    }
    fetchServices();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleTabServiceChange = (event, newValue) => {
    setCurrentServiceTab(newValue);
  };



  function handlePersonInputs(country_iso, person_type) {

    if (person_type == "person_m" && country_iso == "MX") {
      setPersonPCheck("hidden")
      setPersonMCheck("")
    } else {
      setPersonPCheck("")
      setPersonMCheck("hidden")
    }
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
      setRFCLabel("RUT Empresa");
      setRUTCheck("");
      setCommercialBusinessCheck("");
    } else {
      setPersonCheck("");
      setRUTCheck("hidden");
      setZipcodeCheck("");
      setDelegationCheck("");
      setColonyCheck("");
      setStateLabel("Estado");
      setExtNumberLabel("Número Exterior");
      setIntNumberLabel("Número Interior");
      setRFCLabel("RFC");
      setCommercialBusinessCheck("hidden");
    }
  }

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
    setSelectedProductsRows(state.selectedRows);
  }

  function handleClear() {
    setFiltertext("");
    props.getProducts(page, perPage, "", country);
  }

  function handleAddProduct(e) {
    console.log("agregando productos al cliente");
    if (selectedProductsRows.length > 0) {
      console.log(selectedProductsRows)
      var body = new FormData();
      body.set('products', selectedProductsRows.map(function (product) {
        return product.id;
      }))
      return axios.post(`/api/v1/customers/${customer_id}/create_product`, body, {headers: props.headers})
        .then(response => {
          props.getCustomerProducts(customer_id);
          flash_alert("", t('customer.showCustomer.flashAlert.addProductSuccessfully'), "success")
        })
        .catch(e => {
          console.log("Respuesta oe");
          console.log(e.response.data);
          if (e.response.data) {
            flash_alert("Error", e.response.data[0][1], "danger")

          }
        });

    } else {
      flash_alert(t('globalText.error'), t('customer.showCustomer.flashAlert.requiredProduct'), "error")
    }
  }

  async function changeFilterText(e) {
    setFiltertext(e.target.value);
    props.getProducts(page, perPage, e.target.value, country);
  }


  function handleNewProductForm() {
    setnumberProductForms(numberProductForms + 1);
    console.log(numberProductForms + 1);
  }

  const handlePolicyChange = (panel) => (event, newExpanded) => {
    setExpandedPolicy(newExpanded ? panel : false);
  };

  // Services table
  async function handleServicesPageChange(newPage) {
    setUserLoadingServices(true);
    props.getServices(newPage, servicesPerPage, customer_id);
    setUserLoadingServices(false);
    setServicesPage(newPage)
  }

  async function handleServicesPerRowsChange(newPerPage, newPage) {
    setUserLoadingServices(true);
    props.getServices(newPage, newPerPage, customer_id);
    setUserLoadingServices(false);
    setServicesPerpage(newPerPage);
  }

  return (
    <React.Fragment>
      <Paper className="custom-paper">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={8}>
            <h1>
              {names &&
                <>
                  {names}
                  <span className={personPCheck}> {lastname} {surname}</span>
                  <span className={personMCheck}> {tradename}</span>
                </>
                || "Sin información"}
            </h1>
            <p>{email} {email2 && `- ${email2}`} {cellphone && `- ${cellphone}`}</p>
          </Grid>
          <Grid item xs={12} sm={4} container
            className={classes.root}
            direction="row"
            justify="flex-end"
            alignItems="center">
            <Link className="new-service-link action-customer-link" to={customerLoaded && `/customers/${customer_id}/new_service` || "#"}>
              <div className={classes.wrapper}>
                <Button id="new-service" disabled={!customerLoaded} variant="contained" color="primary">
                  {t('services.newServicesButton')}
                </Button>
                {!customerLoaded && <CircularProgress size={24} className={classes.buttonProgress + " customer-circular"} />}
              </div>
            </Link>

            <Link className="new-policy-link action-customer-link" to={customerLoaded && `/customers/${customer_id}/new_policy` || "#"}>
              <Button id="new-sell" disabled={!customerLoaded} variant="contained" color="primary">
                {t('services.saleButton')}
              </Button>
            </Link>
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
                      <ListItemText id={labelId} primary={additional.names && (`${additional.names} ${additional.lastname}: ${additional.email}`) || t('globalText.noInfo')} />
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

      {
        Object.keys(unitRealState).length > 0 &&
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header" >
            <h1 className="panel-custom-title">Proyecto</h1>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={3}>
                <p className="light-label">
                  Nombre Cliente Proyecto
                </p>
                <p className="normal-label">
                  {unitRealState.project.name}
                </p>
              </Grid>
              <Grid item xs={12} sm={3}>
                <p className="light-label">
                  Correo
                </p>
                <p className="normal-label">
                  {unitRealState.project.contact_email}
                </p>
              </Grid>

              <Grid item xs={12} sm={3}>
                <p className="light-label">
                  Teléfono
                </p>
                <p className="normal-label">
                  {unitRealState.project.contact_cellphone}
                </p>
              </Grid>

              <Grid item xs={12} sm={3}>
                <p className="light-label">
                  Código Unidad Inmobiliaria:
                </p>
                <p className="normal-label">
                  <MuiLink target="_blank" color="primary" className="force-underline" component="a" href={`/customers/${customer_id}/projects/${unitRealState.project.id}/show`}>
                    {unitRealState.unit_number}
                  </MuiLink>
                </p>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

      }

      <br />

      {
        !!Object.keys(projectCustomer).length && <ProjectQuotations projectCustomer={projectCustomer} />
      }

      <br />

      <Paper className="custom-paper">
        <h1 className="panel-custom-title">{t('customer.showCustomer.title')}</h1>


        <Tabs value={currentTab} onChange={handleTabChange} aria-label="simple tabs example"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className="tech-taxon-tabs"
        >
          <Tab key={"products-tab"} label={t('customer.showCustomer.equipment')} {...a11yProps(0)} />
          <Tab key={"policy-tab"} label={t('customer.showCustomer.maintenancePolicies')} {...a11yProps(1)} />
        </Tabs>
        <TabPanel key={"products-tab"} value={currentTab} index={0}>

          <Accordion>

            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <h1 className="panel-custom-title">{t('customer.showCustomer.addedProducts')}</h1>
            </AccordionSummary>
            <CustomerProductsTable customerProducts={props.customer_products} loading={userLoadingCP}/>
            <br />
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <h1 className="panel-custom-title">{t('customer.showCustomer.addProductButton')}</h1>
            </AccordionSummary>
            <div style={{padding: 10}}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Box component="span" display={displayProducTable} p={0} m={0} bgcolor="background.paper">
                    <Grid container spacing={1} direction="row" justify="flex-start" alignItems="center" className={classes.root}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel className="white-bg padding-sides-5 table-search-label" htmlFor="search">{t('globalText.filterFor')}</InputLabel>
                        <OutlinedInput
                          id="search"
                          type="text"
                          className="table-search-input"
                          value={filterText}
                          onChange={changeFilterText}
                          endAdornment={
                            <InputAdornment className="table-search-end" position="end" >
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClear}
                              >
                                {<Close />}
                              </IconButton>

                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={1} direction="row" justify="flex-end" alignItems="center" className={classes.root}>
                    <Box component="span" display={displayProducTable} p={0} m={0} bgcolor="background.paper">
                      <Button variant="contained" id="add-customer-product" onClick={handleAddProduct} color="primary">
                        {t('customer.showCustomer.addProductButton')}
                      </Button>
                    </Box>
                    <Button variant="outlined" id="additional-product-id" color="primary" onClick={handleChangeAdditionalProduct}>
                      {displayProducText}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Transition in={checkedAdditionalProduct} >
                <Box className="additional-from-box" component="span" p={0} m={0} bgcolor="background.paper">
                  {[...Array(numberProductForms).keys()].map((number) => (
                    <AdditionalProductForm
                      getCustomerProducts={props.getCustomerProducts}
                      customer_id={customer_id}
                      key={"AdditionalProductForm" + number}
                      additional_product_number={number}
                    />
                  ))}
                  <Grid item xs={12}>
                    <Button color="primary" onClick={handleNewProductForm}>
                      <i className="material-icons">add_circle_outline</i>&nbsp;&nbsp;{t('customer.showCustomer.addOtherProductButton')}
                    </Button>
                  </Grid>
                </Box>
              </Transition>

              <Box component="span" display={displayProducTable} p={0} m={0} bgcolor="background.paper">
                <MaterialTable
                  noHeader={true}
                  columns={products_columns}
                  data={props.products}
                  progressPending={userLoading}
                  progressComponent={<CircularProgress size={75} />}
                  pagination
                  paginationServer
                  responsive={true}
                  onChangeRowsPerPage={handleProductsPerRowsChange}
                  onChangePage={handleProductsPageChange}
                  onSelectedRowsChange={handleProductRowChange}
                  paginationTotalRows={props.total}
                  paginationPerPage={5}
                  paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                  highlightOnHover={true}
                  striped={true}
                  selectableRows
                  selectableRowsComponent={Checkbox}
                  selectableRowsComponentProps={{className: "product-checkbox", color: "primary"}}
                  contextMessage={{singular: 'producto', plural: 'productos', message: 'seleccionados'}}
                  noDataComponent={i18next.t('globalText.NoDataComponent')}
                  paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText')}}
                />

              </Box>

            </div>
          </Accordion>
        </TabPanel>


        <TabPanel key={"policy-tab"} value={currentTab} index={1}>
          <h2 className="policy-p">{t('customer.showCustomer.policyHistory')}</h2>

          {policies && policies.map((policy) => {
            const labelId = `accordeon-policy-${policy.id}`;
            return (
              <Accordion expanded={expandedPolicy === labelId} onChange={handlePolicyChange(labelId)} key={labelId} id={labelId}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${labelId}-content`}
                  id={`${labelId}-header`}
                  className="policy-summary" >
                  <Typography className="policy-col"><span className="policy-summary-1">{t('customer.showCustomer.policy')}</span><br /><span className="policy-summary-2">N° {customer_id}-{policy.id}</span></Typography>
                  <Typography className="policy-col"><span className="policy-summary-1">{t('customer.showCustomer.policyValue')}</span><br /><span className="policy-summary-2">{money_format(country, policy.total_price)}</span></Typography>
                  <Typography className="policy-col"><span className="policy-summary-1">{t('customer.showCustomer.paid')}</span><br /><span className="policy-summary-2">{policy.paid ? "Si" : "No"}</span></Typography>
                  <Typography className="policy-col"><span className="policy-summary-1">{t('customer.showCustomer.visitNumber')}</span><br /><span className="policy-summary-2">{policy.visit_count}</span></Typography>
                  <Typography className="policy-col"><span className="policy-summary-1">{t('customer.showCustomer.status')}</span><br /><span className="policy-summary-2">{policy.status}</span></Typography>
                  <Typography className="policy-col"><span className="policy-summary-1">{t('customer.showCustomer.validFrom')}</span><br /><span className="policy-summary-2">{policy.payment_at ? date_format(policy.payment_at) : "-"}</span></Typography>
                  <Typography className="policy-col"><span className="policy-summary-1">{t('customer.showCustomer.validUntil')}</span><br /><span className="policy-summary-2">{policy.valid_until ? date_format(policy.valid_until) : "-"}</span></Typography>
                  <Typography></Typography>
                </AccordionSummary>
                <AccordionDetails className="policy-accordeon-details">
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <ValidatePaymentPolicyDialog key={"payment-customer-policy" + policy.id} customer_id={policy.customer_id} policy_id={policy.id} policy={policy} policies={policies} setPolicies={setPolicies} headers={headers} />

                      <Link className="mdl-navigation__link brand-primary-link customers-edit-policy-link" to={`/customers/${customer_id}/policies/${policy.id}/edit_policy`}>
                        <i className="material-icons">edit</i> {t('globalText.edit')}
                      </Link>
                      <DeletePolicyDialog key={"delete-customer-policy" + policy.id} customer_id={policy.customer_id} policy_id={policy.id} headers={headers} />
                    </Grid>
                    <Grid item xs={12}>
                      <MaterialTable
                        noHeader={true}
                        columns={policy_customer_product_columns}
                        data={policy.policy_customer_products}
                        progressPending={userLoadingCP}
                        progressComponent={<CircularProgress size={75} />}
                        responsive={true}
                        highlightOnHover={true}
                        striped={true}
                        contextMessage={{singular: 'producto', plural: 'productos', message: 'seleccionados'}}
                        noDataComponent={i18next.t('globalText.NoDataComponent')}
                        paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
          {policies.length < 1 &&
            <Typography><span className="policy-summary-1">{t('customer.showCustomer.noPolicyAssociated')}</span></Typography>
          }
        </TabPanel>

      </Paper>

      <br />
      <Paper className="custom-paper">
        <Tabs value={currentServiceTab} onChange={handleTabServiceChange} aria-label="simple tabs example"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className="tech-taxon-tabs"
        >
          <Tab key={"services-tab"} label={t('customer.showCustomer.services')} {...a11yProps(0)} />
          <Tab key={"quotation-tab"} label={t('customer.showCustomer.shopping')} {...a11yProps(2)} />
          <Tab key={"complaints-tab"} label={t('customer.showCustomer.complaints')} {...a11yProps(1)} />
        </Tabs>
        <TabPanel key={"services-tab"} value={currentServiceTab} index={0}>
          <h1 className="panel-custom-title">{t('customer.showCustomer.serviceHistory')}</h1>
          <MaterialTable
            noHeader={true}
            columns={service_columns}
            data={props.services}
            progressPending={userLoadingServices}
            progressComponent={<CircularProgress size={75} />}
            pagination
            paginationServer
            responsive={true}
            onChangeRowsPerPage={handleServicesPerRowsChange}
            onChangePage={handleServicesPageChange}
            paginationTotalRows={props.services_total}
            highlightOnHover={true}
            striped={true}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            noDataComponent={i18next.t('globalText.NoDataComponent')}
            paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
          />

        </TabPanel>
        <TabPanel key={"quotation-tab"} value={currentServiceTab} index={1}>
          <h1 className="panel-custom-title">{t('customer.showCustomer.shoppingHistory')}</h1>
          <CustomerQuotations
            services={props.services}
            customer_products={props.customer_products}
            quotations={quotations}
            customer_id={customer_id}
            country={country}
            userLoadingServices={userLoadingServices}
            handleServicesPerRowsChange={handleServicesPerRowsChange}
            handleServicesPageChange={handleServicesPageChange}
            services_total={props.services_total}
          />
        </TabPanel>
        <TabPanel key={"complaints-tab"} value={currentServiceTab} index={2}>
          <h1 className="panel-custom-title">{t('customer.showCustomer.complaintsHistory')}</h1>
          <CustomerComplaints
            services={props.services}
            customer_id={customer_id}
            country={country}
            userLoadingServices={userLoadingServices}
            handleServicesPerRowsChange={handleServicesPerRowsChange}
            handleServicesPageChange={handleServicesPageChange}
            services_total={props.services_total}
          />
        </TabPanel>


      </Paper>

      <br />

    </React.Fragment>
  );
}


const structuredSelector = createStructuredSelector({
  products: state => state.products,
  customer_products: state => state.customer_products,
  page: state => state.page,
  perPage: state => state.perPage,
  total: state => state.total,
  services_page: state => state.services_page,
  services_per_page: state => state.services_per_page,
  services_total: state => state.services_total,
  services: state => state.services,
  current_user: state => state.current_user,
});
const mapDispatchToProps = {getProducts, getCustomerProducts, getServices};
export default connect(structuredSelector, mapDispatchToProps)(ShowCustomer)
