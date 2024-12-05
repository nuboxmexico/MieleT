import React, { useState, useEffect } from 'react'
import moment from 'moment';
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { Button, Box, Typography } from '@material-ui/core';
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import styled from 'styled-components';
import MaterialTable from 'react-data-table-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import {csrf, headers} from "constants/csrf"
import { flash_alert } from 'components/App';
import { withRouter } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close'; 
// import { DateRangePicker } from 'rsuite';
// //import 'rsuite/dist/rsuite.min.css'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {useTranslation} from "react-i18next"
import i18next from 'i18next';

//(import { DateRangePicker } from 'react-date-range';
////////////////////////////
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
const GET_SERVICES_REQUEST = "GET_SERVICES_REQUEST";
const GET_SERVICES_SUCCESS = "GET_SERVICES_SUCCESS";

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({open, toggle, dateRange, setDateRange, setOpen, filterText, onFilter, onClear, value, setValue }) => {
  const { t } = useTranslation;
  function handleDownload() {
    const LIMIT_MONTHS = 2
    const { startDate, endDate } = dateRange
    const diffMonths = moment(endDate).diff(moment(startDate), 'months')
    if (!endDate) {
      flash_alert("Error", "Debes seleccionar fecha fin", "danger")
      return
    }

    if (diffMonths > LIMIT_MONTHS) {
      flash_alert("Error",`El rango de fechas no puede ser mayor a ${LIMIT_MONTHS} meses`, "danger")
      return
    }

    const queryParams = new URLSearchParams();
    queryParams.set('start', startDate);
    queryParams.set('finish', endDate);
    window.location.href = '/api/v1/services_report_excel.xlsx?' + queryParams
  }

  return (
    <React.Fragment>
      <FormControl variant="outlined" className="table-search-form">
      <InputLabel className="white-bg padding-sides-5 table-search-label"  htmlFor="search">{i18next.t('globalText.filterFor')}</InputLabel>
        <OutlinedInput
          id="search"
          type= "text"
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
      <Button onClick={()=>{setOpen(true)}} className="mdl-navigation__link action-plus-btn" variant="outlined" color="primary" >
      <i className="material-icons">date_range</i>&nbsp;&nbsp;
    </Button>
      }
      <div className='absolute-calentar'>
        <DateRangePicker
          open={open}
          toggle={toggle}
          onChange={(range) => setDateRange(range)}
          initialDateRange = {{
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            key: 'selection',
          }}
          maxDate={new Date()}
          minDate={new Date((new Date().getFullYear() - 1), 0, 1)}
        />
      </div>
      <Button 
        className="mdl-navigation__link action-plus-btn" 
        // href={"/api/v1/services_report_excel.xlsx?start="+dateRange.startDate+";finish="+dateRange.endDate} 
        variant="outlined" 
        color="primary"
        onClick={handleDownload}
      >
        <i className="material-icons">download</i>&nbsp;&nbsp;{i18next.t('globalText.downloadServices')}
      </Button>

      <Button className="mdl-navigation__link action-plus-btn" target="_blank" variant="outlined" color="primary" href={"/data_download"}>
      <i className="material-icons">list</i>&nbsp;&nbsp;{i18next.t('globalText.showDownloads')}
      </Button>
     </React.Fragment>
  )
}


function getServices(page = 1, per_page = 5, filterText = "", setLoading) {
return dispatch => {
    dispatch({type: GET_SERVICES_REQUEST});
    return fetch(`/api/v1/services?page=`+page+`&per_page=`+ per_page +`&keywords=`+ filterText + `&only_payed=` + true)
    .then(response => response.json())
    .then(json => dispatch(getServicesSuccess(json, setLoading)))
    .catch(error => console.log(error));
    };
};
  
export function getServicesSuccess(json, setLoading) {
    setLoading(false)
    return {
        type: GET_SERVICES_SUCCESS,
        json
    };
};
 



