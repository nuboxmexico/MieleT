import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MaterialTable from 'react-data-table-component';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next"
import i18next from 'i18next';

import {csrf, headers,money_format, date_format_without_time, date_format_without_time_and_zone} from "constants/csrf"
import { useTransition } from 'react';

const spare_part_columns = [
    {
      name: i18next.t('globalTables.sparePartColumns.tnr'),
      selector: 'service_spare_part.spare_part.tnr',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.name'),
      selector: 'service_spare_part.spare_part.name',
      sortable: true,
    },
    {
        name: i18next.t('globalTables.sparePartColumns.quantity'),
        selector: 'quantity',
        sortable: true,
        hide: 'md',
    },
    {
        name: i18next.t('globalTables.sparePartColumns.warranty'),
        selector: 'warranty',
        sortable: true,
        hide: 'md',
    },
    {
        name: i18next.t('globalTables.sparePartColumns.price'),
        selector: 'price',
        sortable: true,
        hide: 'md',
        cell: row => (
          <span>
            {row.service_spare_part && (money_format(row.service_spare_part.country, row.service_spare_part.price))}
          </span>
        ),
    }
    
    
];

const GET_USED_SPARE_PARTS_REQUEST = "GET_USED_SPARE_PARTS_REQUEST";
const GET_USED_SPARE_PARTS_SUCCESS = "GET_USED_SPARE_PARTS_SUCCESS";

function getSpareParts(customer_product_id, visit_id, setUserLoading) {
    return dispatch => {
        dispatch({type: GET_USED_SPARE_PARTS_REQUEST});
        return fetch(`/api/v1/customer_products/${customer_product_id}/customer_product_used_spare_parts?visit_id=${visit_id}`)
        .then(response => response.json())
        .then(json => dispatch(getSparePartsSuccess(json)) && setUserLoading(false))
        .catch(error => console.log(error) && setUserLoading(false));
    };
};
export function getSparePartsSuccess(json) {
    return {
        type: GET_USED_SPARE_PARTS_SUCCESS,
        json
    };
};



function VisitUsedSpareParts(props){
    const {t} = useTranslation();
    const [checked, setChecked] = useState((props.visit.customer_products.length > 0 && props.visit.customer_products[0].id || ""));
    const [selectedCustomerProduct, setSelectedCustomerProduct] = useState((props.visit.customer_products && props.visit.customer_products[0] || {}));
    const [userLoading, setUserLoading] = useState(false);
    const [selectedCustomerProductSpareParts, setSelectedCustomerProductSpareParts] = useState([])
    

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
                <p className="service-subtitle">{t('services.visits.productTableInfo.useSpareParts')}</p>
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
                                noDataComponent={i18next.t('globalText.NoDataComponent')}
                                paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                            />
                    </Grid>
                </Grid>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
    spare_parts: state => state.used_spare_parts,
    current_user: state => state.current_user,
});

const mapDispatchToProps = {getSpareParts};

export default connect(structuredSelector, mapDispatchToProps)(VisitUsedSpareParts)

