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
import Radio from '@material-ui/core/Radio';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {csrf, headers, money_format, date_event_format, date_difference_in_hours, api_token, site_url, payment_channel_label} from "constants/csrf"
import {useTranslation} from 'react-i18next';
import Skeleton from '@material-ui/lab/Skeleton';
import i18next from 'i18next'

const GET_SELECTED_SPARE_PARTS_REQUEST = "GET_SELECTED_SPARE_PARTS_REQUEST";
const GET_SELECTED_SPARE_PARTS_SUCCESS = "GET_SELECTED_SPARE_PARTS_SUCCESS";

const spare_part_columns = [
    {
      name: 'TNR',
      selector: 'spare_part.tnr',
      sortable: true,
      hide: 'sm',
    },
    {
      name: 'Nombre',
      selector: 'spare_part.name',
      sortable: true,
    },
    {
        name: 'Cantidad',
        selector: 'quantity',
        sortable: true,
        hide: 'md',
    },
    {
        name: 'Garantía',
        selector: 'warranty',
        sortable: true,
        hide: 'md',
    },
    {
        name: 'Precio',
        selector: 'price',
        sortable: true,
        hide: 'md',
        cell: row => (
          <span>
            {(money_format(row.country, row.price))}
          </span>
        ),
    }
    
    
];

function getSpareParts(customer_product_id, visit_id, setUserLoading) {
    return dispatch => {
        dispatch({type: GET_SELECTED_SPARE_PARTS_REQUEST});
        return fetch(`/api/v1/customer_products/${customer_product_id}/customer_product_requested_spare_parts?visit_id=${visit_id}`)
        .then(response => response.json())
        .then(json => dispatch(getSparePartsSuccess(json)) && setUserLoading(false))
        .catch(error => console.log(error) && setUserLoading(false));
    };
};
export function getSparePartsSuccess(json) {
    return {
        type: GET_SELECTED_SPARE_PARTS_SUCCESS,
        json
    };
};


function VisitRequestedSpareParts(props){
    const {t} = useTranslation();
    const [checked, setChecked] = useState((props.visit.customer_products.length > 0 && props.visit.customer_products[0].id || ""));
    const [selectedCustomerProduct, setSelectedCustomerProduct] = useState((props.visit.customer_products && props.visit.customer_products[0] || {}));
    const [userLoading, setUserLoading] = useState(false);
    
    useEffect(() => {
        setUserLoading(true)
        if(selectedCustomerProduct){
            props.getSpareParts(selectedCustomerProduct.id, props.visit.id , setUserLoading);
        }
        setUserLoading(false)
    }, [selectedCustomerProduct]);

    function handleToggle(customer_product){
        setChecked(customer_product.id)
        setSelectedCustomerProduct(customer_product)
    }

	return (
		<React.Fragment>
            <p className="service-subtitle">{t('services.visits.productTableInfo.requestSpareParts')}</p>
            <List>
                {props.visit.customer_products && props.visit.customer_products.map((customer_product) => {
                    const listId = `list-visit-products-${props.visit.id}-${customer_product.id}`;
                    const labelId = `visit-products-${props.visit.id}-${customer_product.id}`;

                    return (
                    <ListItem key={listId} role={undefined} dense button onClick={() => handleToggle(customer_product)}>
                        <ListItemIcon className="service-address-label">
                        <FormControlLabel value={customer_product.id} control={<Radio color="primary"/>} label="" checked={checked == customer_product.id}
                            tabIndex={-1}
                        />
                        </ListItemIcon>
                        <ListItemText 
                            id={labelId}
                            secondary={
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={4}>
                                        <span className="visit-summary-1">{t('services.visits.productTableInfo.name')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.product.name}</span>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <span className="visit-summary-1">{t('services.visits.productTableInfo.tnr')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.product.tnr}</span>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <span className="visit-summary-1">{t('services.visits.productTableInfo.id')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.serial_id}</span>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <span className="visit-summary-1">{t('services.visits.productTableInfo.status')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.status}</span>
                                    </Grid>
                                </Grid>
                            } 
                        />
                        
                    
                        <ListItemSecondaryAction>
                        
                        </ListItemSecondaryAction>
                    </ListItem>
                    );
                })}
                
                </List>
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
                            highlightOnHover={true}
                            striped={true}
                            noDataComponent={i18next.t('globalText.NoDataComponent')}
                            paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                        />
                    </Grid>
                </Grid>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
    spare_parts: state => state.selected_spare_parts,
    page: state => state.page,
    perPage: state => state.perPage,
    total: state => state.total,
    current_user: state => state.current_user,
});
const mapDispatchToProps = {getSpareParts};
export default connect(structuredSelector, mapDispatchToProps)(VisitRequestedSpareParts)

