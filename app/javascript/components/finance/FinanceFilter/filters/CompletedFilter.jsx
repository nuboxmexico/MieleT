import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, ListItemText, Checkbox } from '@material-ui/core';
import { createStructuredSelector } from "reselect"
import { connect } from "react-redux"
import { toQueryParams, modifyFilter } from '../../utils'
import { useTranslation } from 'react-i18next';

const CompletedFilter = (props) => {
  const {t} = useTranslation();
  const { page, perPage, getServices, setServicesLoading, options, modifyFilter, selectedOptions } = props;
  const { completed } = selectedOptions;
  const [ready, setReady] = useState(false)

  function handleChange(event) {
    modifyFilter({ ...selectedOptions, completed: event.target.value })
  }

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if(!ready) return;

    setServicesLoading(true);
    getServices(page, perPage, '', setServicesLoading, toQueryParams(selectedOptions));
  }, [completed])

  const completedStatusLabel = {
    yes: t('finance.input.yes'),
    no: t('finance.input.no'),
    canceled: t('finance.input.canceled')
  }

  return (
    <>
      <FormControl variant='outlined' size='small' fullWidth>
        <InputLabel id="completed-filter-label">{t('finance.input.filled')}</InputLabel>
        <Select
          labelId="completed-filter-label"
          id="completed-filter"
          value={completed}
          label={t('finance.input.filled')}
          onChange={handleChange}
          renderValue={() => completedStatusLabel[completed]}
        >
          {
            options.map(option => (
              <MenuItem key={option} value={option}>
                <ListItemText primary={completedStatusLabel[option]} />
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

export default connect(structuredSelector, mapDispatchToProps)(CompletedFilter);
