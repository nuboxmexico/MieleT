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
import i18next from 'i18next';

const GET_DOWNLOADS_REQUEST = "GET_DOWNLOADS_REQUEST";
const GET_DOWNLOADS_SUCCESS = "GET_DOWNLOADS_SUCCESS";

const columns = [
  
  {
    name: i18next.t('globalTables.downloadColumns.dataType'),
    selector: 'data_type',
    sortable: true,
    hide: 'md',
  },
  {
    name: i18next.t('globalTables.downloadColumns.fullName'),
    selector: 'fullname',
    sortable: true,
    cell: row => (
      <span>
        {(!row.user ? "Sin información" : row.user.fullname)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.downloadColumns.description'),
    selector: 'description',
    sortable: true,
    cell: row => (
      <span>
        {(!row.description ? "Sin información" : row.description)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.downloadColumns.finished'),
    selector: 'finished',
    sortable: true,
    cell: row => (
      <span>
        {(row.finished ?  <Chip size="small" label="Listo" color="success" />
                        : <Chip size="small"
                                label="En proceso"
                                color="primary" />)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.downloadColumns.action'),
    selector: 'id',
    grow: true,
    minWidth: "170px",
    cell: row => (
      <div>
      {row.file_resource && row.file_resource.resource_url &&
        <a className="mdl-navigation__link brand-primary-link users-edit-link mg-r-15" href={row.file_resource.resource_url}>
            <i className="material-icons material-icons-20">{i18next.t('globalTables.downloadColumns.downloads')}</i>  
        </a>
      }
      </div>
    ),
  },
];





function getDownloads(page = 1, per_page = 10, setLoading) {
  return dispatch => {
    dispatch({type: GET_DOWNLOADS_REQUEST});
    return fetch(`api/v1/downloads?page=`+page+`&per_page=`+ per_page)
      .then(response => response.json())
      .then(json => dispatch(getDownloadsSuccess(json, setLoading)))
      .catch(error => console.log(error));
  };
};

export function getDownloadsSuccess(json,setLoading) {
  setLoading(false)
  return {
    type: GET_DOWNLOADS_SUCCESS,
    json
  };
};



function Downloads(props){
  const [downloadLoading, setdownloadLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);


  useEffect(() => {
    fetchData();
  }, []);


  async function handlePageChange(newPage){
    setdownloadLoading(true);
    props.getDownloads(newPage, perPage, setdownloadLoading);
  }

  async function handlePerRowsChange(newPerPage, newPage){
    setdownloadLoading(true);
    props.getDownloads(newPage, newPerPage, setdownloadLoading);
    setPerpage(newPerPage);
  }

  function handleChange(state){
   setSelectedRows(state.selectedRows);
  }


  async function fetchData() {
    setdownloadLoading(true);
    props.getDownloads(page, perPage, setdownloadLoading);
  }
    
   

  
  return (
    <React.Fragment>
      <MaterialTable
        title= {i18next.t('globalTables.downloadColumns.downloads')}
        columns={columns}
        data={props.downloads}
        progressPending={downloadLoading}
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
        subHeaderComponent={
          <Button className="mdl-navigation__link action-plus-btn"  variant="outlined" color="primary" onClick={e => fetchData()}>
            <i className="material-icons">refresh</i>&nbsp;&nbsp;{i18next.t('globalTables.downloadColumns.reload')}
          </Button>
        }
      />
      
    </React.Fragment>
  );
  
}
//  onClick={()=> this.props.getDownloads() }

Downloads.propTypes = {
  downloads: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number
};

const structuredSelector = createStructuredSelector({
  downloads: state => state.downloads,
  page: state => state.page,
  perPage: state => state.perPage,
  total: state => state.total,
  curent_user: state => state.curent_user
});
const mapDispatchToProps = {getDownloads};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Downloads));
