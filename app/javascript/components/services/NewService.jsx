import React, { useState, useEffect } from 'react'
import * as CostCenterApi from 'api/cost_center'
import WarnIconValidate from 'components/services/common/WarnIconValidate'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { flash_alert } from 'components/App'
import CustomerDetails from 'components/customers/CustomerDetails'
import NewScheduleDialog from 'components/services/NewScheduleDialog'
import PaymentEmailDialog from 'components/services/PaymentEmailDialog'
import ServiceInfoForm from 'components/services/forms/ServiceInfoForm'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { country_names_g } from 'components/customers/CustomerForm'
import { headers, money_format, date_event_format, date_format_without_time_and_zone, date_difference_in_hours, site_url, noPaymentsOptions } from 'constants/csrf'
import pluralize from 'pluralize'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import ShowCustomer from 'components/customers/ShowCustomer'
import { createStyles, makeStyles } from '@material-ui/core/styles'
// Button loading
import CircularProgress from '@material-ui/core/CircularProgress'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
// Toggle buttons
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
// Dates
import DateFnsUtils from '@date-io/date-fns'
import esLocale from 'date-fns/locale/es'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'

// Payment Methods
import PaymentMethods from 'components/payments/PaymentMethods'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { CURRENCY_SYMBOLS, DECIMAL_PLACES } from 'constants/currency'
import { serviceTypeLabels, serviceTypeSubcategories, requestedLabels } from 'constants/services'

// const channels = ['Teléfono', 'App Clientes', 'Web', 'Redes sociales', 'Correo', 'Partners B2B', 'eCommerce']

const product_columns = [
  {
    name: i18next.t('globalTables.customerProductColumns.family'),
    selector: 'product.taxons',
    hide: 'md',
    cell: row => (
      <span>
        {(row.product.taxons[0] == null ? '-' : row.product.taxons[0].name)}
      </span>
    )
  },
  {
    name: i18next.t('globalTables.customerProductColumns.subFamily'),
    selector: 'product.taxons',
    hide: 'md',
    cell: row => (
      <span>
        {(row.product.taxons[1] == null ? '-' : row.product.taxons[1].name)}
      </span>
    )
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
        {(row.product.tnr == '' ? '-' : row.product.tnr)}
      </span>
    )
  },
  {
    name: i18next.t('globalTables.customerProductColumns.name'),
    selector: 'product.name',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(row.product.name == '' ? '-' : row.product.name)}
      </span>
    )
  },
  {
    name: i18next.t('globalTables.customerProductColumns.instalationDate'),
    selector: 'instalation_date',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(row.reinstalation_date == null ? (row.instalation_date == null ? 'No' : date_format_without_time_and_zone(row.instalation_date)) : date_format_without_time_and_zone(row.reinstalation_date) + ' reinstalado')}
      </span>
    )
  },
  {
    name: i18next.t('globalTables.customerProductColumns.discontinuedRow.discontinued'),
    selector: 'discontinued',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {(row.discontinued ? 'Si' : 'No')}
      </span>
    )
  },
  {
    name: i18next.t('globalTables.customerProductColumns.warrantyRow.warranty'),
    selector: 'warranty',
    sortable: true,
    hide: 'md',
    cell: row => (
      <span>
        {((row.warranty == null ? 'No' : 'Válida ' + date_format_without_time_and_zone(row.warranty)))}
      </span>
    )
  },
  {
    name: i18next.t('globalTables.customerProductColumns.policy'),
    selector: 'policy',
    sortable: true,
    hide: 'md'
  },
  {
    name: i18next.t('globalTables.customerProductColumns.status'),
    selector: 'status',
    sortable: true,
    hide: 'md'
  }
]

const consumable_columns = [
  {
    name: i18next.t('globalTables.consumableColumns.tnr'),
    selector: 'consumable.product.tnr',
    sortable: true
  },
  {
    name: i18next.t('globalTables.consumableColumns.name'),
    selector: 'consumable.name',
    sortable: true,
    hide: 'sm'
  },
  {
    name: i18next.t('globalTables.consumableColumns.requiredQuantity'),
    selector: 'total_boxes_without_events',
    sortable: true
  }
]

