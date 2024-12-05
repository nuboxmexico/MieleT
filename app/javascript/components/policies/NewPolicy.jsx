import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import ShowCustomer from "components/customers/ShowCustomer";
import PolicyForm from "components/policies/PolicyForm";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';

function NewPolicy(props){
    const {t} = useTranslation();
    // Customer Info
    const [customer_id, setCustomerId] = useState("");
    const [customerNames, setCustomerFirstname] = useState("");
    const [customerLastname, setCustomerLastname] = useState("");
    const [customerSurname, setCustomerSurname] = useState("");
    const [customer, setCustomer] = useState("");
    
    const [redirect, setRedirect] = useState(false);
    const [country, setCountry] = useState("MX");
    
    // Policy info
    const [laborPrice, setlaborPrice] = useState(0.0);
    const [itemsPrice, setItemsPrice] = useState(0.0);
    const [viaticPrice, setViaticPrice] = useState(0.0);
    const [ivaAmount, setIVAAmount] = useState(0.0);
    const [subtotalPrice, setSubTotalPrice] = useState(0.0);
    const [totalPrice, setTotalPrice] = useState(0.0);
    const [policyItemsRows, setPolicyItemsRows] = useState([]);
    const [checkedAddress, setCheckedAddress] = React.useState("principal");
    // Products
    const [products, setProducts] = useState([]);
    const [selectedProductRows, setSelectedProductRows] = useState([]);
    const [countryIVA, setCountryIVA] = useState(0.16);
    useEffect(() => {
        async function fetchData() {
            let userId = props.match.params.id;
                return fetch(`/api/v1/customers/${userId}`)
                    .then(response => response.json())
                    .then(json => {
                        setCustomer(json.data)
                        setCustomerId(json.data.id)
                        setCustomerFirstname(json.data.names)
                        setCustomerLastname(json.data.lastname)
                        setCustomerSurname(json.data.surname)
                        if(json.data.country != null){
                            setCountry(json.data.country.iso)
                            setCountryIVA(json.data.country.iva)
                        }
                        setProducts(json.data.customer_products)
                    })
                    .catch(error => console.log(error));
            }
            fetchData();
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        var body = new FormData();
        body.set('customer_id', customer_id);
        body.set('customer_products_id', selectedProductRows.map(function(product_row) {
            return (product_row.id);
        }));
        body.set('address_assinged', checkedAddress);
        body.set('labor_price', laborPrice);
        body.set('items_price', itemsPrice);
        body.set('viatic_price', viaticPrice);
        body.set('iva_amount', ivaAmount);
        body.set('subtotal_price', subtotalPrice);
        body.set('total_price', totalPrice);
        return axios.post(`/api/v1/customers/${customer_id}/create_policy`, body, { headers: props.headers})
            .then(response => {
                flash_alert(t('customer.newService.flashAlert.created'), t('customer.newService.flashAlert.policyCreatedSuccess'), "success")
                setRedirect(true);
            })
        .catch(e => {
            console.log(e.response.data);
            if(e.response.data){
                for (var key in e.response.data) {
                    flash_alert(t('customer.newService.flashAlert.error'), e.response.data[key], "danger")
                }
            }
        });
    }

    let redirect_check = []
	if (redirect){
		redirect_check.push(
			<Redirect key="redirect-to-customers" to={`/customers/${customer_id}/show`}><ShowCustomer setLoading={props.setLoading} headers={props.headers} match={props.match} /></Redirect>
		);
	}

  	return (
  		<React.Fragment>
            {redirect_check}
            
            <Paper className="custom-paper">
                <Grid container spacing={3}>
                    <Link className="mdl-navigation__link  back-link customers-edit-link" to={`/customers/${customer_id}/show`}>
                      <i className="material-icons">keyboard_arrow_left</i> {t('globalText.back')}
                    </Link>
                    <Grid item xs={12}>
                          <h1>{t('customer.newPolicy.title')} {customerNames} {customerLastname} {customerSurname}</h1>
                    </Grid>
                </Grid>
                <PolicyForm
                    // Customer
                    customer_id={customer_id}
                    country={country}
                    setCustomerId={setCustomerId}
                    handleSubmit={handleSubmit}
                    customer={customer}
                    setCustomer={setCustomer}
                    checkedAddress={checkedAddress}
                    setCheckedAddress={setCheckedAddress}
                    // Products
                    products={products}
                    setProducts={setProducts}
                    selectedProductRows={selectedProductRows}
                    setSelectedProductRows={setSelectedProductRows}
                    policyItemsRows={policyItemsRows}
                    setPolicyItemsRows={setPolicyItemsRows}
                    // Prices
                    countryIVA={countryIVA}
                    laborPrice={laborPrice}
                    setlaborPrice={setlaborPrice}
                    itemsPrice={itemsPrice}
                    setItemsPrice={setItemsPrice}
                    viaticPrice={viaticPrice}
                    setViaticPrice={setViaticPrice}
                    ivaAmount={ivaAmount}
                    setIVAAmount={setIVAAmount}
                    subtotalPrice={subtotalPrice}
                    setSubTotalPrice={setSubTotalPrice}
                    totalPrice={totalPrice}
                    setTotalPrice={setTotalPrice}
                />
            </Paper>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(NewPolicy)
