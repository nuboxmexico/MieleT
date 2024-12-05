import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import ModalConfirmation from './modalConfirmation';
import ModalDownloadConfirmation from './ModalDownloadConfirmation'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import VisitDetail from './VisitDetail'
import FinanceFilter from './FinanceFilter'
import { createStructuredSelector } from "reselect"
import MaterialTable from 'react-data-table-component';
import { withRouter } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import { toQueryParams } from './utils'
import {
  Checkbox,
  FormControl,
  CircularProgress,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  AccordionDetails,
  Accordion,
  Box,
  Grid
} from '@material-ui/core';

import Close from '@material-ui/icons/Close';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { DateRangePicker } from "materialui-daterange-picker";
import { visitAreCompleted, visitPaidStatus } from './utils';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const GET_SERVICES_REQUEST = "GET_SERVICES_REQUEST";
const GET_SERVICES_SUCCESS = "GET_SERVICES_SUCCESS";

const customStyles = {
  subHeader: {
    style: {
      display: 'block',
    }
  }
}


const FilterComponent = ({ setShowModalDownloadConfirmation, setServicesLoading, getServices, open, toggle, dateRange, setDateRange, setOpen, filterText, onFilter, onClear, value, setValue, selectedVisits, setShowModalConfirmation }) => (
  <React.Fragment>
    <Box display='flex' justifyContent='flex-end' alignItems='center' width='100%' position='relative' component='div'>

      <FormControl variant="outlined" className="custom-search">
        <InputLabel className="white-bg padding-sides-5 table-search-label" htmlFor="search">{i18next.t('globalText.filterFor')}</InputLabel>
        <OutlinedInput
          id="search"
          type="text"
          className="table-search-input"
          value={filterText}
          onChange={onFilter}
          endAdornment={
            <InputAdornment position="end" >
              <IconButton
                aria-label="toggle password visibility"
                onClick={onClear}
              >
                {<Close />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      {!open &&

        <Box mr={2}>
          <Button onClick={() => { setOpen(true) }} className="mdl-navigation__link action-plus-btn" variant="outlined" color="primary" >
            <i className="material-icons">date_range</i>&nbsp;&nbsp;
          </Button>
        </Box>
      }
      <div className='absolute-calentar'>
        <DateRangePicker
          open={open}
          toggle={toggle}
          onChange={(range) => setDateRange(range)}
          initialDateRange={{
            startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            endDate: new Date(),
            key: 'selection',
          }}
          maxDate={new Date()}
          minDate={(new Date()).setMonth(new Date().getMonth() - 6)}
        />
      </div>
      {dateRange.endDate &&
      <Button className="mdl-navigation__link action-plus-btn" onClick={() => setShowModalDownloadConfirmation(true)} variant="outlined" color="primary">
          <i className="material-icons">download</i>&nbsp;&nbsp;{i18next.t('services.downloadServices')}
        </Button>
      }
      {!dateRange.endDate &&
        <Button disabled className="mdl-navigation__link action-plus-btn" target="_blank" variant="outlined" color="primary" >
          <i className="material-icons">download</i>&nbsp;&nbsp;{i18next.t('services.downloadServices')}
        </Button>
      }

      <Box ml={2}>
        <Button onClick={() => setShowModalConfirmation(true)} disabled={!Object.keys(selectedVisits).length} variant="contained" color="primary">
          {i18next.t('services.invoice')}
        </Button>
      </Box>
    </Box>

    <Box width='100%' marginTop={2}>
      <FinanceFilter getServices={getServices} setServicesLoading={setServicesLoading} />
    </Box>

  </React.Fragment>
);


function getServices(page = 1, per_page = 10, filterText = "", setLoading, queryParams = {}) {
  return dispatch => {
    dispatch({ type: GET_SERVICES_REQUEST });
    dispatch(clearServices())
    const params = {
      page,
      per_page: per_page == 5 ? 10 : per_page,
      keywords: filterText,
      ...queryParams
    }
    axios.get('/api/v1/services', { params })
      .then(json => dispatch(getServicesSuccess(json.data, setLoading)))
      .catch(error => console.log(error))
  };
};

export function getServicesSuccess(json, setLoading) {
  setLoading(false)
  return {
    type: GET_SERVICES_SUCCESS,
    json
  };
};
export function clearServices() {
  return {
    type: GET_SERVICES_SUCCESS,
    json: []
  };
};


function Finance(props) {
  const {t} = useTranslation();
  const [value, setValue] = React.useState([new Date('2017-02-01'), new Date('2017-05-20')]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [showModalConfirmation, setShowModalConfirmation] = useState(false)
  const [showModalDownloadConfirmation, setShowModalDownloadConfirmation] = useState(false)
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedVisits, setSelectedVisits] = useState({})
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    key: 'selection',
  });
  
  
  const service_columns = [
    {
      name: i18next.t('globalTables.serviceColumns.number'),
      selector: 'number',
      sortable: true,
      grow: true,
      minWidth: "110px",
      cell: row => (
        <span>
          {(row.number == "" ? "-" : row.number)}
        </span>
      ),
    },
    {
      name: i18next.t('globalTables.serviceColumns.ibsNumber'),
      selector: 'ibs_number',
      sortable: true,
      hide: 'sm',
      cell: row => (
        <span>
          {(!row.ibs_number ? i18next.t('globalText.noInfo'): row.ibs_number)}
        </span>
      ),
    },
    {
      name: i18next.t('globalTables.serviceColumns.serviceType'),
      selector: 'service_type',
      sortable: true,
      hide: 'md'
    },
    {
      name: i18next.t('globalTables.serviceColumns.subCategory'),
      selector: 'subcategory',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(!row.subcategory ? i18next.t('globalText.noInfo'): row.subcategory)}
        </span>
      ),
    },
    {
      name: i18next.t('globalTables.serviceColumns.customerFullName'),
      selector: 'customer_fullname',
      sortable: true,
      hide: 'md'
    },
    {
      name: i18next.t('globalTables.serviceColumns.statusLabel'),
      selector: 'status_label',
      sortable: true,
      hide: 'md'
    },
    {
      name: i18next.t('globalTables.serviceColumns.identifier'),
      selector: 'customer_rut',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(!row.customer_rut ? row.customer_rfc : row.customer_rut)}
        </span>
      ),
  
    },
    {
      name: i18next.t('globalTables.serviceColumns.actions'),
      selector: 'id',
      grow: true,
      minWidth: "120px",
      cell: row => (
        <div>
          <Link className="mdl-navigation__link brand-primary-link customers-show-link services-show-link mg-r-15" to={`/customers/${row.customer_id}/services/${row.id}/edit_service`}>
            <i className="material-icons material-icons-20">assignment</i> {i18next.t('globalText.details')}
          </Link>
        </div>
      ),
    },
    {
      name: '',
      grow: true,
      minWidth: "1px",
      cell: row => (
        <span></span>
      ),
    },
  
  ];

  const rowDisabledCriteria = row => row.visits.length === 0 || rowValidation(row)

  function rowValidation(service) {
    const visitPending = service.visits.some(visit => (visit.invoiced === 'pending') && visitAreCompleted(visit) && (visitPaidStatus(visit) === 'paid' || visitPaidStatus(visit) == 'unrequired'))
    return !visitPending
  }

  const toggle = () => setOpen(!open);

  useEffect(() => {
    async function fetchData() {
      setServicesLoading(true);
      props.getServices(page, perPage, filterText, setServicesLoading, toQueryParams(props.selectedOptions));
    }
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      setServicesLoading(true);
      const delayDebounceFn = setTimeout(() => {
        props.getServices(page, perPage, filterText, setServicesLoading, toQueryParams(props.selectedOptions));
      }, 1000)
      return () => clearTimeout(delayDebounceFn)

    }
  }, [filterText])

  useEffect(() => {
    setTimeout(() => {
      const row = document.querySelectorAll('[role="row"]')[0]
      const childRow = row.childNodes[1]
      row.removeChild(childRow)

      document.querySelectorAll('[aria-label="Expand Row"]').forEach(button => {
        button.parentNode.style.position = 'absolute'
        button.parentNode.style.right = 0
        button.parentNode.style.marginTop = '6px'
        button.parentNode.style.marginRight = '8px'
      })
    }, 200)

  }, [servicesLoading])

  async function handlePageChange(newPage) {
    setServicesLoading(true);
    props.getServices(newPage, perPage, filterText, setServicesLoading, toQueryParams(props.selectedOptions));
  }

  async function handlePerRowsChange(newPerPage, newPage) {
    setServicesLoading(true);
    props.getServices(newPage, newPerPage, filterText, setServicesLoading, toQueryParams(props.selectedOptions));
    setPerpage(newPerPage);
  }

  function handleRowChange(state) {
    setSelectedRows(state.selectedRows);
    const newSelectedVisits = {}

    state.selectedRows.forEach(service => {
      newSelectedVisits[service.id] = service.visits.filter(visit => visit.invoiced === 'pending' && visitAreCompleted(visit) && !(visitPaidStatus(visit) === 'unpaid'))
    })

    setSelectedVisits(newSelectedVisits)
  }

  function handleClear() {
    setFiltertext("");
    props.getServices(page, perPage, filterText, setServicesLoading, toQueryParams(props.selectedOptions));
  }

  async function changeFilterText(e) {
    setFiltertext(e.target.value);
  }

  const ExpandedComponent = ({ data }) => {
    return (
      <div>
        {
          (data.visits.length === 0 && <Skeleton />)
          ||
          <VisitDetail
            key={`visitDetail-${data.id}`}
            selectedService={selectedRows}
            setSelectedService={setSelectedRows}
            setSelectedVisits={setSelectedVisits}
            selectedVisits={selectedVisits}
            service={data}
          />
        }
      </div>
    )
  }

  return (
    <div id='finance-table'>
      <Accordion defaultExpanded>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ModalConfirmation selectedVisits={selectedVisits} showModal={showModalConfirmation} setShowModal={setShowModalConfirmation} />
              <ModalDownloadConfirmation dateRange={dateRange} showModal={showModalDownloadConfirmation} setShowModal={setShowModalDownloadConfirmation} />
              <MaterialTable
                title={i18next.t('sideNavBar.finances')}
                columns={service_columns}
                data={props.services}
                progressPending={servicesLoading}
                selectableRowDisabled={rowDisabledCriteria}
                selectableRows
                selectableRowsComponent={Checkbox}
                selectableRowsComponentProps={{ className: "product-checkbox", color: "primary" }}
                progressComponent={<CircularProgress size={50} />}
                onSelectedRowsChange={handleRowChange}
                pagination
                paginationServer
                responsive={true}
                paginationTotalRows={props.total}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                highlightOnHover={true}
                striped={true}
                noDataComponent={i18next.t('globalText.NoDataComponent')}
                paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                noHeader={true}
                subHeader


                subHeaderComponent={<FilterComponent setServicesLoading={setServicesLoading} getServices={props.getServices} setShowModalConfirmation={setShowModalConfirmation} selectedVisits={selectedVisits} open={open} toggle={toggle} dateRange={dateRange} setDateRange={setDateRange} setOpen={setOpen} value={value} setValue={setValue} onFilter={changeFilterText} onClear={handleClear} filterText={filterText} setShowModalDownloadConfirmation={setShowModalDownloadConfirmation}/>}
                expandableRows={true}
                expandOnRowClicked={true}
                expandableIcon={{ expanded: <KeyboardArrowUp />, collapsed: <KeyboardArrowDown /> }}
                expandableRowsComponent={<ExpandedComponent />}
                customStyles={customStyles}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

Finance.propTypes = {
  services: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number,
  selectedOptions: PropTypes.object,
};

const structuredSelector = createStructuredSelector({
  services: state => state.services,
  total: state => state.services_total,
  curent_user: state => state.curent_user,
  selectedOptions: state => state.finance_selected_options
});
const mapDispatchToProps = { getServices };
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Finance));
