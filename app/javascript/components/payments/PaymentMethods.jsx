import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { csrf, headers } from "constants/csrf"
import { flash_alert } from 'components/App';
import Image from 'material-ui-image'
import { callMastercardGateway } from "constants/mastercard_functions.jsx"

function PaymentMethods(props) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [object_class, setObjectClass] = useState("Servicio");

  useEffect(() => {
    async function fetchPaymentMethods() {
      return fetch(`/api/v1/payment_methods?country=${props.country}`)
        .then(response => response.json())
        .then(json => {
          setPaymentMethods(json.data);
        })
        .catch(function(error) {
          //console.log('Hubo un problema con la peticion Fetch:' + error.message);
        });
    }
    if (props.country != "") {
      fetchPaymentMethods();
    }
  }, [props.country]);

  useEffect(() => {

    if (props.object_class != "") {
      setObjectClass(props.object_class);
    }
  }, [props.object_class]);

  function trigger_payment_method(payment_method_name) {
    if (props.onPaymentCallback) {
      props.onPaymentCallback();
    }
    var object = props.serviceID
    if (props.is_quotation == "true") {
      object = props.quotation_id
    }
    if (payment_method_name == "webpay") {
      window.location = `/webpay?object_id=${object}&object_class=${object_class}&customer_id=${props.customer_id}&amount=${props.totalAmount}&provider=webpay&quotation_id=${props.quotation_id}&is_quotation=${props.is_quotation}`;
    } else if (payment_method_name == "juno") {
      window.location = `/juno?object_id=${object}&object_class=${object_class}&customer_id=${props.customer_id}&provider=webpay&quotation_id=${props.quotation_id}&is_quotation=${props.is_quotation}`;
    } else if (payment_method_name == "cielo") {
      window.location = `/cielo?object_id=${object}&object_class=${object_class}&customer_id=${props.customer_id}&provider=cielo&quotation_id=${props.quotation_id}&is_quotation=${props.is_quotation}`;
    } else if (payment_method_name == "visa|mastercard") {
      callMastercardGateway("visa|mastercard", object, props.customer_id, props.totalAmount, object_class)
    } else if (payment_method_name == "american express") {
      //flash_alert("Error", "No implementado", "danger")
      callMastercardGateway("american express", object, props.customer_id, props.totalAmount, object_class)
    } else {
      flash_alert("Error", "No implementado", "danger")
    }
  }



  return (
    <React.Fragment>
      <Grid container spacing={2} >
        {paymentMethods && paymentMethods.map((paymentMethod) => {
          const paymentMethodID = `paymentMethod-${paymentMethod.id}`;
          return (
            <Grid key={paymentMethodID} item xs={12} sm={props.cols}>
              <div className="service-photo-box">
                <a className="service-photo-link" onClick={() => trigger_payment_method(paymentMethod.provider)}>
                  <span className="service-p-payment-method-name" >Pagar con {paymentMethod.name}</span>
                  <Image
                    src={paymentMethod.logo_url}
                    className="payment-image"
                  />
                </a>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(PaymentMethods)
