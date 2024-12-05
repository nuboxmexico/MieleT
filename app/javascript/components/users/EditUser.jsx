import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import Users from "components/users/Users"
import UserForm from "components/users/UserForm"
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
function EditUser(props) {
	const [showPassword, setShowpassword] = useState(false);
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [roleName, setRoleName] = useState([]);
	const [country, setCountry] = useState([]);
	const [surname, setSurname] = useState("");
	const [cellphone, setCellphone] = useState("");
	const [phone, setPhone] = useState("");
	const [costCenter, setCostCenter] = useState("");
	const [roleId, setRoleId] = useState("");
	const [worktime, setWorktime] = useState("");
	const [passwordClass, setPasswordClass] = useState("");
	const [redirect, setRedirect] = useState(false);
	const [disabled, setDisabled] = React.useState(false);

	// API VALUES

	const [userUniqueiIds, setUserUniqueiIds] = useState([]);
	const [costCenters, setCostCenters] = useState([]);
	const [costCenterValue, setCostCenterValue] = useState({value: "", label: ""});
	const [uniqueiIdsValue, setUniqueiIdsValue] = useState({value: "", label: ""});
	
	useEffect(() => {
		function fetchCostCentersData(cost_center) {
			return fetch(`/api/v1/cost_centers`)
				.then(response => response.json())
				.then(json => {
					var centers = json.data.map(
						function(center) {
							if(cost_center == center.code){
								setCostCenterValue({ value: center.code, label: center.fullname })
							}
							return { value: center.code, label: center.fullname };
						});
					
					setCostCenters(centers)
				})
				.catch(error => console.log(error));
		}
		
		 function fetchUserUniqueIdsData(role_id) {
			return fetch(`/api/v1/user_unique_ids?keywords=tickets`)
				.then(response => response.json())
				.then(json => {
					var user_unique_ids = json.data.map(
						function(unique_id) {
							if(role_id == unique_id.uniqueId){
								setUniqueiIdsValue({ value: unique_id.code, label: unique_id.fullname })
							}
							return { value: unique_id.uniqueId, label: unique_id.fullname };
						});
					
					setUserUniqueiIds(user_unique_ids)
				})
				.catch(error => console.log(error));
		}

		function fetchData() {
			let userId = props.match.params.id;
			return fetch(`/api/v1/users/${userId}`)
				.then(response => response.json())
				.then(json => {
					setFirstname(json.data.firstname);
					setLastname(json.data.lastname);
					setEmail(json.data.email);
					setSurname(json.data.surname);
					setCellphone(json.data.cellphone);
					setPhone(json.data.phone);
					setCostCenter(json.data.cost_center);
					setRoleId(json.data.role_id);
					setWorktime(json.data.worktime);
					setRoleName(json.data.roles.map(role => role.name))
					setCountry(json.data.countries.map(country => country.iso))
					fetchCostCentersData(json.data.cost_center);
					fetchUserUniqueIdsData(json.data.role_id);
					setDisabled(json.data.disabled);
				})
				.catch(error => console.log(error));
		}

		
		fetchData();
	}, []);

	function handleClickShowPassword() {
		setShowpassword(!showPassword);
	};

	function handleMouseDownPassword(e) {
		e.preventDefault();
	};

	function handleSubmit(event, loading_function) {
		event.preventDefault();
		var body = new FormData();
		body.set('firstname', firstname);
		body.set('lastname', lastname);
		body.set('email', email);
		body.set('password', password);
		body.set('roleName', roleName);
		body.set('country', country);
		body.set('surname', surname);
		body.set('cellphone', cellphone);
		body.set('phone', phone);
		body.set('cost_center', costCenter);
		body.set('role_id', roleId);
		body.set('worktime', worktime);
		body.set('disabled', disabled);
		return axios.patch(`/api/v1/users/${props.match.params.id}`, body, { headers: props.headers })
			.then(response => {
				flash_alert("Actualizado!", "El usuario se ha actualizado correctamente", "success")
				setRedirect(true);
			})
			.catch(e => {
				loading_function(false);
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
			<Redirect key="redirect-to-users" to="/users"><Users /></Redirect>
		);
	}

	return (
		<React.Fragment>
			{redirect_check}
			<Paper className="custom-paper">
				<h1>Editar Usuario</h1>
				<UserForm
					handleSubmit={handleSubmit}
					setShowpassword={setShowpassword}
					setFirstname={setFirstname}
					setLastname={setLastname}
					setPassword={setPassword}
					setEmail={setEmail}
					setRedirect={setRedirect}
					handleClickShowPassword={handleClickShowPassword}
					handleMouseDownPassword={handleMouseDownPassword}
					firstname={firstname}
					lastname={lastname}
					email={email}
					showPassword={showPassword}
					password={password}
					showPassword={showPassword}
					roleName={roleName}
					setRoleName={setRoleName}
					setRoleName={setRoleName}
					surname={surname}
					setSurname={setSurname}
					cellphone={cellphone}
					setCellphone={setCellphone}
					phone={phone}
					setPhone={setPhone}
					costCenter={costCenter}
					setCostCenter={setCostCenter}
					roleId={roleId}
					setRoleId={setRoleId}
					worktime={worktime}
					setWorktime={setWorktime}
					country={country}
					setCountry={setCountry}
					  
					passwordClass={passwordClass}
					setPasswordClass={setPasswordClass}
					disabled={disabled}
					setDisabled={setDisabled}
					// API values
					userUniqueiIds={userUniqueiIds}
					costCenters={costCenters}
					costCenterValue={costCenterValue}
					uniqueiIdsValue={uniqueiIdsValue}
					setUserUniqueiIds={setUserUniqueiIds}
					setCostCenters={setCostCenters}
					setCostCenterValue={setCostCenterValue}
					setUniqueiIdsValue={setUniqueiIdsValue}
				/>
			</Paper>
		</React.Fragment>
	);
}


const structuredSelector = createStructuredSelector({
	user: state => state.user
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(EditUser)