function NewService (props) {
  const { t } = useTranslation()

  const useStyles = makeStyles(theme => createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative'
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
    }
  }))

  const classes = useStyles()

  const [costCenters, setCostCenters] = useState([])
  const [selectedCostCenterId, setSelectedCostCenterId] = useState(0)

  // Customer Info
  const [customerNames, setCustomerFirstname] = useState('')
  const [customerLastname, setCustomerLastname] = useState('')
  const [customerSurname, setCustomerSurname] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  // Customer
  const [customer_id, setCustomerId] = useState('')
  // Ship Address
  const [zipcode, setZipcode] = useState('')
  const [state, setState] = useState('')
  const [delegation, setDelegation] = useState('')
  const [colony, setColony] = useState('')
  const [street_type, setStreettype] = useState('')
  const [street_name, setStreetName] = useState('')
  const [ext_number, setExtNumber] = useState('')
  const [int_number, setIntNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [reference, setReference] = useState('')
  const [selectedPerson, setSelectedPerson] = useState('')
  const [country, setCountry] = useState('MX')
  const [canShowCurrencyField, setCanShowCurrencyField] = useState(false)
  const [countryIVA, setCountryIVA] = useState(0.16)

  const [rut, setRut] = useState('')
  const [administrative_demarcation, setAdministrativeDemarcation] = useState({})
  // Bill Address
  const [zipcode_fn, setZipcodeFn] = useState('')
  const [state_fn, setStateFn] = useState('')
  const [delegation_fn, setDelegationFn] = useState('')
  const [colony_fn, setColonyFn] = useState('')
  const [street_type_fn, setStreettypeFn] = useState('')
  const [street_name_fn, setStreetNameFn] = useState('')
  const [ext_number_fn, setExtNumberFn] = useState('')
  const [int_number_fn, setIntNumberFn] = useState('')
  const [phone_fn, setPhoneFn] = useState('')
  const [administrative_demarcation_fn, setAdministrativeDemarcationFn] = useState({})
  // ADDITIONALS ADDRESS
  const [additionalsAddresses, setAdditionalsAddresses] = useState([])
  // CHECKS
  const [personCheck, setPersonCheck] = useState('')
  const [RUTCheck, setRUTCheck] = useState('hidden')
  const [zipcodeCheck, setZipcodeCheck] = useState('')
  const [delegationCheck, setDelegationCheck] = useState('')
  const [stateLabel, setStateLabel] = useState('Estado')
  const [colonyCheck, setColonyCheck] = useState('')
  const [extNumberLabel, setExtNumberLabel] = useState('Número Exterior')
  const [intNumberLabel, setIntNumberLabel] = useState('Número Interior')
  const [country_change, setCountryChange] = useState(false)
  // Additional Info
  const [redirect, setRedirect] = useState(false)
  const [firstLoad, setFirstLoad] = useState(false)
  const [loading, setLoading] = React.useState(false)
  // Service info
  const [serviceID, setServiceID] = useState('')
  const [service_type, setServiceType] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [requested, setRequested] = useState('')
  const [requestChannel, setRequestChannel] = useState('')
  const [subcategoryOptions, setSubcategoryOptions] = useState([])
  // const [servicePriceData, setServicePriceData] = useState([]);
  const [serviceStatus, setServiceStatus] = useState('new')
  const [serviceFiles, setServiceFiles] = useState([])
  const [serviceUpdated, setServiceUpdated] = useState(false)
  const [event, setEvent] = useState({ start: '', end: '' })
  const [technicians, setTechnicians] = useState([])
  const [policies, setPolicies] = useState([])
  const [currentPolicy, setCurrentPolicy] = useState('')
  const [selectedPolicies, setSelectedPoliciesRows] = useState('')
  const [technicians_ids, setTechniciansIds] = useState('')
  const [techinicianNumber, setTechinicianNumber] = useState(1)
  const [hourAmout, setHourAmout] = useState(0)
  const [viaticAmout, setViaticAmout] = useState(0)
  const [feeAmount, setFeeAmount] = useState(0)
  const [oldFeeAmount, setOldFeeAmount] = useState(null)
  const [oldViaticAmount, setOldViaticAmount] = useState(null)
  const [oldLaborAmount, setOldLaborAmount] = useState(null)
  const [feeAmountIncrement, setFeeAmountIncrement] = useState(0)
  const [consumableAmount, setConsumableAmount] = useState(0)
  const [laborAmount, setLaborAmount] = useState(0)
  const [totalhours, setTotalhours] = useState('')
  const [ivaAmount, setIVAAmount] = useState(0)
  const [subtotalAmount, setSubtotalAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [noPaymentCheck, setNoPaymentCheck] = useState(false)
  const [noPaymentOption, setNoPaymentOption] = useState('')
  const [selectedPaymentDate, setSelectedPaymentDate] = React.useState(new Date())
  const [paymentData, setPaymentData] = useState([])
  const [paymentLink, setPaymentLink] = useState('')
  const [paymentLinkBoolean, setPaymentLinkBoolean] = useState(false)
  const [from, setFrom] = useState('app_web')

  // Distributor
  const [distributorName, setDistributorName] = useState('')
  const [distributorEmail, setDistributorEmail] = useState('')
  const [distributorCheck, setDistributorCheck] = useState('hidden')

  // Products
  const [products, setProducts] = useState([])
  const [selectedProductRows, setSelectedProductRows] = useState([])
  const [background, setBackground] = useState('')
  const [files, setFiles] = useState([])
  // Comsumable
  const [consumables, setConsumables] = useState([])
  const [selectedConsumablesRows, setSelectedConsumablesRows] = useState([])

  // Form validation
  const [service_typeErrorMessage, setServiceTypeErrorMessage] = useState('')
  const [subcategoryErrorMessage, setSubcategoryErrorMessage] = useState('')
  const [requestedErrorMessage, setRequestedErrorMessage] = useState('')
  const [requestChannelErrorMessage, setRequestChannelErrorMessage] = useState('')
  const [backgroundErrorMessage, setBackgroundErrorMessage] = useState('')
  const [eventErrorMessage, setEventErrorMessage] = useState('')
  const [noPaymenErrorMessage, setNoPaymenErrorMessage] = useState('')
  const [selectedPaymentDateErrorMessage, setSelectedPaymentDateErrorMessage] = useState('')
  // Dirección checks
  const [checked, setChecked] = React.useState('principal')
  const handleToggle = (value, zipcode_t = null, administrative_demarcation_t = null) => () => {
    if (value == 'principal') {
      fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation?.admin_name_3, true)
    } else {
      fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode_t, administrative_demarcation_t?.admin_name_3, true)
    }

    setChecked(value)
  }
  const [checkedFN, setCheckedFN] = React.useState('principal')
  const handleToggleFN = (value) => () => {
    setCheckedFN(value)
  }

  // Toggle butons
  const [paymentChannel, setPaymentChannel] = React.useState('online')
  const [invoiceCheck, setInvoiceCheck] = React.useState('no')

  // Change total Dialog
  const [openTotalDialog, setOpenTotalDialog] = React.useState(false)

  /// ////////////////////////////////////////////////////////////////////
  // PaymentDialog
  const [paymentEmailAdditional, setPaymentEmailAdditional] = useState('')
  const [isPaymentEmail, setIsPaymentEmail] = useState(false)
  const [paymentEmailDialog, setPaymentEmailDialog] = React.useState(false)

  const [toggledClearProductsRows, setoggledClearProductsRows] = useState(true)
  const [productTableDisabled, setProductTableDisabled] = useState(false)

  const handleClickOpenTotalDialog = () => {
    setOpenTotalDialog(true)
  }

  const handleCloseTotalDialog = () => {
    setOpenTotalDialog(false)
  }

  const handleFeeChange = (event) => {
    setFeeAmount(Number(event.target.value.split(',').join('')))
  }

  /// ////////////////////////////////////////////////////////////////////
  // Efects
  /// ///////////////////////////////////////////////////////////////////
  useEffect(() => {
    //console.log({'requested': requestedLabels('pt')})
    fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation?.admin_name_3, true, false, null, true)
  }, [feeAmount, laborAmount, viaticAmout, service_type])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    async function fetchData () {
      const costCentersFetch = await CostCenterApi.getAllCostCenters()
      setCostCenters(costCentersFetch.data)

      const userId = props.match.params.id
      return fetch(`/api/v1/customers/${userId}`)
        .then(response => response.json())
        .then(json => {
          console.log(json)

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
          setSelectedCostCenterId(json.data.cost_center_id)
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
            setCanShowCurrencyField(true)
          }
          setAdministrativeDemarcation(json.data.administrative_demarcation)
          setAdministrativeDemarcationFn(json.data.administrative_demarcation_fn)
          setRut(json.data.rut)
          if (json.data.additional_addresses != null) {
            setAdditionalsAddresses(json.data.additional_addresses)
          }
          // HANDLRE COUNTRY INFO
          handleCountryInputs(json.data.country.iso)

          // Handle service data
          setTotalAmount(json.data.last_service.total_amount)
          setSubtotalAmount(json.data.last_service.subtotal_amount)

          setFirstLoad(true)

          if (json.data.last_service.service_type) {
            setServiceUpdated(true)
            setServiceType(json.data.last_service.service_type)
            handleServiceTypeChange(json.data.last_service.service_type)
          }
          if (json.data.last_service.subcategory) {
            setSubcategory(json.data.last_service.subcategory)
          }

          setServiceID(json.data.last_service.id)
          fetchServicePayments(json.data.last_service.id, 'Servicio')
          setRequested(json.data.last_service.requested)
          setRequestChannel(json.data.last_service.request_channel)
          setTechinicianNumber(json.data.last_service.technicians_number)
          setHourAmout(json.data.last_service.hour_amount)
          setFeeAmount(json.data.last_service.fee_amount)
          setTotalhours(json.data.last_service.total_hours)
          setDistributorName(json.data.last_service.distributor_name)
          setDistributorEmail(json.data.last_service.distributor_email)
          setServiceStatus(json.data.last_service.status)
          if (json.data.last_service.requested) {
            setDistributorCheck(json.data.last_service.requested != 'Cliente directo' ? '' : 'hidden')
          }
          setSelectedProductRows(json.data.last_service.customer_products)
          setBackground(json.data.last_service.background)
          setNoPaymentCheck(json.data.last_service.no_payment)
          setPaymentChannel(json.data.last_service.payment_channel)
          setSelectedPaymentDate(json.data.last_service.payment_date)
          setNoPaymentOption(json.data.last_service.no_payment_reason)
          setInvoiceCheck(json.data.last_service.invoice ? 'si' : 'no')
          if (params.has('products')) {
            const test = params.get('products').split(',')
            test.pop()
            const aux = []
            for (const i in json.data.customer_products) {
              if (test.includes(json.data.customer_products[i].id.toString())) {
                aux.push(json.data.customer_products[i])
              }
            }
            setProducts(aux)
          } else {
            setProducts(json.data.customer_products)
          }
          setServiceFiles(json.data.last_service.file_resources)

          // Polizas
          console.log('Me traigo las polizas')
          setPolicies(json.data.policies)
          if (json.data.last_service && json.data.last_service.policy_id) {
            setSelectedPoliciesRows(json.data.last_service.policy_id)
            setCurrentPolicy(json.data.policies[0])
          } else {
            if (json.data.policies[0]) {
              setSelectedPoliciesRows(json.data.policies[0].id)
              setCurrentPolicy(json.data.policies[0])
            }
          }
          if (json.data.last_service.calendar_events.length > 0) {
            setTechnicians(json.data.last_service.technicians)
            setEvent({ start: json.data.last_service.calendar_events[0].start_date, end: json.data.last_service.calendar_events[0].finish_date })
          }
          if (json.data.last_service.service_products) {
            setSelectedConsumablesRows(json.data.last_service.service_products.map(function (consumable_row) {
              return ({ amount: consumable_row.amount, total_boxes: consumable_row.quantity, product_id: consumable_row.product_id })
            }))
          }
        })
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedProductRows) {
      fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation?.admin_name_3, true)
    }
    fetchPolicyTotal(currentPolicy)
  }, [service_type, selectedConsumablesRows])

  useEffect(() => {
    if (!serviceUpdated && service_type == 'Mantenimiento') {
      setConsumableAmount(consumables.map(item => item.sub_total_consumable_amount_without_events).reduce((prev, curr) => prev + curr, 0))
      setSelectedConsumablesRows(consumables.map(function (consumable_row) {
        return ({ amount: consumable_row.sub_total_consumable_amount_without_events, total_boxes: consumable_row.total_boxes_without_events, product_id: consumable_row.consumable.product_id })
      }))
    } else {
      setConsumableAmount(0)
    }
  }, [consumables])

  useEffect(() => {
    setPaymentLink(`${site_url(process.env.RAILS_ENV)}/payments?object_id=${serviceID}&object_class=Servicio&customer_id=${customer_id}&amount=${totalAmount}`)
  }, [serviceID, totalAmount])

  useEffect(() => {
    if (isPaymentEmail) {
      setPaymentEmailDialog(false)
      if (!loading) {
        setLoading(true)
      }
      saveService()
    }
  }, [isPaymentEmail])

  useEffect(() => {
    if (event.start != '') {
      setServiceStatus('prescheduled')
      fetchServiceTotal(country, selectedProductRows.map((product) => product.id), zipcode, administrative_demarcation.admin_name_3, true, null, event)
    }
  }, [event])

  useEffect(() => {
    fetchPolicyTotal(currentPolicy)
  }, [currentPolicy])

  /// ///////////////////////////////////////////////////////////////
  /// Functions
  function fetchPolicyTotal (policy_new) {
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

  function fetchServiceTotal (country_code, products_ids, zipcode_t, administrative_demarcation_name_t, from_consumables = false, from_policy = false, event_local = null, withAmountParams = false) {
    console.log('Calculo el total')
    console.log(event_local)
    if (event_local) {
      var time_diff = date_difference_in_hours(event.start, event.end)
      console.log(time_diff)
    }

    if (products_ids.length > 0) {
      const amountParams = {
        viatic_value: viaticAmout,
        fee_amount: feeAmount,
        labor_price: laborAmount
      }
      let params = {
        country: country_code,
        products_ids: products_ids.join(','),
        service_type,
        subcategory,
        zipcode: zipcode_t || '',
        administrative_demarcation_name: administrative_demarcation_name_t || administrative_demarcation.admin_name_1
      }

      if (withAmountParams) {
        params = { ...params, ...amountParams }
      }

      if (event_local) {
        params.time_diff = time_diff
      }

      return axios.get(`/api/v1/services/${serviceID}/total_price`, { params })
        .then(({ data: json }) => {
          if (json.data) {
            setTechinicianNumber(json.data.total_technicians)
            setTotalhours(json.data.total_hours)

            console.log(json.data)
            if (!from_policy) {
              if (viaticAmout != json.data.viatic_value) {
                setViaticAmout(json.data.viatic_value)
              }

              if (feeAmount != json.data.fee_amount) {
                setFeeAmount(json.data.fee_amount)
              }

              if (laborAmount != json.data.labor_price) {
                setLaborAmount(json.data.labor_price)
              }

              setHourAmout(json.data.hour_amount)

              if (oldFeeAmount === null) {
                setOldFeeAmount(json.data.fee_amount)
              }

              if (oldViaticAmount === null) {
                setOldViaticAmount(viaticAmout)
              }

              if (oldLaborAmount === null) {
                setOldLaborAmount(json.data.labor_price)
              }

              if (service_type == 'Home Program' || (service_type == 'Reparación' && subcategory == 'Profesional')) {
                setFeeAmountIncrement(json.data.fee_amount_increment)
                if (time_diff && time_diff > 0) {
                  setTotalhours(time_diff)
                }
              }
            }
            if (!firstLoad) {
              if (service_type == 'Póliza de Mantenimiento') {
                // setSubtotalAmount(json.data.total_amount + consumableAmount)
                // setIVAAmount((json.data.total_amount + consumableAmount) * json.data.iva )
                // setTotalAmount((json.data.total_amount + consumableAmount) * (1+ json.data.iva))
              } else {
                if (consumableAmount > 0) {
                  setSubtotalAmount((json.data.subtotal_amount + consumableAmount))
                  setIVAAmount((json.data.subtotal_amount + consumableAmount) * countryIVA)
                  setTotalAmount((json.data.subtotal_amount + consumableAmount) * (countryIVA + 1))
                } else {
                  setIVAAmount(json.data.iva_amount)
                  setSubtotalAmount(json.data.subtotal_amount + consumableAmount)
                  setTotalAmount(json.data.total_amount + consumableAmount)
                }
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
            console.log('No hay precio.')
          }
        })
        .catch(error => console.log(error))
    }
  }

  function fetchServicePayments (object_id, object_class) {
    return fetch(`/api/v1/payments?object_id=${object_id}&object_class=${object_class}`)
      .then(response => response.json())
      .then(json => {
        if (json.data) {
          if (json.data.length > 0 && json.data[0].status == 'completed') {
            setServiceStatus('paid')
          }
          setPaymentData(json.data)
        } else {
          console.log('No hay precio.')
        }
      })
      .catch(error => console.log(error))
  }

  function validateForm () {
    const messages = []

    if (selectedProductRows.length == 0) {
      messages.push(t('customer.newService.flashAlert.selectedProductRows'))
    }
    if (service_type == '' || service_type == null) {
      messages.push('Debe seleccionar el tipo de servicio a solicitar')
      setServiceTypeErrorMessage(t('customer.newService.flashAlert.serviceType'))
    }
    if (subcategory == '' || subcategory == null) {
      messages.push('Debe seleccionar la subcategoria de servicio a solicitar')
      setSubcategoryErrorMessage(t('customer.newService.flashAlert.subCategory'))
    }
    if (requested == '' || requested == null) {
      messages.push('Debe indicar como fue solicitado el servicio')
      setRequestedErrorMessage(t('customer.newService.flashAlert.requested'))
    }
    if (requestChannel == '' || requestChannel == null) {
      messages.push('Debe indicar el canal de la solicitud')
      setRequestChannelErrorMessage(t('customer.newService.flashAlert.requestChannel'))
    }

    if ((background == '' || background == null) && service_type != 'Póliza de Mantenimiento') {
      messages.push(t('customer.newService.flashAlert.indicateProblem'))
      setBackgroundErrorMessage('Debe indicar antecedentes del problema')
    }

    if (event.start == '' || event.start == null) {
      messages.push(t('customer.newService.flashAlert.startDate'))
      setEventErrorMessage('Debe seleccionar una fecha')
    }

    if (noPaymentCheck) {
      if (noPaymentOption == '' || noPaymentOption == null) {
        messages.push(t('customer.newService.flashAlert.noPaymentOption'))
        setNoPaymenErrorMessage('Debe seleccionar una opcción de no pago')
      }
    } else {
      if (selectedPaymentDate == '' || selectedPaymentDate == null) {
        messages.push(t('customer.newService.flashAlert.selectedPaymentDate'))
        setSelectedPaymentDateErrorMessage('Debe seleccionar fecha limite de pago')
      }
    }

    if (service_type == 'Póliza de Mantenimiento' && selectedPolicies == '') {
      messages.push(t('customer.newService.flashAlert.selectedPolicies'))
    }

    messages.forEach(element => {
      flash_alert(t('customer.newService.flashAlert.attention'), element, 'warning')
    })

    if (messages.length > 0) {
      return false
    } else {
      return true
    }
  }

  function saveService (redirect_param = true) {
    const body = new FormData()
    body.set('service_id', serviceID)
    body.set('cost_center_id', selectedCostCenterId)
    body.set('customer_id', customer_id)
    body.set('address', checked)
    body.set('address_fn', checkedFN)
    body.set('service_type', service_type)
    body.set('subcategory', subcategory)
    body.set('requested', requested)
    body.set('request_channel', requestChannel)
    body.set('distributor_name', distributorName)
    body.set('distributor_email', distributorEmail)
    body.set('customer_products_id', selectedProductRows.map(function (product_row) {
      return (product_row.id)
    }))

    // Service Totals
    body.set('technicians_number', techinicianNumber)
    body.set('hour_amount', hourAmout)
    body.set('fee_amount', feeAmount)
    body.set('labor_amount', laborAmount)
    body.set('viatic_amount', viaticAmout)
    body.set('subtotal_amount', subtotalAmount)
    body.set('iva_amount', ivaAmount)
    body.set('total_hours', totalhours)
    body.set('total_amount', totalAmount)

    body.set('background', background)
    body.set('no_payment', noPaymentCheck)

    body.set('payment_channel', paymentChannel)
    body.set('payment_date', selectedPaymentDate)
    body.set('no_payment_reason', noPaymentOption)
    body.set('invoice', (invoiceCheck === 'si'))
    body.set('status', serviceStatus)
    body.set('event_start', event.start)
    body.set('event_end', event.end)
    body.set('technicians_ids', technicians_ids)
    body.set('payment_state', ((paymentData.length > 0 && paymentData[0].status == 'completed') ? 'paid' : 'pending'))
    body.set('customerEmail', customerEmail)
    body.set('paymentEmailAdditional', paymentEmailAdditional)
    body.set('isPaymentEmail', isPaymentEmail)
    body.set('from', from)

    if (service_type == 'Póliza de Mantenimiento') {
      body.set('policy_id', selectedPolicies)
    }

    files.forEach((file) => {
      body.append('images[]', JSON.stringify(file))
    })

    if (consumables) {
      body.append('consumables[]', '{}')
    }

    selectedConsumablesRows.forEach((consumable) => {
      body.append('consumables[]', JSON.stringify(consumable))
    })

    return axios.post(`/api/v1/customers/${customer_id}/create_service`, body, { headers })
      .then(response => {
        if (redirect_param) {
          flash_alert(t('customer.newService.flashAlert.success'), t('customer.newService.flashAlert.updateSuccess'), 'success')
        }
        setRedirect(redirect_param)
      })
      .catch(e => {
        if (e.response.data) {
          for (const key in e.response.data) {
            flash_alert('Error', e.response.data[key], 'danger')
          }
        }
      })
  }

  /// ///////////////////////////////////////////////////////////////
  /// Handles

  const handlepaymentChannel = (event, newpaymentChannel) => {
    setPaymentChannel(newpaymentChannel)
  }
  const handleInvoiceCheckChange = (event) => {
    setInvoiceCheck(event.target.value)
  }

  const handlePaymentDateChange = (date) => {
    setSelectedPaymentDate(date)
  }

  function handleCountryInputs (country_iso) {
    if (country_iso == 'CL') {
      setPersonCheck('hidden')
      setZipcodeCheck('hidden')
      setDelegationCheck('hidden')
      setColonyCheck('hidden')
      setStateLabel('Comuna/Región')
      setExtNumberLabel('Número')
      setIntNumberLabel('Depto')
      setRUTCheck('')
    } else {
      setPersonCheck('')
      setRUTCheck('hidden')
      setZipcodeCheck('')
      setDelegationCheck('')
      setColonyCheck('')
      setStateLabel('Estado')
      setExtNumberLabel('Número Exterior')
      setIntNumberLabel('Número Interior')
    }
  }

  function handleSubmit (event) {
    event.preventDefault()
    if (!validateForm()) {
      setLoading(false)
      return false
    }
    if (paymentChannel == 'online' || paymentChannel == 'transfer') {
      setPaymentEmailDialog(true)
    } else {
      if (!loading) {
        setLoading(true)
      }
      saveService()
    }
  }

  function handleServiceTypeChange (e) {
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

  function handleRequestedChange (e) {
    setRequested(e.target.value)
    const requestedDistributor = requestedLabels(i18next.language).find(requested => requested.key === 'Distribuidor autorizado')?.key || null
    if (e.target.value === requestedDistributor) {
      setDistributorCheck('')
    } else {
      setDistributorCheck('hidden')
    }
  }

  async function onServiceChangeFiles (e) {
    if (e.length > 0) {
      const dT = []
      e.forEach(async function (item) {
        await getBase64(item)
          .then((encFile) => {
            dT.push(encFile)
            setFiles(dT)
          }).catch(error => console.log('error'))
      })
    }
  };

  function handleProductRowChange (state) {
    // setoggledClearProductsRows
    setoggledClearProductsRows(true)
    setSelectedProductRows(state.selectedRows)
    fetchServiceTotal(country, state.selectedRows.map((product) => product.id), zipcode, administrative_demarcation?.admin_name_3)
    if (service_type == 'Reparaciones en Taller' && state.selectedRows.length > 0) {
      setProductTableDisabled(true)
    }
  }

  function handleProductDisabledSelected () {
    if (service_type == 'Reparaciones en Taller' && productTableDisabled && selectedProductRows.length > 0) {
      setoggledClearProductsRows(false)
      setProductTableDisabled(false)
    }
  }

  function handlePolicyRowChange (policy) {
    setCurrentPolicy(policy)
    setSelectedPoliciesRows(policy.id)
  }

  function handleConsumableRowChange (state) {
    if (service_type == 'Mantenimiento') {
      setConsumableAmount(state.selectedRows.map(item => item.sub_total_consumable_amount_without_events).reduce((prev, curr) => prev + curr, 0))
    } else {
      setConsumableAmount(0)
    }
    setSelectedConsumablesRows(state.selectedRows.map(function (consumable_row) {
      return ({ amount: consumable_row.sub_total_consumable_amount_without_events, total_boxes: consumable_row.total_boxes_without_events, product_id: consumable_row.consumable.product_id })
    }))
  }

  function consumableSelectableRowCriteria (row) {
    if (selectedConsumablesRows.length > 0) {
      return selectedConsumablesRows.find(product => product.product_id === row.consumable.product_id) != undefined
    } else {
      return true
    }
  }

  function handleMessage (message, type) {
    if (type == 'error') {
      flash_alert('', t('customer.newService.flashAlert.noFileFormat'), 'error')
    }
  }

  function getBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve({
        uri_64: reader.result,
        name: file.name,
        mime: file.type
      })
      reader.onerror = error => reject(error)
    })
  }

  /// ///////////////////////////////////////////////////////////////

  const redirect_check = []
  if (redirect) {
    redirect_check.push(
      <Redirect key='redirect-to-customers' to={`/customers/${customer_id}/show`}><ShowCustomer setLoading={props.setLoading} headers={props.headers} match={props.match} /></Redirect>
    )
  }

  return (
    <>
      {redirect_check}

      <Paper className='custom-paper'>
        <Grid container spacing={3}>
          <Link className='mdl-navigation__link  back-link back-link' to={`/customers/${customer_id}/show`}>
            <i className='material-icons'>keyboard_arrow_left</i> {t('globalText.back')}
          </Link>
          <Grid item xs={12}>
            <h1>{t('customer.newService.serviceTo')} {customerNames} {customerLastname} {customerSurname}</h1>
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
        classes={classes}
        service_typeErrorMessage={service_typeErrorMessage}
        service_type={service_type}
        handleServiceTypeChange={handleServiceTypeChange}
        subcategoryErrorMessage={subcategoryErrorMessage}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        subcategoryOptions={subcategoryOptions}
        requestedErrorMessage={requestedErrorMessage}
        requested={requested}
        handleRequestedChange={handleRequestedChange}
        requestedBy={requestedLabels(i18next.language)}
        requestChannelErrorMessage={requestChannelErrorMessage}
        requestChannel={requestChannel}
        setRequestChannel={setRequestChannel}
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
        handleProductDisabledSelected={handleProductDisabledSelected}
      />

      <br />

      <Paper className='custom-paper'>
        <h1 className='panel-custom-title'>{t('customer.newService.direcction')}</h1>

        <List>

          <ListItem key='principal' role={undefined} dense button onClick={handleToggle('principal')}>
            <ListItemIcon className='service-address-label'>
              <FormControlLabel
                value='principal' control={<Radio color='primary' />} label='' checked={checked == 'principal'}
                tabIndex={-1}
              />

            </ListItemIcon>
            <ListItemText
              id='radio-address-list-label-principal'
              primary='Principal'
              secondary={`${street_type} ${street_name}, ${ext_number} ${int_number}, ${administrative_demarcation != null ? administrative_demarcation.admin3_admin1 : state}${zipcode != '' ? (', Código Postal: ' + zipcode) : ''}`}
            />
            <ListItemSecondaryAction />
          </ListItem>
          {additionalsAddresses.map((additional_address) => {
            const labelId = `radio-address-list-label-${additional_address.id}`
            return (
              <ListItem key={additional_address.id} role={undefined} dense button onClick={handleToggle(additional_address.id, additional_address.zipcode, additional_address.administrative_demarcation)}>
                <ListItemIcon className='service-address-label'>
                  <FormControlLabel
                    value={additional_address.id} control={<Radio color='primary' />} label='' checked={checked == additional_address.id}
                    tabIndex={-1}
                  />

                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={additional_address.name}
                  secondary={`${additional_address.street_type} ${additional_address.street_name}, ${additional_address.ext_number} ${additional_address.int_number}, ${additional_address.administrative_demarcation != null ? additional_address.administrative_demarcation.admin3_admin1 : additional_address.state}${additional_address.zipcode != '' ? (', Código Postal: ' + additional_address.zipcode) : ''}`}
                />
                <ListItemSecondaryAction />
              </ListItem>
            )
          })}
        </List>
      </Paper>

      <br />

      <Paper className='custom-paper'>
        <h1 className='panel-custom-title'>{t('customer.newService.diary.title')}</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <p className='service-subtitle'>{t('customer.newService.diary.subTitle')}</p>
            {(country_change) &&
              <NewScheduleDialog
                schedule_type='service'
                btn_classname=''
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
              />}
            <FormHelperText className='brand-error-message'>{eventErrorMessage}</FormHelperText>
          </Grid>
          <Grid item xs={12} sm={6}>
            {event.start != '' &&
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <p className='service-subtitle'>{t('customer.newService.diary.selectedDate')}</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className='service-price-table-label'>{t('customer.newService.diary.dayAndHour')}</span>
                  <span className='service-scheddule-value'>{date_event_format(event.start, event.end)}</span>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className='service-price-table-label'>{t('customer.newService.diary.duration')}</span>
                  <span className='service-scheddule-value'>{date_difference_in_hours(event.start, event.end)} {pluralize('hora', date_difference_in_hours(event.start, event.end))}</span>
                </Grid>
                <Grid item xs={12}>
                  <span className='service-price-table-label'>{t('customer.newService.diary.technicians')}</span>
                  <span className='service-scheddule-value'>
                    {technicians && technicians.map((technician, index) => (
                      <span>
                        {technician.user && ((technician.enterprise != '' && technician.enterprise != null) ? technician.user.fullname + ' (' + technician.enterprise + ')' : technician.user.fullname)}{index != technicians.length - 1 ? ',' : ''}&nbsp;
                      </span>
                    ))}
                  </span>
                </Grid>

              </Grid>}
          </Grid>
        </Grid>
      </Paper>

      <br />

      <Paper className='custom-paper'>
        <h1 className='panel-custom-title'>{t('customer.newService.paymentService.title')}</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p className='service-subtitle'>{t('customer.newService.paymentService.subTitle')}</p>
                <FormControlLabel
                  value={noPaymentCheck} control={<Checkbox color='primary' />} label='No hay pago' checked={noPaymentCheck}
                  tabIndex={-1} onChange={(e) => setNoPaymentCheck(!noPaymentCheck)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className={noPaymentCheck ? '' : 'hidden'}>
              <Grid item xs={12}>
                <FormControl variant='outlined' className='MuiFormControl-fullWidth'>
                  <InputLabel id='noPaymentOption-simple-select-outlined-label'>{t('customer.newService.paymentService.reasonForNonPayment')}</InputLabel>
                  <Select
                    labelId='noPaymentOption-simple-select-outlined-label'
                    id='noPaymentOption-simple-select-outlined'
                    value={noPaymentOption}
                    onChange={(e) => setNoPaymentOption(e.target.value)}
                    label={t('customer.newService.paymentService.reasonForNonPayment')}
                    name='noPaymentOption'
                    error={noPaymenErrorMessage != ''}
                  >
                    {noPaymentsOptions.map((value) => (
                      <MenuItem key={'noPaymentOption-' + value} value={value}>{value}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText className='brand-error-message'>{noPaymenErrorMessage}</FormHelperText>

                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} className={noPaymentCheck ? 'hidden' : ''}>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  value={paymentChannel}
                  exclusive
                  onChange={handlepaymentChannel}
                  aria-label='text paymentChannel'
                  className='service-payment-method-group'
                >
                  <ToggleButton className='service-payment-method-btn' value='online' aria-label='online'>
                    {t('customer.newService.paymentService.paymentMethod.online')}
                  </ToggleButton>

                  <ToggleButton className='service-payment-method-btn' value='transfer' aria-label='transfer'>
                    {t('customer.newService.paymentService.paymentMethod.transfer')}
                  </ToggleButton>

                  <ToggleButton className='service-payment-method-btn' value='phone' aria-label='phone'>
                    {t('customer.newService.paymentService.paymentMethod.payForphone')}
                  </ToggleButton>

                  <ToggleButton className='service-payment-method-btn' value='pay_at_home' aria-label='pay_at_home'>
                    {t('customer.newService.paymentService.paymentMethod.payAtHome')}
                  </ToggleButton>

                  <ToggleButton className='service-payment-method-btn' value='bank_deposit' aria-label='bank_deposit'>
                    {t('customer.newService.paymentService.paymentMethod.bankDeposit')}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12} className={paymentData.length > 0 ? '' : 'hidden'}>
                {
                  paymentData.length > 0 && paymentData[0].status == 'completed' ? <p>{t('customer.newService.paymentService.paymentCompleted')}</p> : ''
                }
              </Grid>
              <Grid item xs={12} className={paymentChannel == 'phone' ? '' : 'hidden'}>
                {
                  (paymentData.length > 0 && paymentData[0].status != 'completed' && totalAmount > 0) || paymentData.length < 1
                    ? <PaymentMethods
                        cols={4}
                        country={country}
                        serviceID={serviceID}
                        customer_id={customer_id}
                        totalAmount={totalAmount}
                        object_class='Servicio'
                        onPaymentCallback={() => saveService(false)}
                      />
                    : <p>{t('customer.newService.paymentService.productAndService')}</p>
                }
              </Grid>
              <Grid item xs={12}>
                <CopyToClipboard
                  text={paymentLink}
                  onCopy={() => flash_alert(t('customer.newService.flashAlert.copied'), t('customer.newService.flashAlert.copyLinkMessage'), 'success')}
                >
                  <a className='mdl-navigation__link brand-primary-link '><i className='material-icons'>file_copy</i> {t('customer.newService.paymentService.copyPaymentLink')}</a>
                </CopyToClipboard>
              </Grid>
              <Grid item xs={12}>
                <p className='service-payemnt-method-p'>{t('customer.newService.paymentService.customerBill?')}</p>
                <FormControlLabel
                  value='si' control={
                    <Radio
                      checked={invoiceCheck === 'si'}
                      onChange={handleInvoiceCheckChange}
                      value='si'
                      color='primary'
                      name='radio-button-invoice-check'
                      inputProps={{ 'aria-label': 'Si' }}
                    />
                } label={t('customer.newService.paymentService.yes')}
                />

                <FormControlLabel
                  value='no' control={
                    <Radio
                      checked={invoiceCheck === 'no'}
                      onChange={handleInvoiceCheckChange}
                      value='no'
                      color='primary'
                      name='radio-button-invoice-check'
                      inputProps={{ 'aria-label': 'No' }}
                    />
                } label={t('customer.newService.paymentService.no')}
                />
                {invoiceCheck === 'si' &&
                  <div>
                    <p className='service-payemnt-method-p'>{t('customer.newService.paymentService.generateServiceButton')}</p>
                    <List>
                      <ListItem key='principal' className='service-address-list-item' role={undefined} dense button onClick={handleToggleFN('principal')}>
                        <ListItemIcon className='service-address-label'>
                          <FormControlLabel
                            value='principal' control={<Radio color='primary' />} label='' checked={checkedFN == 'principal'}
                            tabIndex={-1}
                          />

                        </ListItemIcon>
                        <ListItemText
                          id='radio-address-list-label-principal'
                          primary='Principal'
                          secondary={`${street_type_fn} ${street_name_fn}, ${ext_number_fn} ${int_number_fn}, ${administrative_demarcation_fn != null ? administrative_demarcation.admin3_admin1 : state_fn}${zipcode_fn != '' ? (', Código Postal: ' + zipcode_fn) : ''}`}
                        />
                        <ListItemSecondaryAction />
                      </ListItem>
                      {/* additionalsAddresses.map((additional_address) => {
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
                                        }) */}
                    </List>
                  </div>}
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
                  <Button id='service-save' disabled={loading} type='submit' variant='contained' color='primary' onClick={handleSubmit}>
                    {t('customer.newService.paymentService.generateServiceButton')}
                  </Button>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>

              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} className='service-price-table-container'>
            <p className='service-subtitle'>{t('customer.newService.paymentService.serviceDetails.title')}</p>

            <span className='service-price-table-label'>{t('customer.newService.paymentService.serviceDetails.concept')}</span>
            <span className='service-price-table-value'>{service_type}{subcategory != '' ? (', ' + subcategory) : ''}</span>

            <p>
              {t('customer.newService.paymentService.serviceDetails.totalHours')} <span className='pull-right'>{totalhours}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.hourAmount')} <span className='pull-right'>{money_format(country, hourAmout)}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.feeAmount')}
              <span className='pull-right'>
                <WarnIconValidate oldValue={oldFeeAmount} newValue={feeAmount} />
                {
                  canShowCurrencyField &&
                    <CurrencyTextField
                      style={{ width: '80px' }}
                      onBlur={handleFeeChange}
                      currencySymbol={CURRENCY_SYMBOLS[country]}
                      decimalPlaces={DECIMAL_PLACES[country]}
                      digitGroupSeparator=','
                      value={feeAmount}
                      outputFormat='number'
                    />
                }
              </span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.consumables')} <span className='pull-right'>{money_format(country, consumableAmount)}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.laborAmount')}
              <span className='pull-right'>
                <WarnIconValidate oldValue={oldLaborAmount} newValue={laborAmount} />
                {
                  canShowCurrencyField &&
                    <CurrencyTextField
                      style={{ width: '80px' }}
                      onBlur={(e) => setLaborAmount(Number(e.target.value.split(',').join('')))}
                      currencySymbol={CURRENCY_SYMBOLS[country]}
                      decimalPlaces={DECIMAL_PLACES[country]}
                      digitGroupSeparator=','
                      value={laborAmount}
                      outputFormat='number'
                    />
                }
              </span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.viaticAmount')}
              <span className='pull-right'>
                <WarnIconValidate oldValue={oldViaticAmount} newValue={viaticAmout} />
                {
                  canShowCurrencyField &&
                    <CurrencyTextField
                      style={{ width: '80px' }}
                      onBlur={(e) => setViaticAmout(Number(e.target.value.split(',').join('')))}
                      currencySymbol={CURRENCY_SYMBOLS[country]}
                      decimalPlaces={DECIMAL_PLACES[country]}
                      digitGroupSeparator=','
                      value={viaticAmout}
                      outputFormat='number'
                    />

                }
              </span>
            </p>

            <hr />
            <p>
              {t('customer.newService.paymentService.serviceDetails.subTotalAmount')} <span className='pull-right'>{money_format(country, subtotalAmount)}</span>
            </p>

            <p>
              {t('customer.newService.paymentService.serviceDetails.ivaAmount')}<span className='pull-right'>{money_format(country, ivaAmount)}</span>
            </p>

            <hr />

            <p className='totals'>
              {t('customer.newService.paymentService.serviceDetails.totalAmount')} <span className='pull-right'>{money_format(country, Number(totalAmount))}</span>
            </p>

            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
              <KeyboardDatePicker
                className='payment-date-input'
                id='date-payment-dialog'
                label={t('customer.newService.paymentService.serviceDetails.paydayLimit')}
                format='dd/MM/yyyy'
                value={selectedPaymentDate}
                onChange={handlePaymentDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
              <FormHelperText className='brand-error-message'>{selectedPaymentDateErrorMessage}</FormHelperText>
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

const structuredSelector = createStructuredSelector({})
const mapDispatchToProps = {}
export default connect(structuredSelector, mapDispatchToProps)(NewService)
