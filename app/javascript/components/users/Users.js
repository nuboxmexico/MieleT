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
import UsersLinks from "components/users/UsersLinks"
import DeleteUserDialog from "components/users/DeleteUserDialog"
import {csrf, headers} from "constants/csrf"
import { flash_alert } from 'components/App';
import { withRouter } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
const GET_USERS_REQUEST = "GET_USERS_REQUEST";
const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";

function getColumns(){
  return (
  [
    {
      name: i18next.t('globalTables.usersColumns.roleId'),
      selector: 'role_id',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.usersColumns.role'),
      selector: 'get_roles_names',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.usersColumns.name'),
      selector: 'fullname',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.usersColumns.email'),
      selector: 'email',
      sortable: true,
    },
    {
      name: i18next.t('globalTables.usersColumns.phone'),
      selector: 'phone',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.usersColumns.country'),
      selector: 'countries',
      sortable: true,
      hide: 'md',
      grow: true,
      minWidth: "155px",
      cell: row => (
        <div>
          {row.countries.map((value) => (
            <MenuItem className="user-flag" key={value.id} value={value.name} >
              <ReactCountryFlag
                  countryCode={value.iso}
                  svg
                  style={{
                    width: '2em',
                    height: '2em',
                  }}
                  title={value.name}
              />
            </MenuItem>
          ))}
        </div>
      ),
    },
    {
      name: i18next.t('globalTables.usersColumns.disabledd'),
      selector: 'disabledd',
      hide: 'md',
      cell: row => (
        <div>
            <Chip
                label={row.disabled ? i18next.t('globalTables.usersColumns.no') : i18next.t('globalTables.usersColumns.yes')}
                color={row.disabled ? 'primary' : 'secondary'}
            />
        </div>
      ),
    },
    {
      name: i18next.t('globalTables.usersColumns.createAt'),
      selector: 'created_at',
      sortable: true,
      hide: 'md',
    },
    {
      name: 'Acciones',
      selector: 'id',
      grow: true,
      minWidth: "170px",
      cell: row => (
        <div>
        <Link className="mdl-navigation__link brand-primary-link users-edit-link mg-r-15" to={`/users/${row.id}/edit`}>
            <i className="material-icons material-icons-20">edit</i> {i18next.t('globalText.edit')}
        </Link>
        <DeleteUserDialog key={row.id} user_id={row.id} name={row.firstname} lastname={row.lastname} email={row.email} getUsers={getUsers} headers={headers} />
        </div>
      ),
    },
  ]);
}

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
          <InputAdornment className="table-search-end" position="end" >
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
    <UsersLinks />
   </React.Fragment>
);


function getUsers(page = 1, per_page = 10, filterText = "", setLoading) {
  return dispatch => {
    dispatch({type: GET_USERS_REQUEST});
    return fetch(`api/v1/users?page=`+page+`&per_page=`+ per_page+`&keywords=`+ filterText)
      .then(response => response.json())
      .then(json => dispatch(getUsersSuccess(json, setLoading)))
      .catch(error => console.log(error));
  };
};

export function getUsersSuccess(json,setLoading) {
  setLoading(false)
  return {
    type: GET_USERS_SUCCESS,
    json
  };
};



function Users(props){
  const [userLoading, setUserLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");
  //const [selectedRows, setSelectedRows] = useState([]);

  const columns = getColumns();

  useEffect(() => {
    async function fetchData() {
      setUserLoading(true);
      props.getUsers(page, perPage, filterText, setUserLoading);
    }
    fetchData();
  }, []);


  async function handlePageChange(newPage){
    setUserLoading(true);
    props.getUsers(newPage, perPage, filterText, setUserLoading);
  }

  async function handlePerRowsChange(newPerPage, newPage){
    setUserLoading(true);
    props.getUsers(newPage, newPerPage, filterText, setUserLoading);
    setPerpage(newPerPage);
  }

  function handleChange(state){
   setSelectedRows(state.selectedRows);
  }

  function handleClear(){
    setFiltertext("");
    props.getUsers(page, perPage, "", setUserLoading);
  }

  async function changeFilterText(e){
    setFiltertext(e.target.value);
    const search = document.querySelector('#search');
    props.getUsers(page, perPage, e.target.value, setUserLoading);
  }
  
  return (
    <React.Fragment>
      <MaterialTable
        title= {i18next.t('users.title')}
        columns={columns}
        data={props.users}
        progressPending={userLoading}
        progressComponent={<CircularProgress size={75} />}
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

Users.propTypes = {
  users: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number
};

const structuredSelector = createStructuredSelector({
  users: state => state.users,
  page: state => state.page,
  perPage: state => state.perPage,
  total: state => state.total,
  curent_user: state => state.curent_user
});
const mapDispatchToProps = {getUsers};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Users));
