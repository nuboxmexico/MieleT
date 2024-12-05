import React, {useState, useEffect} from 'react'
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {createStructuredSelector} from "reselect"
import {withRouter, Link} from 'react-router-dom';
import Close from '@material-ui/icons/Close';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  CircularProgress,
  Link as MuiLink,
  Typography
} from '@material-ui/core'
import MaterialTable from 'react-data-table-component';
import i18next from 'i18next';
const GET_CUSTOMERS_REQUEST = "GET_CUSTOMERS_REQUEST"; //ojo con esto, quizas es relevante en core
const GET_CUSTOMERS_SUCCESS = "GET_CUSTOMERS_SUCCESS";


const FilterComponent = ({filterText, onFilter, onClear}) => (
  <React.Fragment>
    <FormControl variant="outlined" className="table-search-form">
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
  </React.Fragment>
);


function getCustomers(page = 1, per_page = 10, filterText = "", setLoading) {
  return dispatch => {
    dispatch({type: GET_CUSTOMERS_REQUEST});
    return fetch(`/api/v1/project_customers?page=` + page + `&per_page=` + per_page + `&keywords=` + filterText)
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



function ProjectCustomers(props) {
  const [userLoading, setUserLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");

  const columns = [
    {
      name: i18next.t('globalTables.customerColumns.name'),
      selector: 'name',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.customerColumns.businessName'),
      selector: 'business_name',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.customerColumns.rfc'),
      selector: 'rfc',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.customerColumns.commercialBusiness'),
      selector: 'commercial_business',
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
          <MuiLink color="primary" className="" component={Link} to={`/customers/${row.customer_id}/show`}>
            <AssignmentIcon fontSize="small" />
            <Typography component="span" color="primary" className="mdl-navigation__link">{i18next.t('globalText.details')}</Typography>
          </MuiLink>
        </div>
      ),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      let search_param = (new URLSearchParams(props.history.location.search)).get('search');
      let filter_text_params_check = filterText
      if (search_param != null) {
        setFiltertext(search_param);
        filter_text_params_check = search_param
      } else {
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


  async function handlePageChange(newPage) {
    setUserLoading(true);
    props.getCustomers(newPage, perPage, filterText, setUserLoading);
  }

  async function handlePerRowsChange(newPerPage, newPage) {
    setUserLoading(true);
    props.getCustomers(newPage, newPerPage, filterText, setUserLoading);
    setPerpage(newPerPage);
  }

  function handleChange(state) {
    setSelectedRows(state.selectedRows);
  }

  function handleClear() {
    setFiltertext("");
    props.getCustomers(page, perPage, "", setUserLoading);
  }

  async function changeFilterText(e) {
    setFiltertext(e.target.value);
  }

  return (
    <React.Fragment>
      <MaterialTable
        title= {i18next.t('customer.titleProject')}
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
        subHeaderComponent={<FilterComponent onFilter={changeFilterText} onClear={handleClear} filterText={filterText} />}
      />

    </React.Fragment>
  );

}

ProjectCustomers.propTypes = {
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
export default withRouter(connect(structuredSelector, mapDispatchToProps)(ProjectCustomers));
