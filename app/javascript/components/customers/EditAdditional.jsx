import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import ShowCustomer from "components/customers/ShowCustomer";
import AdditionalForm from "components/customers/AdditionalForm";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from 'react-i18next';

function EditAdditional(props){
    const {t} = useTranslation();

    // Customer Info
    const [customerNames, setCustomerFirstname] = useState("");
    const [customerLastname, setCustomerLastname] = useState("");
    const [customerSurname, setCustomerSurname] = useState("");

    // Additional Info
    const [add_id, setAddId] = useState("");
    const [customer_id, setCustomerId] = useState("");
    const [names, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [surname, setSurname] = useState("");  
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [country, setCountry] = useState("MX");
    useEffect(() => {
        async function fetchData() {
            let userId = props.match.params.id;
            let id_ad =  props.match.params.id_ad;
            
                return fetch(`/api/v1/customers/${userId}`)
                    .then(response => response.json())
                    .then(json => {
                        setCustomerId(json.data.id)
                        setCustomerFirstname(json.data.names)
                        setCustomerLastname(json.data.lastname)
                        setCustomerSurname(json.data.surname)
                        if(json.data.country != null){
                            setCountry(json.data.country.iso)
                        }
                        var current_additional = json.data.additionals.find(additional => String(additional.id) === id_ad);
                        if (current_additional !== undefined){
                            setAddId(current_additional.id)
                            setCustomerId(current_additional.customer_id)
                            setFirstname(current_additional.names)
                            setLastname(current_additional.lastname)
                            setSurname(current_additional.surname)
                            setEmail(current_additional.email)
                            setPhone(current_additional.phone)
                            setCellphone(current_additional.cellphone)
                        }
                    })
                    .catch(error => console.log(error));
            }
            fetchData();
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        var body = new FormData();
        body.set('customer_id', customer_id);
        body.set('names', names);
        body.set('lastname', lastname);
        body.set('surname', surname);
        body.set('email', email);
        body.set('phone', phone);
        body.set('cellphone', cellphone);
        return axios.patch(`/api/v1/customersAdditional/${add_id}`, body, { headers: props.headers})
            .then(response => {
                flash_alert(t('globalEditForm.flashAlert.created'), t('globalEditForm.flashAlert.additionalCustomerUpdate'), "success")
                setRedirect(true);
            })
        .catch(e => {
            console.log(e.response.data);
            if(e.response.data){
                for (var key in e.response.data) {
                    flash_alert(t('globalEditForm.flashAlert.error'), e.response.data[key], "danger")
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
                          <h1>{t('globalEditForm.title#6')} {customerNames} {customerLastname} {customerSurname}</h1>
                    </Grid>
                </Grid>
                <AdditionalForm
                    customer_id={customer_id}
                    names={names}
                    lastname={lastname}
                    surname={surname}
                    email={email}
                    phone={phone}
                    cellphone={cellphone}
                    country={country}
                    setCustomerId={setCustomerId}
                    setFirstname={setFirstname}
                    setLastname={setLastname}
                    setSurname={setSurname}
                    setEmail={setEmail}
                    setPhone={setPhone}
                    setCellphone={setCellphone}
                    handleSubmit={handleSubmit}
                />
            </Paper>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(EditAdditional)
