import React, { useEffect, useState } from 'react';
import InvoicedFilter from './filters/InvoicedFilter'
import CompletedFilter from './filters/CompletedFilter'
import RequestedFilter from './filters/RequestedFilter'
import PaymentFilter from './filters/PaymentFilter'
import { Grid } from '@material-ui/core';
import * as ServiceApi from 'api/service'
import { createStructuredSelector } from "reselect"
import { connect } from "react-redux"

const FinanceFilter = (props) => {
  const { setServicesLoading, page, perPage } = props
  const [completedOptions, setCompletedOptions] = useState([])
  const [invoicedOptions, setInvoicedOptions] = useState([])
  const [paymentOptions, setPaymentOptions] = useState([])
  const [requestedOptions, setRequestedOptions] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { completed_options, invoiced_options, payment_options, requested_options } = await ServiceApi.filterOptions()
      setCompletedOptions(completed_options)
      setInvoicedOptions(invoiced_options)
      setPaymentOptions(payment_options)
      setRequestedOptions(requested_options)
    }
    fetchData()
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <InvoicedFilter
          options={invoicedOptions}
          getServices={props.getServices}
          setServicesLoading={setServicesLoading}
        />
      </Grid>

      <Grid item xs={3}>
        <CompletedFilter
          options={completedOptions}
          getServices={props.getServices}
          setServicesLoading={setServicesLoading}
        />
      </Grid>

      <Grid item xs={3}>
        <RequestedFilter
          options={requestedOptions}
          getServices={props.getServices}
          setServicesLoading={setServicesLoading}
        />
      </Grid>

      <Grid item xs={3}>
        <PaymentFilter
          options={paymentOptions}
          getServices={props.getServices}
          setServicesLoading={setServicesLoading}
        />
      </Grid>
    </Grid>
  );
};

const structuredSelector = createStructuredSelector({
  page: state => state.services_page,
  perPage: state => state.services_per_page,
});

const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(FinanceFilter);
