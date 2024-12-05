import React from "react";
import { FormControl, InputLabel, MenuItem, Select, ListItemText, Checkbox } from '@material-ui/core';
import { invoiceStatus } from 'constants/visitService'
import { createStructuredSelector } from "reselect"
import { connect } from "react-redux"
import { toQueryParams, modifyFilter } from '../../utils'
import { useTranslation } from 'react-i18next';

const InvoicedFilter = (props) => {
  const {t} = useTranslation();
  const { page, perPage, getServices, setServicesLoading, options, modifyFilter, selectedOptions } = props;
  const { invoiced } = selectedOptions;

  function handleChange(event) {
    const { target: { value } } = event;
    console.log({ value });
    if (value[value.length - 1] === "all") {
      const newInvoiced = invoiced.length === options.length ? [] : options
      modifyFilter({ ...selectedOptions, invoiced: newInvoiced });
      return;
    }
    modifyFilter({ ...selectedOptions, invoiced: value })
  }

  function handleOnClose(_event) {
    setServicesLoading(true);
    getServices(page, perPage, '', setServicesLoading, toQueryParams(selectedOptions));
  }

  return (
    <>
      <FormControl variant='outlined' size='small' fullWidth>
        <InputLabel id="invoiced-filter-label">{t('finance.input.invoiced')}</InputLabel>
        <Select
          labelId="invoiced-filter-label"
          multiple
          id="invoiced-filter"
          value={props.selectedOptions.invoiced}
          label={t('finance.input.invoiced')}
          onChange={handleChange}
          onClose={handleOnClose}
          renderValue={() => invoiced.map(option => invoiceStatus(option)).join(', ')}
        >
          <MenuItem value="all" >
            <Checkbox color="primary" checked={invoiced.length == options.length} />
            <ListItemText primary={t('finance.input.all')} />
          </MenuItem>
          {
            options.map(option => (
              <MenuItem key={option} value={option}>
                <Checkbox color='primary' checked={invoiced.indexOf(option) > -1} />
                <ListItemText primary={invoiceStatus(option)} />
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

export default connect(structuredSelector, mapDispatchToProps)(InvoicedFilter);
