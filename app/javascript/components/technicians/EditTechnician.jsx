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

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
	root: {
	  width: '100%',
	  maxWidth: '36ch',
	  backgroundColor: theme.palette.background.paper,
	},
	inline: {
	  display: 'inline',
	},
}));

function EditTechnician(props) {
		const classes = useStyles();
		const [technicianID, setTechnicianID] = useState("");
		const [user, setUser] = useState({});
		const [userdata, setUserdata] = useState({});
		
		const [photo, setPhoto] = useState({});
		const [photoURL, setPhotoURL] = useState("");
		const [store, setStore] = useState("");
		const [vehicleInfo, setVehicleInfo] = useState("");
		const [vehicleLicense, setVehicleLicense] = useState("");
		const [roleName, setRoleName] = useState([]);
		const [redirect, setRedirect] = useState(false);
		const [enterprise, setEnterprise] = useState("");
		const [selectedOption, setSelectedOption] = useState({value: "", label: ""});
		const [options, setOptions] = React.useState([]);

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
			async function fetchData() {
				let userId = props.match.params.id;
				return fetch(`/api/v1/technicians/${userId}`)
					.then(response => response.json())
					.then(json => {
						setTechnicianID(json.data.id)
						setUser(json.data.user.id)
						setUserdata(json.data.user)
						setStore(json.data.n_store)
						setVehicleInfo(json.data.vehicle_info)
						setVehicleLicense(json.data.vehicle_license)
						setPhotoURL(json.data.photo)
						setRoleName(json.data.activities.map(activity => activity.name))
						setEnterprise(json.data.enterprise)
						if("installation" in json.data.technician_taxons_grouped){
							setCheckedinstallation(json.data.technician_taxons_grouped.installation.map(taxon => taxon.taxon_id))
						}
						if("maintenance" in json.data.technician_taxons_grouped){
							setCheckedmaintenance(json.data.technician_taxons_grouped.maintenance.map(taxon => taxon.taxon_id))
						}
						if("repair" in json.data.technician_taxons_grouped){
							setCheckedrepair(json.data.technician_taxons_grouped.repair.map(taxon => taxon.taxon_id))
						}
						if("diagnosis" in json.data.technician_taxons_grouped){
							setCheckeddiagnosis(json.data.technician_taxons_grouped.diagnosis.map(taxon => taxon.taxon_id))
						}
						if("home_program" in json.data.technician_taxons_grouped){
							setCheckedHomeProgram(json.data.technician_taxons_grouped.home_program.map(taxon => taxon.taxon_id))
						}
						if("delivery" in json.data.technician_taxons_grouped){
							setCheckedDelivery(json.data.technician_taxons_grouped.delivery.map(taxon => taxon.taxon_id))
						}
					})
					.catch(error => console.log(error));
			}
			fetchData();

			

			async function fetchOptions() {
				const response = await fetch(`/api/v1/get_technicians`);
				const users = await response.json();
				await setOptions(users);
					users.find(function(e) {
					if (e.value == props.user){
						console.log(e)
						setSelectedOption(e);
					}
				});
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
			
			body.set('technicians_events', JSON.stringify(newEvents));
			body.set('enterprise', enterprise);
			body.append("file", photo);
			body.append("zoneFile", zoneFile);
			return axios.patch(`/api/v1/technicians/${props.match.params.id}`, body, { headers: props.headers })
				.then(response => {
					flash_alert("Actualizado!", "El técnico se ha actualizado correctamente", "success")
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
		if (redirect) {
			redirect_check.push(
				<Redirect key="redirect-to-technicians" to="/technicians"><Technicians /></Redirect>
			);
		}
	return (
		<React.Fragment>
			{redirect_check}
			<Paper className="custom-paper">
				<h1>Editar técnico</h1>
				<List  dense className={classes.root}>
					<ListItem>
						<ListItemAvatar>
							<Avatar className="technician-avatar" alt={userdata.firstname} src={photoURL} />
						</ListItemAvatar>
						<ListItemText
						primary={userdata.firstname + " " + userdata.lastname}
						/>
					</ListItem>
				</List>
				<TechnicianForm
					handleSubmit = {handleSubmit}
					technicianID={technicianID}
					user={user}
					userdata={userdata}
					selectedOption={selectedOption}
					options={options}
					setUser={setUser}
					setUserdata={setUserdata}
					setSelectedOption={setSelectedOption}
					setOptions={setOptions}
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


const structuredSelector = createStructuredSelector({
	user: state => state.user
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(EditTechnician)
