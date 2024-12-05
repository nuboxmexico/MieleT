import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import Technicians from "components/technicians/Technicians"
import TechnicianForm from "components/technicians/TechnicianForm"
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
function NewTechnician(props){
  const [user, setUser] = useState("");
  const [userdata, setUserdata] = useState({});
  const [photo, setPhoto] = useState({});
  const [store, setStore] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [vehicleLicense, setVehicleLicense] = useState("");
  const [roleName, setRoleName] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [selectedOption, setSelectedOption] = useState({value: "", label: ""});
  const [options, setOptions] = React.useState([]);
  const [enterprise, setEnterprise] = useState("");
  
  

  const [checkedinstallation, setCheckedinstallation] = useState([]);
  const [checkedmaintenance, setCheckedmaintenance] = useState([]);
  const [checkedrepair, setCheckedrepair] = useState([]);
  const [checkeddiagnosis, setCheckeddiagnosis] =  useState([]);
  const [checkedhome_program, setCheckedHomeProgram] = useState([]);
  const [checkeddelivery, setCheckedDelivery] = useState([]);

  const [zoneFile, setZoneFile] = useState([]);
  // Technician events
  const [newEvents, setNewEvents] = useState([]);

  // Button loading
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    async function fetchOptions() {
      const response = await fetch(`/api/v1/get_technicians`);
      const users = await response.json();
      await setOptions(users);
    }
    fetchOptions();
  }, []);
  
  function handleSubmit(event) {
    event.preventDefault();
    var body = new FormData();
    body.set('user_id', user);
    body.set('n_store', store);
    body.set('vehicle_info', vehicleInfo);
    body.set('vehicle_license', vehicleLicense);
    body.set('activities', roleName);
    body.set('checkedinstallation', checkedinstallation);
    body.set('checkedmaintenance', checkedmaintenance);
    body.set('checkedrepair', checkedrepair);
    body.set('checkeddiagnosis', checkeddiagnosis);
    body.set('checkedhome_program', checkedhome_program);
    body.set('checkeddelivery', checkeddelivery);
    
    body.set('enterprise', enterprise);
    
    body.set('technicians_events', JSON.stringify(newEvents));
    body.append("file", photo);
    body.append("zoneFile", zoneFile);
	  return axios.post('/api/v1/technicians', body, { headers: props.headers})
      	.then(response => {
          console.log(response)
          flash_alert("Creado", "El técnico ha sido creado satisfactoriamente", "success")
      		setRedirect(true);
      	})
        .catch(e => {
            console.log(e.response.data);
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
			<Redirect key="redirect-to-technicians" to="/technicians"><Technicians /></Redirect>
		);
	}

  return (
	<React.Fragment>
    {redirect_check}
      <Paper className="custom-paper">
      <h1>Nuevo técnico</h1>
        <TechnicianForm
          user={user}
					userdata={userdata}
          selectedOption={selectedOption}
          options={options}
          setUser={setUser}
					setUserdata={setUserdata}
          setSelectedOption={setSelectedOption}
          handleSubmit = {handleSubmit}
          setUser={setUser}
          setRedirect = {setRedirect}
          store={store}
          setStore={setStore}
          vehicleInfo={vehicleInfo}
          setVehicleInfo={setVehicleInfo}
          vehicleLicense={vehicleLicense}
          setVehicleLicense={setVehicleLicense}
          roleName={roleName}
          setRoleName={setRoleName}
          redirect={redirect}
          setRedirect={setRedirect}
          roleName ={roleName}
          setRoleName={setRoleName}
          /* Photo for techinician */
					photo={photo}
					setPhoto={setPhoto}
          /* Taxones for technicians */
					checkedinstallation={checkedinstallation}
					checkedmaintenance={checkedmaintenance}
					checkedrepair={checkedrepair}
					checkeddiagnosis={checkeddiagnosis}
					checkedhome_program={checkedhome_program}
					checkeddelivery={checkeddelivery}
          setCheckedinstallation={setCheckedinstallation}
					setCheckedmaintenance={setCheckedmaintenance}
					setCheckedrepair={setCheckedrepair}
					setCheckeddiagnosis={setCheckeddiagnosis}
          setCheckedHomeProgram={setCheckedHomeProgram}
          setCheckedDelivery={setCheckedDelivery}

          /* Technician events */
					newEvents={newEvents}
          setNewEvents={setNewEvents}
          /* Zone file */
					zoneFile={zoneFile}
          setZoneFile={setZoneFile}

          loading={loading}
          setLoading={setLoading}

          // Enterprise
          enterprise={enterprise}
          setEnterprise={setEnterprise}
        />
      </Paper>
  	</React.Fragment>
  );
}


const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(NewTechnician)
