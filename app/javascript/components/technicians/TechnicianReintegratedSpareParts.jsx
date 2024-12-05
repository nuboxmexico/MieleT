import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import MaterialTable from 'react-data-table-component';
import {csrf, headers, money_format, date_event_format, date_difference_in_hours, api_token, site_url, payment_channel_label} from "constants/csrf"
import DeleteSparePartDialog from "components/services/DeleteSparePartDialog";
import i18next from 'i18next';

const GET_REINTEGRATED_SPARE_PARTS_REQUEST = "GET_REINTEGRATED_SPARE_PARTS_REQUEST";
const GET_REINTEGRATED_SPARE_PARTS_SUCCESS = "GET_REINTEGRATED_SPARE_PARTS_SUCCESS";

const spare_part_columns = [
    {
      name: i18next.t('globalTables.sparePartColumns.tnr'),
      selector: 'spare_part.tnr',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.name'),
      selector: 'spare_part.name',
      sortable: true,
    },
    {
        name: i18next.t('globalTables.sparePartColumns.quantity'),
        selector: 'quantity',
        sortable: true,
        hide: 'md',
    },
    {
        name: '',
        selector: '',
        sortable: true,
        hide: 'md',
        cell: row => (
          <span>
            {i18next.t('globalTables.sparePartColumns.refunded')}
          </span>
        ),
    },
    {
        name: 'Acciones',
        selector: 'id',
        grow: true,
        minWidth: "190px",
        cell: row => (
        <span>
            <DeleteSparePartDialog key={"DeleteSparePartDialog"+row.id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} from={"technicians"} headers={headers} />
        </span>
        ),
    }
    
    
];

function getSpareParts(technician_id, setUserLoading) {
    return dispatch => {
        dispatch({type: GET_REINTEGRATED_SPARE_PARTS_REQUEST});
        return fetch(`/api/v1/technicians/${technician_id}/reintegrated_spare_parts`)
        .then(response => response.json())
        .then(json => dispatch(getSparePartsSuccess(json,setUserLoading)))
        .catch(error => console.log(error) && setUserLoading(false));
    };
};

export function getSparePartsSuccess(json, setUserLoading) {
    setUserLoading(false)
    return {
        type: GET_REINTEGRATED_SPARE_PARTS_SUCCESS,
        json
    };
};


function TechnicianReintegratedSpareParts(props){
    
    const [userLoading, setUserLoading] = useState(false);
    
    useEffect(() => {
        setUserLoading(true)
       
        if(props.technician_id){
            props.getSpareParts(props.technician_id, setUserLoading);
        }
        setUserLoading(false)
    }, [props.technician_id]);


	return (
		<React.Fragment>
            <Grid style={{marginTop: "15px"}} container spacing={1}>
                <Grid item xs={12}>
                    <MaterialTable
                    noHeader={true}
                        columns={spare_part_columns}
                        data={props.spare_parts}
                        progressPending={userLoading}
                        progressComponent={<CircularProgress size={75} />}
                        responsive={true}
                        highlightOnHover={true}
                        striped={true}
                        contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                        noDataComponent={i18next.t('globalText.NoDataComponent')}
                        paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                    />
                </Grid>
            </Grid>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
    spare_parts: state => state.reintegrated_spare_parts,
    page: state => state.page,
    perPage: state => state.perPage,
    total: state => state.total,
    current_user: state => state.current_user,
});
const mapDispatchToProps = {getSpareParts};
export default connect(structuredSelector, mapDispatchToProps)(TechnicianReintegratedSpareParts)

