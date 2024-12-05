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
import TechniciansLinks from "components/technicians/TechniciansLinks"
import DeleteTechnicianDialog from "components/technicians/DeleteTechnicianDialog"
import {csrf, headers} from "constants/csrf"
import { flash_alert } from 'components/App';
import { withRouter } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close'; 
import i18next from 'i18next';
const GET_TECHNICIANS_REQUEST = "GET_TECHNICIANS_REQUEST";
const GET_TECHNICIANS_SUCCESS = "GET_TECHNICIANS_SUCCESS";


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
    <TechniciansLinks />
   </React.Fragment>
);


function getTechnicians(page = 1, per_page = 10, filterText = "", setLoading) {
  return dispatch => {
    dispatch({type: GET_TECHNICIANS_REQUEST});
    return fetch(`api/v1/technicians?page=`+page+`&per_page=`+ per_page+`&keywords=`+ filterText)
      .then(response => response.json())
      .then(json => dispatch(getTechniciansSuccess(json,setLoading)))
      .catch(error => console.log(error));
  };
};

export function getTechniciansSuccess(json,setLoading) {
  setLoading(false)
  return {
    type: GET_TECHNICIANS_SUCCESS,
    json
  };
};



function Technicians(props){
  const [userLoading, setUserLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [filterText, setFiltertext] = useState("");
  //const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      name: i18next.t('globalTables.techniciansColumns.user'),
      selector: 'user.email',
      sortable: true,
      cell: row => (
        <div>
          {row.user.email} {(row.enterprise != "" && row.enterprise != null ) ? "(" + row.enterprise  + ")" : ""}
        </div>
      ),
    },
    {
      name: i18next.t('globalTables.techniciansColumns.createdAt'),
      selector: 'created_at',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.techniciansColumns.actions'),
      selector: 'id',
      grow: true,
      minWidth: "170px",
      cell: row => (
        <div>
        <Link className="mdl-navigation__link brand-primary-link technicians-edit-link mg-r-15" to={`/technicians/${row.id}/edit`}>
            <i className="material-icons  material-icons-20">edit</i>  {i18next.t('globalText.edit')}
        </Link>
        <DeleteTechnicianDialog key={row.id} technician_id={row.id} name={row.user.firstname} lastname={row.user.lastname} email={row.user.email} getTechnicians={getTechnicians} headers={headers} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      setUserLoading(true);
      props.getTechnicians(page, perPage, filterText, setUserLoading);
    }
    fetchData();
  }, []);


  async function handlePageChange(newPage){
    setUserLoading(true);
    props.getTechnicians(newPage, perPage, filterText, setUserLoading);
  }

  async function handlePerRowsChange(newPerPage, newPage){
    setUserLoading(true);
    props.getTechnicians(newPage, newPerPage, filterText, setUserLoading);
    setPerpage(newPerPage);
  }

  function handleChange(state){
   setSelectedRows(state.selectedRows);
  }

  function handleClear(){
    setFiltertext("");
    props.getTechnicians(page, perPage, "", setUserLoading);
  }

  async function changeFilterText(e){
    setFiltertext(e.target.value);
    const search = document.querySelector('#search');
    props.getTechnicians(page, perPage, e.target.value, setUserLoading);
  }
  
  return (
    <React.Fragment>
      <MaterialTable
        title={i18next.t('technicians.title')}
        columns={columns}
        data={props.technicians}
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

Technicians.propTypes = {
  technicians: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number
};

const structuredSelector = createStructuredSelector({
  technicians: state => state.technicians,
  page: state => state.page,
  perPage: state => state.perPage,
  total: state => state.total,
  curent_user: state => state.curent_user
});
const mapDispatchToProps = {getTechnicians};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Technicians));
