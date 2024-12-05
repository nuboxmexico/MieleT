import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import VisitPaymentDetail from "components/services/visits/VisitPaymentDetail";

function VisitPayments(props){
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
    
    const [paymentData, setPaymentData] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentTime, setPaymentTime] = useState("");
    const [paymentType, setPaymentType] = useState()
    const [zipCode, setZipCode] = useState("")

    useEffect(() => {
        if(props.visit){
        fetchVisitsPayments(props.visit.id, "Visita", props.visit.service_id)
        }
    }, []);

    async function fetchVisitsPayments(object_id, object_class, service_id = null){
        setLoading(true)
        console.log("object_id: "+object_id)
        console.log("object_class:_ "+object_class)
        return fetch(`/api/v1/payments?object_id=${object_id}&object_class=${object_class}&service_id=${service_id}`)
        .then(response => response.json())
        .then(json => {
            if(json.data){
                setPaymentData(json.data)
                if (json.data[0] != undefined){
                    console.log("json.data[0]")
                    console.log(json.data[0]); 
                    var payment_date = json.data[0].created_at//test[7].split('=>')
                    payment_date = payment_date.split("-")
                    var payment_time = json.data[0].created_at.split(":")
                    setPaymentTime(payment_time[0].split("T")[1]+":" + payment_time[1] + ":"+payment_time[2].split(".")[0]);
                    setPaymentDate(payment_date[1]+"/"+payment_date[2].substr(0,2)  +"/"+payment_date[0])
                    var test = json.data[0].provider_params && json.data[0].provider_params.split(',') || null
                    if (json.data[0].payment_method_id == 1){//WEBPAY
                        var payment_type_code = test[9].split('=>')
                        if (payment_type_code[1] == '"VD"'){
                            setPaymentType("Débito")
                        }
                        else {
                            var installments_number = test[12].split('=>')
                            setPaymentType("Cŕedito - "+installments_number[1].substr(0,installments_number[1].length-1)+ " cuotas")
                        }
                    }
                    fetchCustomer(json.data[0].customer_id)
                }
                else{
                    fetchCustomer(props.customerID)
                }

                
            }else{
                console.log("No hay precio.")
            }
            setLoading(false)
        })
        .catch(error => console.log(error) && setLoading(false));
    }

    async function fetchCustomer(customer_id){
        setLoading(true)
        return fetch(`/api/v1/customers/${customer_id}`)
        .then(response => response.json())
        .then(json => {
            if(json.data){
                setCustomer(json.data)
                console.log("json.data customer: ")
                console.log(json.data)
                setZipCode(json.data.zipcode)
            }else{
                console.log("No se encontró el cliente")
            }
            setLoading(false)
        })
        .catch(error => console.log(error) && setLoading(false));
    }

    
	return (
		<React.Fragment>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                        
                {paymentData.length > 0 &&
                    <VisitPaymentDetail
                        subcategory={props.subcategory}
                        paymentType = {paymentType}
                        paymentDate = {paymentDate}
                        paymentTime = {paymentTime}
                        customer = {customer}
                        loading={loading}
                        setLoading={setLoading}
                        classes={classes}
                        service_type={props.service_type}
                        paymentData={paymentData}
                        visit={props.visit}
                        paymentChannel={props.paymentChannel}
                        country={props.country}
                        noPaymentCheck={(props.visit.no_payment == null ? props.noPaymentCheck : props.visit.no_payment)}
                        noPaymentOption={props.noPaymentOption}
                        validated_payment={props.validated_payment}
                        invoiceCheck={props.invoiceCheck}
                        selectedConsumables={props.selectedConsumables}
                        paymentFiles={props.paymentFiles}
                        // Totals
                        selectedPaymentDate={props.selectedPaymentDate}
                        customerPaymentDate={props.customerPaymentDate}
                        totalhours={props.totalhours}
                        hourAmout={props.hourAmout}
                        feeAmount={props.feeAmount}
                        laborAmount={props.laborAmount}
                        consumableAmount={props.consumableAmount}
                        viaticAmout={props.viaticAmout}
                        ivaAmount={props.ivaAmount}
                        subtotalAmount={props.subtotalAmount}
                        totalAmount={props.totalAmount}
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
                    ||
                    <VisitPaymentDetail
                        subcategory={props.subcategory}
                        paymentType = {paymentType}
                        paymentDate = {paymentDate}
                        paymentTime = {paymentTime}
                        customer = {customer}
                        loading={loading}
                        setLoading={setLoading}
                        classes={classes}
                        service_type={props.service_type}
                        paymentData={paymentData}
                        visit={props.visit}
                        paymentChannel={props.paymentChannel}
                        country={props.country}
                        noPaymentCheck={(props.visit.no_payment == null ? props.noPaymentCheck : props.visit.no_payment)}
                         noPaymentOption={props.noPaymentOption}
                        validated_payment={props.validated_payment}
                        invoiceCheck={props.invoiceCheck}
                        selectedConsumables={props.selectedConsumables}
                        paymentFiles={props.paymentFiles}
                        // Totals
                        selectedPaymentDate={props.selectedPaymentDate}
                        customerPaymentDate={props.customerPaymentDate}
                        totalhours={props.totalhours}
                        hourAmout={props.hourAmout}
                        feeAmount={props.feeAmount}
                        laborAmount={props.laborAmount}
                        consumableAmount={props.consumableAmount}
                        viaticAmout={props.viaticAmout}
                        ivaAmount={props.ivaAmount}
                        subtotalAmount={props.subtotalAmount}
                        totalAmount={props.totalAmount}
                        // Bill address
                        zipcode_fn={props.zipcode_fn}
                        zipcode={zipCode}
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
                    
                }
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(VisitPayments)

