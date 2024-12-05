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
function NewCustomer(props){
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

  //Para proyectos
  const [selectedCustomer, setSelectedCustomer] = useState("customer_d");
  const [nombreInmobiliaria, setNombreInmobiliaria] = useState("");
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [streetTypeProject, setStreetTypeProject] = useState("");
  const [administrativeDemarcationsProject, setAdministrativeDemarcationsProject] = useState([{value: "", label: ""}]);
	const [administrativeDemarcationsProjectValue, setAdministrativeDemarcationsProjectValue] = useState({value: "", label: ""});
  const [stateProject, setStateProject] = useState("");
  const [streetNameProject, setStreetNameProject] = useState("");
  const [extNumberProject, setExtNumberProject] = useState("");
  const [businessNameProject, setBusinessNameProject] = useState("");
  const [rfcProject, setRfcProject] = useState("");
  const [referenceProject, setReferenceProject] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [lastnameContact, setLastnameContact] = useState("");
  const [surnameContact, setSurnameContact] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [administrativeDemarcationsContactValue, setAdministrativeDemarcationsContactValue] = useState({value: "", label: ""});
  const [stateContact, setStateContact] = useState("");
  const [streetTypeContact, setStreetTypeContact] = useState("");
  const [streetNameContact, setStreetNameContact] = useState("");
  const [extNumberContact, setExtNumberContact] = useState("");
  const [intNumberContact, setIntNumberContact] = useState("");
  const [cellphoneContact, setCellphoneContact] = useState("");
  const [phoneContact, setPhoneContact] = useState("");
  const [commercialBusinessProject, setCommercialBusinessProject] = useState("");


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
  const [zipcodeParentRequired, setZipcodeParentRequired] = useState(true);
  
  const [loading, setLoading] = React.useState(false);

	const [admDemloading, setAdmDemloading] = useState(false);

  useEffect(() => {

	}, []);
  
  function fetchadministrativeDemarcationsData(country_code, state_code, state_code_fn, zipcode_params, zipcodefn_params){
    var zipcode_t = ((zipcode_params != "") ? zipcode_params : zipcodefn_params)
    setAdmDemloading(true);
    console.log({country_code});
    return fetch(`/api/v1/administrative_demarcations?keywords=${country_code}&zipcode=${zipcode_t}`)
      .then(response => response.json())
      .then(json => {
        var new_admin_data = json.data.map(
          function(administrativeDemarcation) {
            var place_name = administrativeDemarcation.admin3_admin1
            if (administrativeDemarcation.country_code != "CL"){
              place_name = (administrativeDemarcation.admin_name_3 != null ? administrativeDemarcation.admin_name_3 : administrativeDemarcation.admin_name_1)
              if (zipcode_params != ""){
                setState(administrativeDemarcation.id)
                setStateProject(administrativeDemarcation.id)
                setStateContact(administrativeDemarcation.id)
                setAdministrativeDemarcationsValue({ value: administrativeDemarcation.id, label: place_name })
                setAdministrativeDemarcationsProjectValue({ value: administrativeDemarcation.id, label: place_name })
                setAdministrativeDemarcationsContactValue({ value: administrativeDemarcation.id, label: place_name })
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
              setAdministrativeDemarcationsProjectValue({ value: administrativeDemarcation.id, label: place_name })
              setAdministrativeDemarcationsContactValue({ value: administrativeDemarcation.id, label: place_name })
            }
            if(state_code_fn == administrativeDemarcation.id){
              setAdministrativeDemarcationsFNValue({ value: administrativeDemarcation.id, label: place_name })
            }
            return { value: administrativeDemarcation.id, label: place_name };
          }
        );
        const unique_new_admin_data = new_admin_data.filter((v,i,a)=>a.findIndex(t=>(t.label === v.label))===i)
        
        setAdministrativeDemarcations(unique_new_admin_data)
        setAdministrativeDemarcationsFN(unique_new_admin_data)
        setAdministrativeDemarcationsProject(unique_new_admin_data)

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

    if (selectedCustomer == "customer_p"){
      //Proyectos
      body.set('selected_customer', selectedCustomer);
      body.set('nombre_inmobiliaria', nombreInmobiliaria);
      body.set('nombre_proyecto', nombreProyecto);
      body.set('street_type_project', streetTypeProject);
      body.set('state_project', stateProject);
      body.set('street_name_project', streetNameProject);
      body.set('ext_number_project', extNumberProject)
      body.set('business_name_project', businessNameProject);
      body.set('commercial_business_project', commercialBusinessProject)
      body.set('rfc_project', rfcProject);
      body.set('reference_project', referenceProject);
      body.set('nombre_contacto', nombreContacto);
      body.set('last_name_contact', lastnameContact);
      body.set('surname_contact', surnameContact);
      body.set('email_contact', emailContact);
      body.set('state_contact', stateContact);
      body.set('street_type_contact', streetTypeContact);
      body.set('street_name_contact', streetNameContact);
      body.set('ext_number_contact', extNumberContact);
      body.set('int_number_contact', intNumberContact);
      body.set('cell_phone_contact', cellphoneContact);
      body.set('phone_contact', phoneContact);
    }
    else{
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
    }

	  return axios.post('/api/v1/customers', body, { headers: props.headers})
      	.then(response => {
          flash_alert("Creado", "El cliente ha sido creado satisfactoriamente", "success")
      		setRedirect(true);
      	})
        .catch(e => {
            setLoading(false)
            if(e.response.data){
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
        <h1>Nuevo cliente</h1>
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
          tradename={tradename}
          commercial_business={commercial_business}
          phoneContact={phoneContact}
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
          setPhoneContact={setPhoneContact}

          //Para proyectos
          selectedCustomer={selectedCustomer}
          nombreInmobiliaria={nombreInmobiliaria}
          nombreProyecto={nombreProyecto}
          streetTypeProject={streetTypeProject}
          administrativeDemarcationsProject={administrativeDemarcationsProject}
          administrativeDemarcationsProjectValue={administrativeDemarcationsProjectValue}
          stateProject={stateProject}
          streetNameProject={streetNameProject}
          extNumberProject={extNumberProject}
          businessNameProject={businessNameProject}
          rfcProject={rfcProject}
          commercialBusinessProject={commercialBusinessProject}
          referenceProject={referenceProject}
          nombreContacto={nombreContacto}
          lastnameContact={lastnameContact}
          surnameContact={surnameContact}
          emailContact={emailContact}
          administrativeDemarcationsContactValue={administrativeDemarcationsContactValue}
          stateContact={stateContact}
          streetTypeContact={streetTypeContact}
          streetNameContact={streetNameContact}
          extNumberContact={extNumberContact}
          intNumberContact={intNumberContact}
          cellphoneContact={cellphoneContact}
          setSelectedCustomer={setSelectedCustomer}
          setNombreInmobiliaria ={setNombreInmobiliaria}
          setNombreProyecto={setNombreProyecto}
          setStreetTypeProject={setStreetTypeProject}
          setAdministrativeDemarcationsProject={setAdministrativeDemarcationsProject}
          setAdministrativeDemarcationsProjectValue={setAdministrativeDemarcationsProjectValue}
          setStateProject={setStateProject}
          setStreetNameProject={setStreetNameProject}
          setExtNumberProject={setExtNumberProject}
          setBusinessNameProject={setBusinessNameProject}
          setRfcProject={setRfcProject}
          setCommercialBusinessProject={setCommercialBusinessProject}
          setReferenceProject={setReferenceProject}
          setNombreContacto={setNombreContacto}
          setLastnameContact={setLastnameContact}
          setSurnameContact={setSurnameContact}
          setEmailContact={setEmailContact}
          setAdministrativeDemarcationsContactValue={setAdministrativeDemarcationsContactValue}
          setStateContact={setStateContact}
          setStreetTypeContact={setStreetTypeContact}
          setStreetNameContact={setStreetNameContact}
          setExtNumberContact={setExtNumberContact}
          setIntNumberContact={setIntNumberContact}
          setCellphoneContact={setCellphoneContact}
          

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


const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(NewCustomer)
