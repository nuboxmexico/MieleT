import React from "react";
import { FormControl, InputLabel, MenuItem, Select, ListItemText, Checkbox } from '@material-ui/core';
import { createStructuredSelector } from "reselect"
import { connect } from "react-redux"
import { toQueryParams, modifyFilter } from '../../utils'
import { useTranslation } from 'react-i18next';

const PaymentFilter = (props) => {
  const {t} = useTranslation();
  const { page, perPage, getServices, setServicesLoading, options, modifyFilter, selectedOptions } = props;
  const { payment } = selectedOptions;

  function handleChange(event) {
    const { target: { value } } = event;
    console.log({ value });
    if (value[value.length - 1] === "all") {
      const newPayment = payment.length === options.length ? [] : options
      modifyFilter({ ...selectedOptions, payment: newPayment });
      return;
    }
    modifyFilter({ ...selectedOptions, payment: event.target.value })
  }

  function handleOnClose() {
    setServicesLoading(true);
    getServices(page, perPage, '', setServicesLoading, toQueryParams(selectedOptions));
  }

  const paymentStatusLabel = {
    yes: t('finance.input.yes'),
    no: t('finance.input.no'),
    unrequired: t('finance.input.unrequiredPay')
  }

  return (
    <>
      <FormControl variant='outlined' size='small' fullWidth>
        <InputLabel id="payment-filter-label">{t('finance.input.paid')}</InputLabel>
        <Select
          labelId="payment-filter-label"
          multiple
          id="payment-filter"
          value={payment}
          label={t('finance.input.paid')}
          onChange={handleChange}
          onClose={handleOnClose}
          renderValue={() => payment.map(option => paymentStatusLabel[option]).join(', ')}
        >
          <MenuItem value="all" >
            <Checkbox color="primary" checked={payment.length == options.length} />
            <ListItemText primary={t('finance.input.all')}/>
          </MenuItem>
          {
            options.map(option => (
              <MenuItem key={option} value={option}>
                <Checkbox color='primary' checked={payment.indexOf(option) > -1} />
                <ListItemText primary={paymentStatusLabel[option]} />
              </MenuItem>
            ))
          }

        </Select>
      </FormControl>
    </>
  );
};

const structuredSelector = createStructuredSelector({
  selectedOptions: state => state.finance_selected_options,
  page: state => state.services_page,
  perPage: state => state.services_per_page,
});

const mapDispatchToProps = { modifyFilter }

export default connect(structuredSelector, mapDispatchToProps)(PaymentFilter);
