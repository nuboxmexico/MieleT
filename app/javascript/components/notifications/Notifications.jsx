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
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
const GET_NOTIFICATIONS_REQUEST = "GET_NOTIFICATIONS_REQUEST";
const GET_NOTIFICATIONS_SUCCESS = "GET_NOTIFICATIONS_SUCCESS";

const READ_NOTIFICATIONS_REQUEST = "READ_NOTIFICATIONS_REQUEST";
const READ_NOTIFICATIONS_SUCCESS = "READ_NOTIFICATIONS_SUCCESS";


const notifications_columns = [
    {
      name: i18next.t('globalTables.notificationColumns.task'),
      selector: 'params',
      sortable: true,
      cell: row => (
        <span className="span-medium">
          {(row.params.data ? row.params.data.name : "Sin información")}
          <span className="notification-light"><AccessTimeIcon style={{ fontSize: 12 }} /> {row.created_at}</span>
        </span>
      ),
    },
    {
        name: i18next.t('globalTables.notificationColumns.description'),
        selector: 'params',
        sortable: true,
        cell: row => (
          <span>
            {(row.params.data ? row.params.data.description : "Sin información")}
          </span>
        ),
    },
    {
      name: i18next.t('globalTables.notificationColumns.days'),
      selector: 'days',
      sortable: true,
      hide: 'md',
      grow: true,
      minWidth: "60px",
    },
    {
      name: i18next.t('globalTables.notificationColumns.actions'),
      selector: 'id',
      grow: true,
      minWidth: "120px",
      cell: row => (
        <div>
            {row.params.data && row.params.data.link && 
                <Link className="mdl-navigation__link brand-primary-link customers-show-link services-show-link mg-r-15" to={`${row.params.data ? row.params.data.link : "#"}`}>
                <i className="material-icons material-icons-20">assignment</i> {i18next.t('globalText.details')}
                </Link>
                ||
                "-"
            }
        </div>
      ),
    },
];

