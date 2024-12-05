import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
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
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
const GET_SERVICES_REQUEST = "GET_SERVICES_REQUEST";
const GET_SERVICES_SUCCESS = "GET_SERVICES_SUCCESS";

const service_columns = [
    {
      name: i18next.t('globalTables.serviceColumns.number'),
      selector: 'number',
      sortable: true,
      grow: true,
      minWidth: "120px",
      cell: row => (
        <span>
          {(row.number == "" ? "-" : row.number)}
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
        name: i18next.t('globalTables.serviceColumns.customerFullName'),
        selector: 'customer_fullname',
        sortable: true,
        hide: 'md'
    },
    {
      name: i18next.t('globalTables.serviceColumns.statusLabel'),
      selector: 'current_survey.status_label',
      sortable: true,
      hide: 'md'
    },
    {
      name: i18next.t('globalTables.serviceColumns.createdAt'),
      selector: 'created_at',
      sortable: true,
      hide: 'md'
    },
    {
      name: i18next.t('globalTables.customerColumns.actions'),
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
];


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

const FilterComponent = ({ filterText, onFilter, onClear }) => (
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
   </React.Fragment>
);


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
 



function Surveys(props){
  const {t} = useTranslation();
  const [servicesLoading, setServicesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");
  //const [selectedRows, setSelectedRows] = useState([]);


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
  
  return (
    <React.Fragment>
      <MaterialTable
        title={t("suverys.title")}
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
        subHeaderComponent={<FilterComponent  onFilter={changeFilterText} onClear={handleClear} filterText={filterText} />}
      />
      
    </React.Fragment>
  );
  
}
//  onClick={()=> this.props.getUsers() }

Surveys.propTypes = {
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
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Surveys));
