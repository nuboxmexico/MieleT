import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import axios from 'axios';
import { Provider } from "react-redux"
import configureStore from "stores/configureStore"
//./bin/webpack-dev-server

// FRONT END
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// Notifications
import { flash_alert } from 'components/App';
import { store } from 'react-notifications-component';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {csrf, headers, money_format, date_event_format, api_token} from "constants/csrf"

// Payment Methods
import PaymentMethods from 'components/payments/PaymentMethods';
axios.defaults.headers.common['Authorization'] = `Token token=${api_token(process.env.RAILS_ENV)}` 
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8C0014',
    },
    secondary: {
      main: '#ececec',
    },
    tertiary:{
      main: '#1f1f1f',
    },
    tonalOffset: 0.2,
  },
});


function NewPayment(props){
  const store_r = configureStore(props.current_user);
  // Customer Info
  const [customer, setCustomer] = useState("");
  // Customer 
  const [customer_id, setCustomerId] = useState("");
  const [is_quotation, setIsQuotation] = useState(false);
  const [quotation_id, setQuotationId] = useState("");
  const [object_class, setObjectClass] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
	const [state, setState] = useState("");
	const [delegation, setDelegation] = useState("");
	const [colony, setColony] = useState("");
	const [street_type, setStreettype] = useState("");
	const [street_name, setStreetName] = useState("");
	const [ext_number, setExtNumber] = useState("");
	const [int_number, setIntNumber] = useState("");
	const [administrative_demarcation, setAdministrativeDemarcation] = useState({});
  // Service info
  const [serviceID, setServiceID] = useState("");
  const [service_type, setServiceType] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [requested, setRequested] = useState("");
  const [requestChannel, setRequestChannel] = useState("");
  const [serviceStatus, setServiceStatus] = useState("new");
  const [hourAmout, setHourAmout] = useState(0);
  const [feeAmount, setFeeAmount] = useState(0);
  const [totalhours, setTotalhours] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [event, setEvent] = useState("");
  // Distributor
  const [distributorName, setDistributorName] = useState("");
  const [distributorEmail, setDistributorEmail] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("CL");

  useEffect(() => {


    async function fetchServiceData() {
      var service_id = props.payment.object_id
      setObjectClass("Servicio")
      if (props.is_quotation == "true"){
        setQuotationId(props.payment.object_id)
        service_id = props.service_id
        setObjectClass("Cotizacion")
      }
      return axios.get(`/api/v1/services/${service_id}`)
          .then(response => response.data)
          .then(json => {
            if (props.payment_amount && props.is_quotation){
              console.log("props")
              console.log(props)
              setTotalAmount(props.payment_amount);
              setIsQuotation(props.is_quotation);
            }
            else{
              setTotalAmount(json.total_amount)
            }
            if(json.service_type){
                setServiceType(json.service_type)
            }
            if(json.subcategory){
                setSubcategory(json.subcategory)
            }
            setServiceID(json.id)
            setRequested(json.requested)
            setRequestChannel(json.request_channel)
            setHourAmout(json.hour_amount)
            setFeeAmount(json.fee_amount)
            setTotalhours(json.total_hours)
            setDistributorName(json.distributor_name)
            setDistributorEmail(json.distributor_email)
            setServiceStatus(json.status)
            if(json.calendar_events.length > 0){
              if (json.calendar_events.length > 1) {
                let lastIndex = json.calendar_events.length - 1;
                setEvent({start: json.calendar_events[0].start_date, end: json.calendar_events[lastIndex].finish_date})
              } else {
                setEvent({start: json.calendar_events[0].start_date, end: json.calendar_events[0].finish_date})
              }
            }

            setCustomerId(json.customer_id)
            setCustomer(json.customer)
            setCurrencySymbol(json?.customer?.country?.iso || 'CL');
            
            if(json.address == "principal"){
              setZipcode(json.customer.zipcode)
              setState(json.customer.state)
              setDelegation(json.customer.delegation)
              setColony(json.customer.colony)
              setStreettype(json.customer.street_type)
              setStreetName(json.customer.street_name)
              setExtNumber(json.customer.ext_number)
              setIntNumber(json.customer.int_number)
              setAdministrativeDemarcation(json.customer.administrative_demarcation)
            }else{
              if(json.customer.additional_addresses.length > 0){
                var current_address = json.customer.additional_addresses.find(additional_address => String(additional_address.id) === json.address)
                if(current_address){
                  setZipcode(current_address.zipcode)
                  setState(current_address.state)
                  setDelegation(current_address.delegation)
                  setColony(current_address.colony)
                  setStreettype(current_address.street_type)
                  setStreetName(current_address.street_name)
                  setExtNumber(current_address.ext_number)
                  setIntNumber(current_address.int_number)
                  setAdministrativeDemarcation(current_address.administrative_demarcation)
                }
              }
            }
            if(json.customer.country != null){
                setCountry(json.customer.country.iso)
            }
            
          })
    }
  

       
    fetchServiceData();
  }, [props.payment]);

  return (
		<Provider store={store_r}>
            <ThemeProvider theme={theme}>
				<Container className="service-payment-container"> 
				 	<main>
                        <Box className="service-payment-box">
                            <Paper className="custom-paper">
                                <Grid  container spacing={3}>
                                    <Grid item xs={12}>
                                        <p className="service-subtitle">Detalles del servicio*</p>
                                        <span className="service-p-small">Si hay algún error en los datos a continuación, por favor comuníquese con nosotros.</span>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <span className="service-p-item" >Concepto</span>
                                        {is_quotation &&
                                          <span className="service-p-subitem">Cotización</span>
                                        }
                                        {!is_quotation &&
                                          <span className="service-p-subitem">{service_type}{subcategory != "" ? (", "+subcategory) : ""}</span>
                                        }
                                        </Grid>
                                    <Grid item xs={12}>
                                        <span className="service-p-item" >Dirección</span>
                                        <span className="service-p-subitem">{street_type} {street_name}, {ext_number} {int_number}, {administrative_demarcation != null ?  administrative_demarcation.admin3_admin1 : state}{zipcode != "" ? (", Código Postal: " + zipcode) : "" }</span>
                                    </Grid>
                                    {!is_quotation &&
                                      <Grid item xs={12}>
                                          <span className="service-p-item" >Fecha agendada</span>
                                          <span className="service-p-subitem">{event && date_event_format(event.start,event.end)}</span>
                                          
                                      </Grid>
                                    }
                                    <Grid item xs={12}>
                                        <span className="service-p-total-label">Monto a pagar:</span><span className="service-p-total-amount">{money_format(currencySymbol,totalAmount)}</span>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider/>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <p className="service-subtitle">Método de pago</p>
                                        <PaymentMethods
                                            quotation_id = {quotation_id}
                                            is_quotation = {is_quotation}
                                            cols={6}
                                            country={country}
                                            serviceID={serviceID}
                                            customer_id={customer_id}
                                            totalAmount={totalAmount}
                                            object_class={object_class}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    </main>
				</Container>
            </ThemeProvider>
  	</Provider>
  );
}

export default NewPayment