const conditionalRowStyles = [
    {
      when: row => row.unread,
      style: {
        backgroundColor: '#f59b0026',
      },
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

const filters = ["Ver todo", "Leídos", "No leídos"]
    

const FilterComponent = ({ filterText, onFilter, onClear, filterValue, setFilterValue }) => (
  <React.Fragment>
     <Grid container spacing={1}  direction="row"
        justify="flex-end"
        alignItems="center">
      <Grid item xs={12} sm={3}>
        <FormControl variant="outlined" className="MuiFormControl-fullWidth">
          <InputLabel className="white-bg padding-sides-5 table-search-label"  htmlFor="search">Filtrar por</InputLabel>
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
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl variant="outlined" className="MuiFormControl-fullWidth filter-select" >
            <InputLabel id="filter-value-simple-select-outlined-label">Ver</InputLabel>
            <Select
              labelId="filter-value-simple-select-outlined-label"
              id="filter-value-simple-select-outlined"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              label="Canal"
              name="channel"
            >
            {filters.map((value) => (
                <MenuItem key={"filter-value-"+value} value={value}>{value}</MenuItem>
            ))}
            </Select>
        </FormControl>
      </Grid>
    </Grid>

   </React.Fragment>
);


function getNotifications(page = 1, per_page = 5, filterText = "", filterValue = "", setLoading, current_user_id = nil) {
  return dispatch => {
      dispatch({type: GET_NOTIFICATIONS_REQUEST});
      return fetch(`/api/v1/users/${current_user_id}/notifications/?page=${page}&per_page=${per_page}&keywords=${filterText}&filter_value=${filterValue}`)
      .then(response => response.json())
      .then(json => dispatch(getNotificationsSuccess(json, setLoading)))
      .catch(error => console.log(error));
      };
  };
    
export function getNotificationsSuccess(json, setLoading) {
    setLoading(false)
    return {
        type: GET_NOTIFICATIONS_SUCCESS,
        json
    };
};
    
function readNotifications(current_user_id = nil, notification_id = nil) {
  return dispatch => {
      dispatch({type: READ_NOTIFICATIONS_REQUEST});
      return fetch(`/api/v1/users/${current_user_id}/notifications/${notification_id}/read`)
      .then(response => response.json())
      .then(json => dispatch(readNotificationsSuccess(json)))
      .catch(error => console.log(error));
      };
  };
    
export function readNotificationsSuccess(json) {
    return {
        type: READ_NOTIFICATIONS_SUCCESS,
        json
    };
};
    



function Notifications(props){
  const [NotificationsLoading, setNotificationsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");
  const [filterValue, setFilterValue] = useState("Ver todo");
  
  
  //const [selectedRows, setSelectedRows] = useState([]);


  useEffect(() => {
    async function fetchData() {
        setNotificationsLoading(true);
        props.getNotifications(page, perPage, filterText, filterValue, setNotificationsLoading, props.current_user.id);
    }
    fetchData();
  }, [props.current_user]);

  useEffect(() => {
    setNotificationsLoading(true);
    const delayDebounceFn = setTimeout(() => {
      props.getNotifications(page, perPage, filterText, filterValue, setNotificationsLoading, props.current_user.id);
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [filterText])

  useEffect(() => {
    setNotificationsLoading(true);
    props.getNotifications(page, perPage, filterText, filterValue, setNotificationsLoading, props.current_user.id);
    
  }, [filterValue])


  async function handlePageChange(newPage){
    setNotificationsLoading(true);
    props.getNotifications(newPage, perPage, filterText, filterValue, setNotificationsLoading, props.current_user.id);
  }

  async function handlePerRowsChange(newPerPage, newPage){
    setNotificationsLoading(true);
    props.getNotifications(newPage, newPerPage, filterText, filterValue, setNotificationsLoading, props.current_user.id);
    setPerpage(newPerPage);
  }

  function handleChange(state){
   setSelectedRows(state.selectedRows);
  } 

  

  async function handleRowDoubleClicked(row){
    props.readNotifications(row.recipient_id, row.id)
  }

  function handleClear(){
    setFiltertext("");
    props.getNotifications(page, perPage, filterText, filterValue, setNotificationsLoading, props.current_user.id);
  }

  async function changeFilterText(e){
    setFiltertext(e.target.value);
  }
  ///api/v1/users/1/notifications/8/read
  return (
    <React.Fragment>
      <MaterialTable
        title={i18next.t('globalTables.notificationColumns.notification')}
        className="notifications-table"
        columns={notifications_columns}
        data={props.notifications}
        progressPending={NotificationsLoading}
        progressComponent={<CircularProgress size={50} />}
        pagination
        paginationServer
        responsive={true}
        paginationTotalRows={props.total}
        onChangeRowsPerPage={handlePerRowsChange}
        onRowDoubleClicked={handleRowDoubleClicked}
        onChangePage={handlePageChange}
        onSelectedRowsChange={handleChange}
        highlightOnHover={true}
        striped={true}
        conditionalRowStyles={conditionalRowStyles}
        noDataComponent={i18next.t('globalText.NoDataComponent')}
        paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
        subHeader
        subHeaderComponent={<FilterComponent  onFilter={changeFilterText} onClear={handleClear} filterText={filterText} filterValue={filterValue} setFilterValue={setFilterValue} />}
      />
      
    </React.Fragment>
  );
  
}
//  onClick={()=> this.props.getUsers() }

Notifications.propTypes = {
  notifications: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number
};

const structuredSelector = createStructuredSelector({
  notifications: state => state.notifications,
  page: state => state.notifications_page,
  perPage: state => state.notifications_per_page,
  total: state => state.notifications_total,
  curent_user: state => state.curent_user
});
const mapDispatchToProps = {getNotifications, readNotifications};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Notifications));
