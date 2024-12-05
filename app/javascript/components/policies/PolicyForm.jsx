import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import ShowCustomer from "components/customers/ShowCustomer";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import MaterialTable from 'react-data-table-component';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import {country_names_g} from 'components/customers/CustomerForm';
import {money_format, isFloat, isInt} from "constants/csrf"
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const product_columns = [
    {
      name: i18next.t('globalTables.productsColumns.model'),
      selector: 'product.product_type',
      sortable: true
    },
    {
      name: i18next.t('globalTables.productsColumns.tnr'),
      selector: 'product.tnr',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.productsColumns.name'),
      selector: 'product.name',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.productsColumns.policy'),
      selector: 'policy',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.productsColumns.status'),
      selector: 'status',
      sortable: true,
      hide: 'md',
    }
];


function PolicyForm(props){
    const {t} = useTranslation();
    const handleAddressToggle = (value) => () => {
      props.setCheckedAddress(value);
      handleAddressChange(value);
    };

    useEffect(() => {
        if(props.customer){
            console.log(props.customer)
            if(props.customer.address != ""){
                handleAddressChange(props.customer.address)

            }else{
                if(props.customer.administrative_demarcation){
                    var zone_name = props.customer.zipcode
                    if(props.customer.country.iso == "CL"){
                        zone_name =  props.customer.administrative_demarcation.admin_name_3
                    }
                    fetchViatics(props.customer.country.iso, zone_name)
                }
            }
        }
    }, [props.customer]);


    useEffect(() => {
        getTotalPrice();
    }, [props.laborPrice]);


    useEffect(() => {
        getTotalPrice();
    }, [props.itemsPrice]);

    useEffect(() => {
        getTotalPrice();
    }, [props.viaticPrice]);

    function getTotalPrice(){
        let total_price = 0;
        
        if(isFloat(props.laborPrice) || isInt(props.laborPrice)) {
            total_price = total_price + props.laborPrice
        }

        if(isFloat(props.itemsPrice) || isInt(props.itemsPrice)) {
            total_price = total_price + props.itemsPrice
        }

        if(isFloat(props.viaticPrice) || isInt(props.viaticPrice)) {
            total_price = total_price + props.viaticPrice
        }
        props.setSubTotalPrice(total_price)
        props.setIVAAmount(total_price*props.countryIVA)
        props.setTotalPrice(total_price*(props.countryIVA + 1))
    }


    function handleProductRowChange(state){
        
        props.setSelectedProductRows(state.selectedRows);
        if(props.customer){
            fetchLaborPrices(props.customer.country.iso, state.selectedRows.length)
            fetchConsumables(props.customer.country.iso, state.selectedRows.map(function(product_row){return (product_row.id)}).join(","))
        }
    }

    function handleAddressChange(value){
        if(props.customer){
            if(value == "principal"){
                if(props.customer.administrative_demarcation){
                    var zone_name = props.customer.zipcode
                    if(props.customer.country.iso == "CL"){
                        zone_name =  props.customer.administrative_demarcation.admin_name_3
                    }
                    fetchViatics(props.customer.country.iso, zone_name)
                }
            }else{
                if(props.customer.additional_addresses){
                    var addresss_t = props.customer.additional_addresses.find(additional_address => additional_address.id == value);
                    if(addresss_t){
                        var zone_name = addresss_t.zipcode
                        if(props.customer.country.iso == "CL"){
                            zone_name =  addresss_t.administrative_demarcation.admin_name_3
                        }
                        fetchViatics(addresss_t.country.iso, zone_name)
                    }
                }
            }

        }
    }
     

    function fetchViatics(country_code, zone){
        return fetch(`/api/v1/viatic_values?country=${country_code}&zone=${zone}`)
          .then(response => response.json())
          .then(json => {
            console.log(json)
            if(json.data.length > 0){
                props.setViaticPrice(json.data[0].amount)
            }else{
                props.setViaticPrice("Indefinido")
            }
          })
          .catch(error => console.log(error));
    }

    function fetchLaborPrices(country_code, units){
        return fetch(`/api/v1/labor_prices?country=${country_code}&units=${units}`)
          .then(response => response.json())
          .then(json => {
            if(json.data.length > 0){
                props.setlaborPrice(json.data[0].amount)
            }else{
                props.setlaborPrice("Indefinido")
            }
          })
          .catch(error => console.log(error));
    }

    function fetchConsumables(country_code, products_ids){
        return fetch(`/api/v1/consumables?products_ids=${products_ids}&country=${country_code}`)
          .then(response => response.json())
          .then(json => {
            props.setItemsPrice(json.data.total_consumable_amount)
            props.setPolicyItemsRows(json.data.items)
          })
          .catch(error => console.log(error));
    }


    return (
        <React.Fragment>
              <form className="custom-form" onSubmit={props.handleSubmit} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} autoComplete="off">
                  
                  <Grid container spacing={3}>


                        <Grid item xs={12}>
                            <p className="service-p">{t('customer.newPolicy.addressPolicy')}</p>

                            <List>
                                <ListItem key="principal" role={undefined} dense button onClick={handleAddressToggle("principal")}>
                                    <ListItemIcon className="service-address-label">
                                    <FormControlLabel value="principal" control={<Radio color="primary"/>} label="" checked={props.checkedAddress == "principal"}
                                        tabIndex={-1}
                                    />
                                    
                                    </ListItemIcon>
                                    <ListItemText 
                                        id={"radio-address-list-label-principal"} 
                                        primary= {"Principal"}
                                        secondary={`${props.customer.street_type} ${props.customer.street_name}, ${props.customer.ext_number} ${props.customer.int_number}, ${props.customer.administrative_demarcation != null ?  props.customer.administrative_demarcation.admin3_admin1 : props.customer.state}${props.customer.zipcode != "" ? (", Código Postal: " + props.customer.zipcode) : "" }`}
                                    />
                                    <ListItemSecondaryAction>
                                    
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {props.customer.additional_addresses && props.customer.additional_addresses.map((additional_address) => {
                                    const labelId = `radio-address-list-label-${additional_address.id}`;
                                    return (
                                    <ListItem key={additional_address.id} role={undefined} dense button onClick={handleAddressToggle(additional_address.id)}>
                                        <ListItemIcon className="service-address-label">
                                        <FormControlLabel value={additional_address.id} control={<Radio color="primary"/>} label="" checked={props.checkedAddress == additional_address.id}
                                            tabIndex={-1}
                                        />
                                        
                                        </ListItemIcon>
                                        <ListItemText 
                                            id={labelId}
                                            primary={additional_address.name}
                                            secondary={`${additional_address.street_type} ${additional_address.street_name}, ${additional_address.ext_number} ${additional_address.int_number}, ${additional_address.administrative_demarcation != null ?  additional_address.administrative_demarcation.admin3_admin1 : additional_address.state}${additional_address.zipcode != "" ? (", Código Postal: " + additional_address.zipcode) : "" }`} 
                                        />
                                        <ListItemSecondaryAction>
                                        
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    );
                                })}
                                </List>

                        </Grid>

                        <Grid item xs={12}>
                            <p className="service-p">{t('customer.newPolicy.addProductPolicy')}</p>
                            {props.customer && <MaterialTable
                                className="customer-products-table"
                                title=""
                                columns={product_columns}
                                data={props.products}
                                responsive={true}
                                onSelectedRowsChange={handleProductRowChange}
                                highlightOnHover={true}
                                striped={true}
                                noDataComponent={i18next.t('globalText.NoDataComponent')}
                                paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                                selectableRows
                                selectableRowsComponent={Checkbox}
                                selectableRowSelected={row => (props.selectedProductRows.find(product => product.id === row.id) != undefined) }
                                selectableRowsComponentProps={{ color: "primary" }}
                                contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                            />
                            }
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <h2 className="policy-custom-subtitle">{t('customer.newPolicy.consumableList')}</h2>
                            <ul className="policy-item-list">
                            
                                {props.policyItemsRows && props.policyItemsRows.map((policy_item) => {
                                    return (
                                        <li key={policy_item.consumable.id} >{policy_item.consumable.name} x {policy_item.total_boxes}</li>
                                    );
                                })}
                            </ul>
                        </Grid>

                        <Grid item xs={12} sm={8} container>
                            <Grid container spacing={3}>
                                <Grid className="policy-table-container" item xs={12}>
                                    <h2 className="policy-custom-subtitle">{t('customer.newPolicy.policyDetails')}</h2>
                                    
                                    <table className="policy-item-table">
                                        <tbody>   
                                            <tr>
                                                <td>{t('customer.newService.paymentService.serviceDetails.laborAmount')}</td>
                                                <td>{money_format(props.country,props.laborPrice)}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('customer.newService.paymentService.serviceDetails.consumables')}</td>
                                                <td>{money_format(props.country,props.itemsPrice)}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('customer.newService.paymentService.serviceDetails.viaticAmount')}</td>
                                                <td>{money_format(props.country,props.viaticPrice)}</td>
                                            </tr>
                                            
                                            <tr>
                                                <td>{t('customer.newService.paymentService.serviceDetails.laborAmount')}</td>
                                                <td>{money_format(props.country,props.subtotalPrice)}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('customer.newService.paymentService.serviceDetails.ivaAmount')}</td>
                                                <td>{money_format(props.country,props.ivaAmount)}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('customer.newService.paymentService.serviceDetails.totalAmount')}</td>
                                                <td>{money_format(props.country,props.totalPrice)}</td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </Grid>
                                <Grid className="policy-table-buttons" item xs={12}>
                                    <FormControl>
                                        <Button id="policy-save" type="submit" variant="outlined" color="primary">
                                            {t('customer.newPolicy.createPolicyButton')}
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>	
                  </Grid>
              </form>
      </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(PolicyForm)
