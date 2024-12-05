import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import ShowCustomer from "components/customers/ShowCustomer";
import AdditionalAddressForm from "components/customers/AdditionalAddressForm";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from 'react-i18next';

function NewAdditionalAddress(props){
    const {t} = useTranslation();

    // Customer Info
    const [customerNames, setCustomerFirstname] = useState("");
    const [customerLastname, setCustomerLastname] = useState("");
    const [customerSurname, setCustomerSurname] = useState("");

    // Additional AddressInf

    const [customer_id, setCustomerId] = useState("");
    const [name, setName] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [state, setState] = useState("");
    const [delegation, setDelegation] = useState("");
    const [colony, setColony] = useState("");
    const [street_type, setStreettype] = useState("");
    const [street_name, setStreetName] = useState("");
    const [ext_number, setExtNumber] = useState("");
    const [int_number, setIntNumber] = useState("");
    const [country, setCountry] = useState("MX");
	  const [selectedPerson, setSelectedPerson] = useState("person_p");
    const [redirect, setRedirect] = useState(false);
    
      // administrative_demarcations
	  const [administrativeDemarcations, setAdministrativeDemarcations] = useState([{value: "", label: ""}]);
    const [administrativeDemarcationsValue, setAdministrativeDemarcationsValue] = useState({value: "", label: ""});
    
    // colonies
	  const [colonies, setColonies] = useState([{value: "", label: ""}]);
	  const [coloniesValue, setColoniesValue] = useState({value: "", label: ""});
    const [zipcodeParentRequired, setZipcodeParentRequired] = useState(false);
    

	
    useEffect(() => {
        async function fetchData() {
            let userId = props.match.params.id;
                return fetch(`/api/v1/customers/${userId}`)
                    .then(response => response.json())
                    .then(json => {
                        setCustomerId(json.data.id)
                        setCustomerFirstname(json.data.names)
                        setCustomerLastname(json.data.lastname)
                        setCustomerSurname(json.data.surname)
                        setSelectedPerson(json.data.person_type)
                        if(json.data.country != null){
                            setCountry(json.data.country.iso)
                        }
                        setZipcode(json.data.zipcode)
                        fetchadministrativeDemarcationsData(json.data.country.iso, json.data.state, json.data.zipcode, json.data.colony)
                    })
                    .catch(error => console.log(error));
            }
            fetchData();

    }, []);



    function fetchadministrativeDemarcationsData(country_code, state_code, zipcode_params,colony_code){
		var zipcode_t = ((zipcode_params != "") ? zipcode_params : "")
		return fetch(`/api/v1/administrative_demarcations?keywords=${country_code}&zipcode=${zipcode_t}`)
		  .then(response => response.json())
		  .then(json => {
			console.log(json);
			var new_admin_data = json.data.map(
			  function(administrativeDemarcation) {
				var place_name = administrativeDemarcation.admin3_admin1
				if (administrativeDemarcation.country_code != "CL"){
				  place_name = (administrativeDemarcation.admin_name_3 != null ? administrativeDemarcation.admin_name_3 : administrativeDemarcation.admin_name_1)
          
				  if (zipcode_params != ""){
					setState(administrativeDemarcation.id)
					setAdministrativeDemarcationsValue({ value: administrativeDemarcation.id, label: place_name })
					setDelegation(administrativeDemarcation.admin_name_2)
					setColony(administrativeDemarcation.place_name)
				  }  
				}
				if(state_code == administrativeDemarcation.id){
				  setAdministrativeDemarcationsValue({ value: administrativeDemarcation.id, label: place_name })
				}
				
				if(colony_code == administrativeDemarcation.place_name){
					setColoniesValue({ value: administrativeDemarcation.id, label: place_name })
				}
				
				return { value: administrativeDemarcation.id, label: place_name };
			  }
			);
			const unique_new_admin_data = new_admin_data.filter((v,i,a)=>a.findIndex(t=>(t.label === v.label))===i)
			
			setAdministrativeDemarcations(unique_new_admin_data)
			
			if (country_code != "CL"){
			  var colonies_data = json.data.map(
				function(administrativeDemarcation) {
				  var place_name = administrativeDemarcation.place_name
	
				  if(colony == administrativeDemarcation.place_name){
					setColoniesValue({ value: administrativeDemarcation.id, label: place_name })
				  }
				  return { value: administrativeDemarcation.id, label: place_name };
				}
			  );
			  if (zipcode_params != ""){
				setColonies(colonies_data);
			  }
			  if (zipcodefn_params != ""){
				setColoniesFN(colonies_data)
			  }
			}
		  })
		  .catch(error => console.log(error));
	  }


    function handleSubmit(event) {
        event.preventDefault();
        var body = new FormData();
        body.set('customer_id',customer_id);
        body.set('name',name);
        body.set('zipcode',zipcode);
        body.set('state',state);
        body.set('delegation',delegation);
        body.set('colony',colony);
        body.set('street_type',street_type);
        body.set('street_name',street_name);
        body.set('ext_number',ext_number);
        body.set('int_number',int_number);
        body.set('country',country);
        return axios.post('/api/v1/customersAdditionalAddress', body, { headers: props.headers})
            .then(response => {
                flash_alert(t('globalEditForm.flashAlert.created'), t('globalEditForm.flashAlert.createdSuccessfully'), "success")
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
                          <h1>{t('globalEditForm.title#5')} {customerNames} {customerLastname} {customerSurname}</h1>
                    </Grid>
                </Grid>
                <AdditionalAddressForm
                    customer_id={customer_id}
                    name={name}
                    zipcode={zipcode}
                    state={state}
                    delegation={delegation}
                    colony={colony}
                    street_type={street_type}
                    street_name={street_name}
                    ext_number={ext_number}
                    int_number={int_number}
                    country={country}
                    administrativeDemarcations={administrativeDemarcations}
                    administrativeDemarcationsValue={administrativeDemarcationsValue}
                    selectedPerson={selectedPerson}
                    setCustomerId={setCustomerId}
                    setName={setName}
                    setZipcode={setZipcode}
                    setState={setState}
                    setDelegation={setDelegation}
                    setColony={setColony}
                    setStreettype={setStreettype}
                    setStreetName={setStreetName}
                    setExtNumber={setExtNumber}
                    setIntNumber={setIntNumber}
                    setCountry={setCountry}
                    setAdministrativeDemarcations={setAdministrativeDemarcations}
                    setAdministrativeDemarcationsValue={setAdministrativeDemarcationsValue}
                    fetchadministrativeDemarcationsData={fetchadministrativeDemarcationsData}
                    setSelectedPerson={setSelectedPerson}
                    handleSubmit={handleSubmit}

                    // colonies
                    colonies={colonies}
                    setColonies={setColonies}
                    coloniesValue={coloniesValue}
                    setColoniesValue={setColoniesValue}
                    
                    zipcodeParentRequired={zipcodeParentRequired}
                    setZipcodeParentRequired={setZipcodeParentRequired}
                />
            </Paper>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(NewAdditionalAddress)
