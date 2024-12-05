import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import styled from 'styled-components';
import MaterialTable from 'react-data-table-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import CustomersLinks from "components/customers/CustomersLinks"
import DeleteCustomerDialog from "components/customers/DeleteCustomerDialog"
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
const GET_CUSTOMERS_REQUEST = "GET_CUSTOMERS_REQUEST";
const GET_CUSTOMERS_SUCCESS = "GET_CUSTOMERS_SUCCESS";


/*
  <DeleteCustomerDialog key={row.id} customer_id={row.id} name={row.names} lastname={row.lastname} email={row.email} getCustomers={getCustomers} headers={headers} />
*/
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
    <CustomersLinks />
   </React.Fragment>
);


function getCustomers(page = 1, per_page = 10, filterText = "", setLoading) {
  return dispatch => {
    dispatch({type: GET_CUSTOMERS_REQUEST});
    return fetch(`api/v1/customers?page=`+page+`&per_page=`+ per_page+`&keywords=`+ filterText)
      .then(response => response.json())
      .then(json => dispatch(getCustomersSuccess(json, setLoading)))
      .catch(error => console.log(error));
  };
};

export function getCustomersSuccess(json, setLoading) {
  setLoading(false)
  return {
    type: GET_CUSTOMERS_SUCCESS,
    json
  };
};



function Customers(props){
  const {t} = useTranslation();
  const [userLoading, setUserLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");
  //const [selectedRows, setSelectedRows] = useState([]);


  const columns = [
    {
      name: i18next.t('globalTables.customerColumns.name'),
      selector: 'names',
      sortable: true,
      cell: row => (  
        <div>
          {row.names && 
            <span>
              {row.names} {row.lastname} {row.surname}
            </span>
          || i18next.t('globalText.noInfo')}
        </div>
      ),
    },
    {
      name: i18next.t('globalTables.customerColumns.email'),
      selector: 'email',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.customerColumns.phone'),
      selector: 'phone',
      sortable: true,
      hide: 'md',
      cell: row => (  
        <div>
          {row.phone && 
            <span>
              {row.phone}
            </span>
          || i18next.t('globalText.noInfo')}
        </div>
      ),
      
    },
    {
      name: i18next.t('globalTables.customerColumns.address'),
      selector: 'id',
      sortable: true,
      hide: 'sm',
      cell: row => (  
        <div>
          {row.street_name && 
            <span>
               {row.state}, {row.delegation} {row.colony} {row.street_type} {row.street_name} {row.ext_number} {row.int_number}
             </span>
          || i18next.t('globalText.noInfo')}
        </div>
      ),
    },  
    {
      name: i18next.t('globalTables.customerColumns.createdAt'),
      selector: 'created_at',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.customerColumns.actions'),
      selector: 'id',
      grow: true,
      minWidth: "190px",
      cell: row => (
        <div>
            <Link className="mdl-navigation__link brand-primary-link customers-show-link mg-r-15" to={`/customers/${row.id}/show`}>
              <i className="material-icons material-icons-20">assignment</i> {i18next.t('globalText.details')}
            </Link>
          {
            !row.is_project_customer &&
            <Link className="mdl-navigation__link brand-primary-link customers-edit-link" to={`/customers/${row.id}/edit`}>
                <i className="material-icons material-icons-20">edit</i> {i18next.t('globalText.edit')}
            </Link>
          }
        </div>
      ),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      let search_param = (new URLSearchParams(props.history.location.search)).get('search');
      let filter_text_params_check = filterText
      if( search_param!= null){
        setFiltertext(search_param);
        filter_text_params_check = search_param
      }else{
        setUserLoading(true);
        props.getCustomers(page, perPage, filter_text_params_check, setUserLoading);
      }
      
    }
    fetchData();
  }, []);

  useEffect(() => {
    setUserLoading(true);
    const delayDebounceFn = setTimeout(() => {
      props.getCustomers(page, perPage, filterText, setUserLoading);
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [filterText])


  async function handlePageChange(newPage){
    setUserLoading(true);
    props.getCustomers(newPage, perPage, filterText, setUserLoading);
  }

  async function handlePerRowsChange(newPerPage, newPage){
    setUserLoading(true);
    props.getCustomers(newPage, newPerPage, filterText, setUserLoading);
    setPerpage(newPerPage);
  }

  function handleChange(state){
   setSelectedRows(state.selectedRows);
  }

  function handleClear(){
    setFiltertext("");
    props.getCustomers(page, perPage, "", setUserLoading);
  }

  async function changeFilterText(e){
    setFiltertext(e.target.value);
    const search = document.querySelector('#search');
  }
  
  return (
    <React.Fragment>
      <MaterialTable
        title={t('customer.title')}
        columns={columns}
        data={props.customers}
        progressPending={userLoading}
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

Customers.propTypes = {
  customers: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number
};

const structuredSelector = createStructuredSelector({
  customers: state => state.customers,
  page: state => state.page,
  perPage: state => state.perPage,
  total: state => state.total,
  curent_user: state => state.curent_user
});
const mapDispatchToProps = {getCustomers};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Customers));