function Services(props){
  const {t} = useTranslation();
  const [value, setValue] = React.useState([new Date('2017-02-01'), new Date('2017-05-20')]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth()-1)),
    endDate: new Date(),
    key: 'selection',
  });

  const toggle = () => setOpen(!open);

  const service_columns = [
    {
      name: t('globalTables.serviceColumns.number'),
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
      name: t('globalTables.serviceColumns.ibsNumber'),
      selector: 'ibs_number',
      sortable: true,
      hide: 'sm',
      cell: row => (
        <span>
          {(!row.ibs_number ? t('globalText.noInfo') : row.ibs_number)}
        </span>
      ),
    },
    {
      name: t('globalTables.serviceColumns.serviceType'),
      selector: 'service_type',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(row.service_type == "" ? "-" : t(`services.indexRow.serviceType.${row.service_type}`))}
        </span>
      ),
    },
    {
      name: t('globalTables.serviceColumns.subCategory'),
      selector: 'subcategory',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(!row.subcategory ? t('globalText.noInfo') : t(`services.indexRow.subCategory.${row.subcategory}`))}
        </span>
      ),
    },
    {
      name: t('globalTables.serviceColumns.requested'),
      selector: 'requested',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span> 
        {
          (
            (!row.requested) ? t('globalText.noInfo') : 
            (row.requested.toLowerCase() == t("services.authorizedDealer") ? row.distributor_name +" "+ row.distributor_email : t(`services.indexRow.requested.${row.requested}`))
          )
        }
        </span>
      ),
    },
    {
        name: t('globalTables.serviceColumns.customerFullName'),
        selector: 'customer_fullname',
        sortable: true,
        hide: 'md'
    },
    {
      name: t('globalTables.serviceColumns.requestChannel'),
      selector: 'request_channel',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(row.request_channel == "" ? t('globalText.noInfo') : t(`services.indexRow.request_channel.${row.request_channel}`))}
        </span>
      ),
    },
    {
      name: t('globalTables.serviceColumns.statusLabel'),
      selector: 'status_label',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(row.request_channel == "" ? t('globalText.noInfo') : t(`services.indexRow.status.${row.status}`))}
        </span>
      ),
    },
    {
      name: t('globalTables.serviceColumns.visitNumber'),
      selector: 'visit_number',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(!(row.last_visit && row.last_visit.visit_number) ? t('globalText.noInfo') : row.last_visit.visit_number)}
        </span>
      ),
    },
    {
      name: t('globalTables.serviceColumns.createdAt'),
      selector: 'created_at',
      sortable: true,
      hide: 'md'
    },
    {
      name: t('globalTables.serviceColumns.actions'),
      selector: 'id',
      grow: true,
      minWidth: "120px",
      cell: row => (
        <div>
            <Link className="mdl-navigation__link brand-primary-link customers-show-link services-show-link mg-r-15" to={`/customers/${row.customer_id}/services/${row.id}/edit_service`}>
              <i className="material-icons material-icons-20">assignment</i> {t("globalText.details")}
            </Link>
        </div>
      ),
    },    
];
  
  //const [selectedRows, setSelectedRows] = useState([]);

  function handleSelect(ranges){
    console.log(ranges);
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  }

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }

  useEffect(() => {
    async function fetchData() {
        setServicesLoading(true);
        props.getServices(page, perPage, filterText, setServicesLoading);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setServicesLoading(true);
    const delayDebounceFn = setTimeout(() => {
      props.getServices(page, perPage, filterText, setServicesLoading);
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [filterText])


  async function handlePageChange(newPage){
    setServicesLoading(true);
    props.getServices(newPage, perPage, filterText, setServicesLoading);
  }

  async function handlePerRowsChange(newPerPage, newPage){
    setServicesLoading(true);
    props.getServices(newPage, newPerPage, filterText, setServicesLoading);
    setPerpage(newPerPage);
  }

  function handleChange(state){
   setSelectedRows(state.selectedRows);
  }

  function handleClear(){
    setFiltertext("");
    props.getServices(page, perPage, filterText, setServicesLoading);
  }

  async function changeFilterText(e){
    setFiltertext(e.target.value);
  }

  async function changeRange(range){
    setDateRange(range);
  }
  
  return (
    <React.Fragment>      
      <MaterialTable
        title={t('services.title')}
        columns={service_columns}
        data={props.services}
        progressPending={servicesLoading}
        progressComponent={<CircularProgress size={50} />}
        pagination
        paginationServer
        responsive={true}
        paginationTotalRows={props.total}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onSelectedRowsChange={handleChange}
        highlightOnHover={true}
        striped={true}
        noDataComponent={i18next.t('globalText.NoDataComponent')}
        paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
        subHeader
        subHeaderComponent={<FilterComponent open={open} toggle={toggle} dateRange={dateRange} setDateRange={setDateRange} setOpen={setOpen} value={value} setValue={setValue} onFilter={changeFilterText} onClear={handleClear} filterText={filterText} />}
      />
      
    </React.Fragment>
  );
  
}
//  onClick={()=> this.props.getUsers() }

Services.propTypes = {
  services: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number
};

const structuredSelector = createStructuredSelector({
  services: state => state.services,
  page: state => state.services_page,
  perPage: state => state.services_per_page,
  total: state => state.services_total,
  curent_user: state => state.curent_user
});
const mapDispatchToProps = {getServices};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Services));
