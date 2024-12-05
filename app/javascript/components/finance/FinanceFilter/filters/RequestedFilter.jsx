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
  const { requested } = selectedOptions;

  function handleChange(event) {
    const { target: { value } } = event;
    if (value[value.length - 1] === "all") {
      const newRequested = requested.length === options.length ? [] : options
      modifyFilter({ ...selectedOptions, requested: newRequested });
      return;
    }
    modifyFilter({ ...selectedOptions, requested: event.target.value })
  }

  function handleOnClose() {
    console.log('Me cerre!');
    setServicesLoading(true);
    getServices(page, perPage, '', setServicesLoading, toQueryParams(selectedOptions));
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      <FormControl variant='outlined' size='small' fullWidth>
        <InputLabel id="requested-filter-label">{t('globalTables.serviceColumns.requested')}</InputLabel>
        <Select
          labelId="requested-filter-label"
          multiple
          id="requested-filter"
          value={requested}
          label={t('globalTables.serviceColumns.requested')}
          onChange={handleChange}
          onClose={handleOnClose}
          renderValue={() => requested.map(option => capitalizeFirstLetter(option)).join(', ')}
        >
          <MenuItem value="all" >
            <Checkbox color="primary" checked={requested.length == options.length} />
            <ListItemText primary={t('finance.input.all')}/>
          </MenuItem>
          {
            options.map(option => (
              <MenuItem key={option} value={option}>
                <Checkbox color='primary' checked={requested.indexOf(option) > -1} />
                <ListItemText primary={capitalizeFirstLetter(option)} />
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
