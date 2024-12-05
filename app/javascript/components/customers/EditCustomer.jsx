import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import Customers from "components/customers/Customers"
import CustomerForm from "components/customers/CustomerForm"
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import {useTranslation} from "react-i18next"

function EditCustomer(props) {
	const {t} = useTranslation();
	const [names, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [surname, setSurname] = useState("");
	const [email, setEmail] = useState("");
	const [zipcode, setZipcode] = useState("");
	const [state, setState] = useState("");
	const [delegation, setDelegation] = useState("");
	const [colony, setColony] = useState("");
	const [street_type, setStreettype] = useState("");
	const [street_name, setStreetName] = useState("");
	const [ext_number, setExtNumber] = useState("");
	const [int_number, setIntNumber] = useState("");
	const [phone, setPhone] = useState("");
	const [cellphone, setCellphone] = useState("");
	const [reference, setReference] = useState("");
	const [business_name, setBusinessName] = useState("");
	const [rfc, setRFC] = useState("");
	const [email_fn, setEmailFn] = useState("");
	const [zipcode_fn, setZipcodeFn] = useState("");
	const [state_fn, setStateFn] = useState("");
	const [delegation_fn, setDelegationFn] = useState("");
	const [colony_fn, setColonyFn] = useState("");
	const [street_type_fn, setStreettypeFn] = useState("");
	const [street_name_fn, setStreetNameFn] = useState("");
	const [ext_number_fn, setExtNumberFn] = useState("");
	const [int_number_fn, setIntNumberFn] = useState("");
	const [phone_fn, setPhoneFn] = useState("");
	const [selectedPerson, setSelectedPerson] = useState("person_p");
	const [redirect, setRedirect] = useState(false);
	const [country, setCountry] = useState("MX");
	const [rut, setRut] = useState("");
	const [email2, setEmail2] = useState("");
	const [commercial_business, setCommercialBusiness] = useState("");
	const [tradename, setTradename] = useState("");

	// administrative_demarcations
	const [administrativeDemarcations, setAdministrativeDemarcations] = useState([{value: "", label: ""}]);
	const [administrativeDemarcationsFN, setAdministrativeDemarcationsFN] = useState([{value: "", label: ""}]);
	const [administrativeDemarcationsValue, setAdministrativeDemarcationsValue] = useState({value: "", label: ""});
	const [administrativeDemarcationsFNValue, setAdministrativeDemarcationsFNValue] = useState({value: "", label: ""});

	// colonies
	const [colonies, setColonies] = useState([{value: "", label: ""}]);
	const [coloniesFN, setColoniesFN] = useState([{value: "", label: ""}]);
	const [coloniesValue, setColoniesValue] = useState({value: "", label: ""});
	const [coloniesFNValue, setColoniesFNValue] = useState({value: "", label: ""});
	
	
	const [zipcodeParentRequired, setZipcodeParentRequired] = useState(false);

	const [loading, setLoading] = React.useState(false);

	const [admDemloading, setAdmDemloading] = useState(false);

	useEffect(() => {

		async function fetchData() {
			let userId = props.match.params.id;
			return fetch(`/api/v1/customers/${userId}`)
				.then(response => response.json())
				.then(json => {
					console.log(json)
					setFirstname(json.data.names)
					setLastname(json.data.lastname)
					setSurname(json.data.surname)
					setEmail(json.data.email)
					setZipcode(json.data.zipcode)
					setState(json.data.state)
					setDelegation(json.data.delegation)
					setColony(json.data.colony)
					setStreettype(json.data.street_type)
					setStreetName(json.data.street_name)
					setExtNumber(json.data.ext_number)
					setIntNumber(json.data.int_number)
					setPhone(json.data.phone)
					setCellphone(json.data.cellphone)
					setReference(json.data.reference)
					setBusinessName(json.data.business_name)
					setRFC(json.data.rfc)
					setEmailFn(json.data.email_fn)
					setZipcodeFn(json.data.zipcode_fn)
					setStateFn(json.data.state_fn)
					setDelegationFn(json.data.delegation_fn)
					setColonyFn(json.data.colony_fn)
					setStreettypeFn(json.data.street_type_fn)
					setStreetNameFn(json.data.street_name_fn)
					setExtNumberFn(json.data.ext_number_fn)
					setIntNumberFn(json.data.int_number_fn)
					setPhoneFn(json.data.phone_fn)
					setSelectedPerson(json.data.person_type)
					if(json.data.country != null){
						setCountry(json.data.country.iso)
					}
					setRut(json.data.rut)
					setEmail2(json.data.email2)
					setCommercialBusiness(json.data.commercial_business)
					setTradename(json.data.tradename)

					// administrative Demarcations Data
					fetchadministrativeDemarcationsData(
						json.data.country.iso,
						json.data.state,
						json.data.state_fn,
						json.data.zipcode,
						json.data.zipcode_fn,
						json.data.colony,
						json.data.colony_fn
					)
				})
				.catch(error => console.log(error));
		}
		fetchData();
	}, []);


	function fetchadministrativeDemarcationsData(country_code, state_code, state_code_fn, zipcode_params, zipcodefn_params, colony_code, colony_code_fn){
		setAdmDemloading(true);
		var zipcode_t = ((zipcode_params != "" && zipcode_params != "null") ? zipcode_params : zipcodefn_params)
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
					//setColony(administrativeDemarcation.place_name)
				  }
				  if (zipcodefn_params != ""){
					setStateFn(administrativeDemarcation.id)
					setAdministrativeDemarcationsFNValue({ value: administrativeDemarcation.id, label: place_name })
					setDelegationFn(administrativeDemarcation.admin_name_2)
					//setColonyFn(administrativeDemarcation.place_name)
				  }  
				}
				if(state_code == administrativeDemarcation.id){
				  setAdministrativeDemarcationsValue({ value: administrativeDemarcation.id, label: place_name })
				}
				if(state_code_fn == administrativeDemarcation.id){
				  setAdministrativeDemarcationsFNValue({ value: administrativeDemarcation.id, label: place_name })
				}

				if(colony_code == administrativeDemarcation.place_name){
					setColoniesValue({ value: administrativeDemarcation.id, label: administrativeDemarcation.place_name })
				}
				if(colony_code_fn == administrativeDemarcation.place_name){
					setColoniesFNValue({ value: administrativeDemarcation.id, label: administrativeDemarcation.place_name })
				}
				return { value: administrativeDemarcation.id, label: place_name };
			  }
			);
			const unique_new_admin_data = new_admin_data.filter((v,i,a)=>a.findIndex(t=>(t.label === v.label))===i)
			
			setAdministrativeDemarcations(unique_new_admin_data)
			setAdministrativeDemarcationsFN(unique_new_admin_data)
	
			if (country_code != "CL"){
			  var colonies_data = json.data.map(
				function(administrativeDemarcation) {
				  var place_name = administrativeDemarcation.place_name
	
				  if(colony == administrativeDemarcation.place_name){
					setColoniesValue({ value: administrativeDemarcation.id, label: place_name })
				  }
				  if(colony_fn == administrativeDemarcation.place_name){
					setColoniesFNValue({ value: administrativeDemarcation.id, label: place_name })
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
			setAdmDemloading(false);
		
		  })
		  .catch(error => console.log(error));
	  }


	function handleSubmit(event) {
		event.preventDefault();
		var body = new FormData();
		body.set('names', names);
		body.set('lastname', lastname);
		body.set('surname', surname);
		body.set('email', email);
		body.set('zipcode', zipcode);
		body.set('state', state);
		body.set('delegation', delegation);
		body.set('colony', colony);
		body.set('street_type', street_type);
		body.set('street_name', street_name);
		body.set('ext_number', ext_number);
		body.set('int_number', int_number);
		body.set('phone', phone);
		body.set('cellphone', cellphone);
		body.set('reference', reference);
		body.set('business_name', business_name);
		body.set('rfc', rfc);
		body.set('email_fn', email_fn);
		body.set('zipcode_fn', zipcode_fn);
		body.set('state_fn', state_fn);
		body.set('delegation_fn', delegation_fn);
		body.set('colony_fn', colony_fn);
		body.set('street_type_fn', street_type_fn);
		body.set('street_name_fn', street_name_fn);
		body.set('ext_number_fn', ext_number_fn);
		body.set('int_number_fn', int_number_fn);
		body.set('phone_fn', phone_fn);
		body.set('person_type', selectedPerson);
		body.set('country', country);
		body.set('rut', rut);
		body.set('email2', email2);
		body.set('commercial_business', commercial_business);
		body.set('tradename', tradename);

		return axios.patch(`/api/v1/customers/${props.match.params.id}`, body, { headers: props.headers })
			.then(response => {
				flash_alert("Actualizado!", "El cliente se ha actualizado correctamente", "success")
				setRedirect(true);
			})
			.catch(e => {
				console.log(e.response.data);
				setLoading(false)
				if (e.response.data) {
					for (var key in e.response.data) {
						flash_alert("Error", e.response.data[key], "danger")
					}
				}
			});
	}

	let redirect_check = []
	if (redirect){
		redirect_check.push(
			<Redirect key="redirect-to-customers" to="/customers"><Customers /></Redirect>
		);
	}

	return (
		<React.Fragment>
			{redirect_check}
			<Paper className="custom-paper">
				<h1>{t('globalEditForm.title')}</h1>
				<CustomerForm
					admDemloading={admDemloading}
					match={props.match}
					
					handleSubmit = {handleSubmit}
					setRedirect = {setRedirect}
					redirect={redirect}
					names={names}
					lastname={lastname}
					surname={surname}
					email={email}
					zipcode={zipcode}
					state={state}
					delegation={delegation}
					colony={colony}
					street_type={street_type}
					street_name={street_name}
					ext_number={ext_number}
					int_number={int_number}
					phone={phone}
					cellphone={cellphone}
					reference={reference}
					business_name={business_name}
					rfc={rfc}
					email_fn={email_fn}
					zipcode_fn={zipcode_fn}
					state_fn={state_fn}
					delegation_fn={delegation_fn}
					colony_fn={colony_fn}
					street_type_fn={street_type_fn}
					street_name_fn={street_name_fn}
					ext_number_fn={ext_number_fn}
					int_number_fn={int_number_fn}
					phone_fn={phone_fn}
					selectedPerson={selectedPerson}
					country={country}
					rut={rut}
					email2={email2}
					commercial_business={commercial_business}
					tradename={tradename}
					setFirstname={setFirstname}
					setLastname={setLastname}
					setSurname={setSurname}
					setEmail={setEmail}
					setZipcode={setZipcode}
					setState={setState}
					setDelegation={setDelegation}
					setColony={setColony}
					setStreettype={setStreettype}
					setStreetName={setStreetName}
					setExtNumber={setExtNumber}
					setIntNumber={setIntNumber}
					setPhone={setPhone}
					setCellphone={setCellphone}
					setReference={setReference}
					setBusinessName={setBusinessName}
					setRFC={setRFC}
					setCellphone={setCellphone}
					setEmailFn={setEmailFn}
					setZipcodeFn={setZipcodeFn}
					setStateFn={setStateFn}
					setDelegationFn={setDelegationFn}
					setColonyFn={setColonyFn}
					setStreettypeFn={setStreettypeFn}
					setStreetNameFn={setStreetNameFn}
					setExtNumberFn={setExtNumberFn}
					setIntNumberFn={setIntNumberFn}
					setPhoneFn={setPhoneFn}
					setSelectedPerson={setSelectedPerson}
					setCountry={setCountry}
					setRut={setRut}
					setEmail2={setEmail2}
					setCommercialBusiness={setCommercialBusiness}
					setTradename={setTradename}

					// administrative_demarcations
					administrativeDemarcations={administrativeDemarcations}
					administrativeDemarcationsFN={administrativeDemarcationsFN}
					administrativeDemarcationsValue={administrativeDemarcationsValue}
					administrativeDemarcationsFNValue={administrativeDemarcationsFNValue}
					setAdministrativeDemarcations={setAdministrativeDemarcations}
					setAdministrativeDemarcationsFN={setAdministrativeDemarcationsFN}
					setAdministrativeDemarcationsValue={setAdministrativeDemarcationsValue}
					setAdministrativeDemarcationsFNValue={setAdministrativeDemarcationsFNValue}
					fetchadministrativeDemarcationsData={fetchadministrativeDemarcationsData}
					// colonies
					colonies={colonies}
					setColonies={setColonies}
					coloniesFN={coloniesFN}
					setColoniesFN={setColoniesFN}
					coloniesValue={coloniesValue}
					setColoniesValue={setColoniesValue}
					coloniesFNValue={coloniesFNValue}
					setColoniesFNValue={setColoniesFNValue}


					zipcodeParentRequired={zipcodeParentRequired}
					setZipcodeParentRequired={setZipcodeParentRequired}


					// loading
					loading={loading}
					setLoading={setLoading}
				/>
			</Paper>
		</React.Fragment>
	);
}


const structuredSelector = createStructuredSelector({
	customer: state => state.customer
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(EditCustomer)
