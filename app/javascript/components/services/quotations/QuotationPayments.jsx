import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import QuotationPaymentDetail from "components/services/quotations/QuotationPaymentDetail";

function QuotationPayments(props){
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
    const [visit, setVisit] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentType, setPaymentType] = useState();
    const [paymentTime, setPaymentTime] = useState("");

    useEffect(() => {
        fetchVisitsPayments(props.quotation.id, "Cotizacion", props.quotation.service_id)
    }, []);

    async function fetchVisitsPayments(object_id, object_class, service_id = null){
        setLoading(true)
        return fetch(`/api/v1/payments?object_id=${object_id}&object_class=${object_class}&service_id=${service_id}`)
        .then(response => response.json())
        .then(json => {
            if(json.data){
                setPaymentData(json.data)
                if (json.data[0] != undefined){ 
                    var payment_date = json.data[0].created_at//test[7].split('=>')
                    payment_date = payment_date.split("-")
                    var payment_time = json.data[0].created_at.split(":")
                    setPaymentTime(payment_time[0].split("T")[1]+":" + payment_time[1] + ":"+payment_time[2].split(".")[0]);
                    setPaymentDate(payment_date[1]+"/"+payment_date[2].substr(0,2)  +"/"+payment_date[0])
                    var test = json.data[0].provider_params && json.data[0].provider_params.split(',') || null
                    if (json.data[0].payment_method_id == 1 && test){//WEBPAY
                        var payment_type_code = test[9].split('=>')
                        if (payment_type_code[1] == '"VD"'){
                            setPaymentType("Débito")
                        }
                        if (payment_type_code[1] == '"NC"'){
                            var installments_number = test[12].split('=>')
                            setPaymentType("Cŕedito - "+installments_number[1].substr(0,installments_number[1].length-1)+ " cuotas")
                        }
                    }
                }
                fetchVisit(props.quotation.visit_id)
                
            }else{
                console.log("No hay precio.")
            }
            setLoading(false)
        })
        .catch(error => console.log(error) && setLoading(false));
    }

    async function fetchVisit(visit_id){
        setLoading(true)
        return fetch(`/api/v1/visits/${visit_id}`)
        .then(response => response.json())
        .then(json => {
            if(json.data){
                setVisit(json.data)
            }else{
                console.log("No se encontró la visita")
            }
            setLoading(false)
        })
        .catch(error => console.log(error) && setLoading(false));
    }

    
	return (
		<React.Fragment>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                        
                {paymentData.length > 0 &&
                    <QuotationPaymentDetail
                        serviceID={props.serviceID}
                        loading={loading}
                        setLoading={setLoading}
                        serviceStatusLabel={props.serviceStatusLabel}
                        validatePayment={props.validatePayment}
                        paymentTime = {paymentTime}
                        quotation = {props.quotation}
                        paymentType = {paymentType} //
                        paymentDate = {paymentDate} //
                        paymentData={paymentData} //
                        visit={visit} //
                        paymentChannel={props.paymentChannel}//
                        country={props.country} //
                        totalAmount={props.totalAmount} //
                        noPaymentCheck={props.noPaymentCheck} //
                        validated_payment={props.validated_payment} //
                        invoiceCheck={props.invoiceCheck} //
                        // Totals
                        selectedPaymentDate={props.selectedPaymentDate} //
                        customerPaymentDate={props.customerPaymentDate} //
                    />
                    ||
                    <QuotationPaymentDetail
                        callbacks={props.callbacks}
                        serviceID={props.serviceID}
                        loading={loading}
                        setLoading={setLoading}
                        serviceStatusLabel={props.serviceStatusLabel}
                        paymentTime = {paymentTime}
                        quotation = {props.quotation}
                        paymentType = {paymentType}
                        paymentDate = {paymentDate}
                        paymentData={paymentData}
                        visit={props.visit}
                        paymentChannel={props.paymentChannel}
                        country={props.country}
                        totalAmount={props.totalAmount}
                        noPaymentCheck={props.noPaymentCheck}
                        validated_payment={props.validated_payment}
                        invoiceCheck={props.invoiceCheck}
 
                        // Totals
                        selectedPaymentDate={props.selectedPaymentDate}
                        customerPaymentDate={props.customerPaymentDate}
                    />
                    
                }
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(QuotationPayments)

