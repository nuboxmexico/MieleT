import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import InputMask from 'react-input-mask';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';


import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ReactCountryFlag from "react-country-flag";
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';
import { flash_alert } from 'components/App';

// Button props.loading
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import useCountries from 'hooks/useCountries';
import {useTranslation} from "react-i18next"

const documentMasks = {
  BR: "999.999.999-99",
  CL: "99.999.999-*",
}

const rfcDocumentMasks = {
  BR: "99.999.999/9999-99",
  CL: "99.999.999-*",
}

const countries = [
	"MX",
	"CL",
	"BR"
];

const country_names = [{"name": "Chile", "iso": "CL", "phone_code": "+56"}, {"name":"Mexico", "iso": "MX", "phone_code": "+52"}, {"name": "Brasil", "iso": "BR", "phone_code": "+55"}]


const street_types_mx = ["Calle", "Av.", "Callejon", "Blvr.", "Cerrada", "Carretera", "Privada", "Retorno", "Calzada"]

const street_types_cl = ["Calle", "Av.", "Pasaje", "Diagonal"]

// NUEVOS ATRIBUTOS:
// rut
// email2
// commercial_business

const useStyles = makeStyles((theme) => ({

	wrapper: {
	  margin: theme.spacing(1),
	  position: 'relative',
	},
	buttonProgress: {
	  position: 'absolute',
	  top: '50%',
	  left: '50%',
	  marginTop: -12,
	  marginLeft: -12,
	},
	buttonProgressGeneral: {
	  position: 'relative',
	  top: '20%',
	  left: '50%',
	  marginTop: -12,
	  marginLeft: -12,
	},
}));

function CustomerForm(props){
  function handleOnChangeRut ({target: {value}}) {
    props.setRut(value)
  }

  function handleRfc({target: {value}}) {
    props.setRFC(value)
  }

	const {t} = useTranslation();
  const {data: countries, loading: loadingCountries, isos} = useCountries()
	const [sameAddress, setSameAddress] = useState(false);
	
	const [personCheck, setPersonCheck] = useState("");
	const [customerTypeCheck, setCustomerTypeCheck] = useState("");
	const [RUTCheck, setRUTCheck] = useState("hidden");
	const [zipcodeCheck, setZipcodeCheck] = useState("");
	const [delegationCheck, setDelegationCheck] = useState("");
	const [stateLabel, setStateLabel] = useState("Estado");
	const [colonyCheck, setColonyCheck] = useState("");
	const [extNumberLabel, setExtNumberLabel] = useState("Número Exterior");
	const [intNumberLabel, setIntNumberLabel] = useState("Número Interior");
	const [commercialBusinessCheck, setCommercialBusinessCheck] = useState("hidden");
	const [rfcLabel, setRFCLabel] = useState("RFC");
	const [street_types, setStreetTypes] = useState([]);
	const [namesLabel, setNamesLabel] = useState("Nombre");
	const [personPCheck, setPersonPCheck] = useState("");
	const [personMCheck, setPersonMCheck] = useState("");
	const [phoneCode, setPhoneCode] = useState("");
	const [inmobiliariaNameCheck, setInmobiliariaNameCheck] = useState("hidden")
	const [noProjectCheck, setNoProjectCheck] = useState("hidden")
	
	// CHECK COUNTRY_ZIPCODE_REQUIRED
	const [zipcodeRequired, setZipcodeRequired] = useState(props.zipcodeParentRequired);

	// Button loading
	const classes = useStyles();

  

	const handleSubmitButtonClick = (e) => {
	  if (!props.loading) {
		props.setLoading(true);
		props.handleSubmit(e)
	  }
	};

	useEffect(() => {
    if (loadingCountries) return

    setPhoneCode(countries.find(country => country.iso == props.country).phone_code )
	}, [loadingCountries, props.country]);


	useEffect(() => {
		handleCountryInputs(props.country)
		handlePersonInputs(props.country, props.selectedPerson)
	}, [props.country]);

	function handlePersonInputs(country_iso, person_type){
		
		if (person_type == "person_m" && country_iso == "MX"){
			setPersonPCheck("hidden")
			setPersonMCheck("")
			setNamesLabel("Nombre de contacto")
			setNoProjectCheck("")
		}else{
			setPersonPCheck("")
			setPersonMCheck("hidden")
			setNamesLabel("Nombre")
			setNoProjectCheck("")
		}
	}

	function handleCustomerInputs(country_iso, customer_type){
		if (customer_type == "customer_p" && country_iso == "CL"){
			setInmobiliariaNameCheck("");
			setRUTCheck("hidden");
			setPersonPCheck("hidden");
			setNoProjectCheck("hidden")
			setCommercialBusinessCheck("hidden");
			// setPersonPCheck("hidden")
			// setPersonMCheck("")
			// setNamesLabel("Nombre de contacto")
		}else{
			setInmobiliariaNameCheck("hidden")
			setNoProjectCheck("")
			setCommercialBusinessCheck("hidden");
			// setPersonPCheck("")
			// setPersonMCheck("hidden")
			// setNamesLabel("Nombre")
		}
	}
	
	function handleCountryInputs(country_iso){
		if(country_iso == "CL" || country_iso == "BR"){
			
			if (props.selectedCustomer == "customer_p"){
				setInmobiliariaNameCheck("")
				
			}
			else{
				setInmobiliariaNameCheck("hidden")
				setPersonCheck("hidden");
				setCustomerTypeCheck("");
				setZipcodeCheck("hidden");
				setDelegationCheck("hidden");
				setColonyCheck("hidden");
				setStateLabel("Comuna/Región");
				setExtNumberLabel("Número");
				setIntNumberLabel("Depto");
				setRFCLabel("RUT Empresa");
				setRUTCheck("");
				setCommercialBusinessCheck("");
				setStreetTypes(street_types_cl);
				setZipcodeRequired(false)
				props.fetchadministrativeDemarcationsData(country_iso, "", "", "","", "","")
			}
		}else{
			setInmobiliariaNameCheck("hidden")
			setCustomerTypeCheck("hidden")
			setPersonCheck("");
			setRUTCheck("hidden");
			setZipcodeCheck("");
			setDelegationCheck("");
			setColonyCheck("");
			setStateLabel("Estado");
			setExtNumberLabel("Número Exterior");
			setIntNumberLabel("Número Interior");
			setRFCLabel("RFC");
			setCommercialBusinessCheck("hidden");
			setStreetTypes(street_types_mx);

			flash_alert(t('globalEditForm.flashAlert.attention'), t('globalEditForm.flashAlert.notZipcodePresent'), "warning")
			props.setAdministrativeDemarcations([{value: "", label: ""}])
			props.setAdministrativeDemarcationsFN([{value: "", label: ""}])
			setZipcodeRequired(props.zipcodeParentRequired)
		}
	}

	const handleChange = (event) => {
		props.setSelectedPerson(event.target.value);
		handlePersonInputs(props.country, event.target.value)
	};
	const handleChangeCustomer = (event) =>{
		props.setSelectedCustomer(event.target.value);
		handleCustomerInputs(props.country, event.target.value)
	};
	const handleSameAddressChange = (event) => {
		setSameAddress(!sameAddress);
		if(event.target.checked){
			props.setEmailFn(props.email)
			props.setZipcodeFn(props.zipcode)
			props.setColoniesFN(props.colonies)
		  	props.setColoniesFNValue(props.coloniesValue)
			props.setStateFn(props.state)
			props.setDelegationFn(props.delegation)
			props.setColonyFn(props.colony)
			props.setStreettypeFn(props.street_type)
			props.setStreetNameFn(props.street_name)
			props.setExtNumberFn(props.ext_number)
			props.setIntNumberFn(props.int_number)
			props.setPhoneFn(props.phone)
			props.setAdministrativeDemarcationsFNValue(props.administrativeDemarcationsValue)
		}else{
			props.setEmailFn("")
			props.setZipcodeFn("")
			props.setStateFn("")
			props.setDelegationFn("")
			props.setColonyFn("")
			props.setColoniesFNValue({ value: "", label: "" })
			props.setStreettypeFn("")
			props.setStreetNameFn("")
			props.setExtNumberFn("")
			props.setIntNumberFn("")
			props.setPhoneFn("")
			props.setAdministrativeDemarcationsFNValue([])
		}
	};

	const handleCountryChange = (event) => {
		props.setCountry(event.target.value)
		handleCountryInputs(event.target.value)
		handlePersonInputs(event.target.value, props.selectedPerson)
	};
	

	let lastRequestId = null;


	
	const handleZipcodeChange = (event) => {
		props.setZipcode(event.target.value);
		let value_t  = event.target.value;
		if (value_t.length > 3){
			if (lastRequestId !== null) {
				clearTimeout(lastRequestId);
			}
			
			lastRequestId = setTimeout(() => {
				setZipcodeRequired(false)
				props.fetchadministrativeDemarcationsData(props.country, "", "", value_t, props.colony, props.colony_fn)
			}, 1500);
		}
	}

	let lastRequestIdFN = null;
	const handleZipcodeFNChange = (event) => {
		props.setZipcodeFn(event.target.value)
		let value_t  = event.target.value;
		if (value_t.length > 3){
			if (lastRequestIdFN !== null) {
				clearTimeout(lastRequestIdFN);
			}
			
			lastRequestIdFN = setTimeout(() => {
				setZipcodeRequired(false)
				props.fetchadministrativeDemarcationsData(props.country, "", "", "", value_t, props.colony, props.colony_fn)
			}, 1500);
		}
	}
	
    return (
		<React.Fragment>
			<form className="custom-form" onSubmit={props.handleSubmit} autoComplete="off" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
			

				<Grid container spacing={3} className="p-relative" >

					<Grid item xs={12}>
						<h6>
							{ props.match.params.id == undefined ? t('globalEditForm.selectCountry') : t('globalEditForm.country') }
						</h6>
					</Grid>

					<Grid item xs={12} sm={6}>
						{ props.match.params.id == undefined &&
							<FormControl required className="MuiFormControl-fullWidth Mui-MultiSelect" variant="outlined">
								<InputLabel className="white-bg padding-sides-5" htmlFor="select-chip-country" id="country-chip-label">{t('globalText.country')}</InputLabel>
								<Select
								id="country-chip"
								value={props.country}
								onChange={handleCountryChange}
								input={<OutlinedInput id="select-multiple-chip-country" />}
								renderValue={(selected) => (
									<div className="">
										<MenuItem key={selected} value={selected} >
											<ReactCountryFlag
												countryCode={selected}
												svg
												style={{
													width: '2em',
													height: '2em',
													marginRight: "15px",
												}}
												title={selected}
											/>

											<ListItemText primary={!loadingCountries && countries.find(country => country.iso ===  selected).name} />
										</MenuItem>
									</div>
								)}
								>
								{!loadingCountries && isos.map((name) => (
									<MenuItem key={name} value={name} >
										<ReactCountryFlag
											countryCode={name}
											svg
											style={{
												width: '2em',
												height: '2em',
												marginRight: "15px",
											}}
											title={name}
										/>
										<ListItemText primary={countries.find(country=> country.iso === name).name} />
									</MenuItem>
								))}
								</Select>
							</FormControl>
						}
						{ props.match.params.id != undefined &&
							<>
							<ReactCountryFlag
								countryCode={props.country}
								svg
								style={{
									width: '2em',
									height: '2em',
									marginRight: "15px",
								}}
								title={props.country}
							/>
							<ListItemText primary={country_names.find(object => object["iso"] ===  props.country).name} />
							</>
						}
					</Grid>

					<Grid className={personCheck} item xs={12}>
						<FormControlLabel value="end" control={<Radio
							color="primary" 
							checked={props.selectedPerson === 'person_p'}
							onChange={handleChange}
							value="person_p"
							name="person"
							inputProps={{ 'aria-label': 'person_p' }}
							/>} label={t('globalEditForm.naturalPerson')} />
						<FormControlLabel value="end" control={<Radio
							color="primary" 
							checked={props.selectedPerson === 'person_m'}
							onChange={handleChange}
							value="person_m"
							name="person"
							inputProps={{ 'aria-label': 'person_m' }}
							/>} label={t('globalEditForm.legalPerson')} />
						
					</Grid>

					<Grid className={customerTypeCheck} item xs={12}>
						<FormControlLabel value="end" control={<Radio
							color="primary" 
							checked={props.selectedCustomer === 'customer_d'}
							onChange={handleChangeCustomer}
							value="customer_d"
							name="customer"
							inputProps={{ 'aria-label': 'customer_d' }}
							/>} label={t('globalEditForm.domesticCustomer')}/>
						<FormControlLabel value="end" control={<Radio
							color="primary" 
							checked={props.selectedCustomer === 'customer_p'}
							onChange={handleChangeCustomer}
							value="customer_p"
							name="customer"
							inputProps={{ 'aria-label': 'customer_p' }}
							/>} label={t('globalEditForm.projectCustomer')} />
						
					</Grid>

					<Grid item xs={12} sm={6} className={inmobiliariaNameCheck}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.realStateName')} name="nombreInmobiliaria" value={props.nombreInmobiliaria} onChange={(e) => props.setNombreInmobiliaria(e.target.value)}/>
					</Grid>

					<Grid item xs={12}>
						{props.selectedCustomer === 'customer_p'&&
						<h6>{t('globalEditForm.title#4')}</h6>
						}
						{!(props.selectedCustomer === 'customer_p') &&
						<h6>{t('globalEditForm.title#3')}</h6>
						}
					</Grid>
					{props.admDemloading && 
						<Grid item xs={12} className="customer-general-loader">
							<CircularProgress size={24} className={classes.buttonProgressGeneral} />
						</Grid>
					}
					<Grid item xs={12} sm={6} className={inmobiliariaNameCheck}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.projectName')} name="NombreProyecto" value={props.nombreProyecto} onChange={(e) => props.setNombreProyecto(e.target.value)}/>
					</Grid>

					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<Autocomplete
							id="state-project-select"
							disableListWrap
							disabled={zipcodeRequired} //quizas poner las de arriva para el check
							options={props.administrativeDemarcationsProject}
							value={props.administrativeDemarcationsProjectValue}
							onChange={(event, newValue) => {
								if (typeof newValue === 'string') {
									props.setStateProject(newValue)
								} else if (newValue && newValue.inputValue) {
									props.setStateProject(newValue.value)
									props.setAdministrativeDemarcationsProjectValue(newValue)  
								} else {
									props.setStateProject(newValue.value)
									props.setAdministrativeDemarcationsProjectValue(newValue)  
								}							
							}}
							selectOnFocus
							clearOnBlur
							handleHomeEndKeys
							freeSolo
							getOptionLabel={(option) => option.label}
							renderInput={(params) => <TextField {...params} fullWidth label={stateLabel} variant="outlined" name="state_project"/>}
						/>
					</Grid>

					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<FormControl variant="outlined" className="MuiFormControl-fullWidth">
							<InputLabel id="street_type-simple-select-outlined-label">{t('globalEditForm.StreetType')}</InputLabel>
							<Select
							labelId="street_type-simple-select-outlined-label"
							id="street_type_project-simple-select-outlined"
							value={props.streetTypeProject}
							onChange={(e) => props.setStreetTypeProject(e.target.value)}
							label={t('globalEditForm.StreetType')}
							name="streetTypeProject"
							>
							{street_types.map((value) => (
								<MenuItem key={value} value={value}>{value}</MenuItem>
							))}
							</Select>
						</FormControl>
					</Grid>

					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.streetName')} name="streetNameProject" value={props.streetNameProject} onChange={(e) => props.setStreetNameProject(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={extNumberLabel} name="extNumberProject" value={props.extNumberProject} onChange={(e) => props.setExtNumberProject(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.businessName')} name="businessNameProject" value={props.businessNameProject} onChange={(e) => props.setBusinessNameProject(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={rfcLabel} name="rfcProject" value={props.rfcProject} onChange={(e) => props.setRfcProject(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.commercialBusiness')} name="commercialBusinessProject" value={props.commercialBusinessProject} onChange={(e) => props.setCommercialBusinessProject(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12}>
						<TextField fullWidth multiline rows={2} rowsMax={4} variant="outlined" label={t('globalEditForm.referenceProject')} name="referenceProject" value={props.referenceProject} onChange={(e) => props.setReferenceProject(e.target.value)}/>
					</Grid>			
					<Grid className={inmobiliariaNameCheck}item xs={12}>
						<h6>{t('globalEditForm.contactInfo')}</h6>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.name')} name="NombreContacto" value={props.nombreContacto} onChange={(e) => props.setNombreContacto(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.lastName')} name="lastnameContact" value={props.lastnameContact} onChange={(e) => props.setLastnameContact(e.target.value)}/>
					</Grid>

					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.surName')} name="surnameContact" value={props.surnameContact} onChange={(e) => props.setSurnameContact(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" type="email" label={t('globalEditForm.email')} name="emailContact" value={props.emailContact} onChange={(e) => props.setEmailContact(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<Autocomplete
							id="state-contact-select"
							disableListWrap
							disabled={zipcodeRequired} //quizas poner las de arriva para el check
							options={props.administrativeDemarcationsProject}
							value={props.administrativeDemarcationsContactValue}
							onChange={(event, newValue) => {
								if (typeof newValue === 'string') {
									props.setStateContact(newValue)
								} else if (newValue && newValue.inputValue) {
									props.setStateContact(newValue.value)
									props.setAdministrativeDemarcationsContactValue(newValue)  
								} else {
									props.setStateContact(newValue.value)
									props.setAdministrativeDemarcationsContactValue(newValue)  
								}							
							}}
							selectOnFocus
							clearOnBlur
							handleHomeEndKeys
							freeSolo
							getOptionLabel={(option) => option.label}
							renderInput={(params) => <TextField {...params} fullWidth label={stateLabel} variant="outlined" name="state_contact"/>}
						/>
					</Grid>

					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<FormControl variant="outlined" className="MuiFormControl-fullWidth">
							<InputLabel id="street_type_contact-simple-select-outlined-label">{t('globalEditForm.StreetType')}</InputLabel>
							<Select
							labelId="street_type-simple-select-outlined-label"
							id="street_type-simple-select-outlined"
							value={props.streetTypeContact}
							onChange={(e) => props.setStreetTypeContact(e.target.value)}
							label={t('globalEditForm.StreetType')}
							name="streetTypeContact"
							>
							{street_types.map((value) => (
								<MenuItem key={value} value={value}>{value}</MenuItem>
							))}
							</Select>
						</FormControl>
					</Grid>

					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.streetName')} name="streetNameContact" value={props.streetNameContact} onChange={(e) => props.setStreetNameContact(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={extNumberLabel} name="extNumberContact" value={props.extNumberContact} onChange={(e) => props.setExtNumberContact(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={intNumberLabel} name="intNumberContact" value={props.intNumberContact} onChange={(e) => props.setIntNumberContact(e.target.value)}/>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<InputMask
							mask={ `(${phoneCode}) 9999999999`}
							value={props.cellphoneContact}
							disabled={false}
							maskChar=" "
							onChange={(e) => props.setCellphoneContact(e.target.value)}
							>
							{() => <TextField fullWidth variant="outlined" label={t('globalEditForm.cellPhone')} name="cellphoneContact" />}
						</InputMask>
					</Grid>
					<Grid className={inmobiliariaNameCheck} item xs={12} sm={6}>
						<InputMask
							mask={ `(${phoneCode}) 9999999999`}
							value={props.phoneContact}
							disabled={false}
							maskChar=" "
							onChange={(e) => props.setPhoneContact(e.target.value)}
							>
							{() => <TextField fullWidth variant="outlined" label={t('globalEditForm.phone')} name="phoneContact" />}
						</InputMask>
					</Grid>



















					<Grid item xs={12} sm={6} className={RUTCheck}>
						<InputMask
              name="rut"
							mask={documentMasks[props.country] || null}
              value={props.rut}
							disabled={false}
							maskChar={null}
							onChange={handleOnChangeRut}
							>
							{() => <TextField required={props.country == "BR"} fullWidth variant="outlined" label={t('globalEditForm.rut')} name="rut" />}
						</InputMask>

					</Grid>

					

					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField required fullWidth variant="outlined" label={namesLabel} name="firstname" value={props.names} onChange={(e) => props.setFirstname(e.target.value)}/>
					</Grid>
					<Grid className={personPCheck} item xs={12} sm={6}>
						<TextField required fullWidth variant="outlined" label={t('globalEditForm.lastName')} name="lastname" value={props.lastname} onChange={(e) => props.setLastname(e.target.value)}/>
					</Grid>

					<Grid className={personPCheck} item xs={12} sm={6}>
						<TextField required fullWidth variant="outlined" label={t('globalEditForm.surName')} name="surname" value={props.surname} onChange={(e) => props.setSurname(e.target.value)}/>
					</Grid>

					<Grid className={personMCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.tradeName')} name="tradename" value={props.tradename} onChange={(e) => props.setTradename(e.target.value)}/>
					</Grid>

					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField required fullWidth variant="outlined" type="email" label={t('globalEditForm.email')} name="email" value={props.email} onChange={(e) => props.setEmail(e.target.value)}/>
					</Grid>
							
					
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" type="email" label={t('globalEditForm.email2')} name="email2" value={props.email2} onChange={(e) => props.setEmail2(e.target.value)}/>
					</Grid>

					<Grid className={zipcodeCheck} item xs={12} sm={6}>
						<TextField fullWidth error={zipcodeRequired} variant="outlined" label={t('globalEditForm.zipcode')} name="zipcode" value={props.zipcode} onChange={(e) => handleZipcodeChange(e)}/>
					</Grid>
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<Autocomplete
							id="state-select"
							
							options={props.administrativeDemarcations}
							value={props.administrativeDemarcationsValue}
							disableListWrap
							disabled={zipcodeRequired}
							onChange={(event, newValue) => {
								if (typeof newValue === 'string') {
									props.setState(newValue)
								} else if (newValue && newValue.inputValue) {
									props.setState(newValue.value)
									props.setAdministrativeDemarcationsValue(newValue)  
								} else {
									props.setState(newValue.value)
									props.setAdministrativeDemarcationsValue(newValue)  
								}
								
							}}
							selectOnFocus
							clearOnBlur
							handleHomeEndKeys
							freeSolo
							getOptionLabel={(option) => option.label}
							renderInput={(params) => <TextField {...params} fullWidth label={stateLabel} variant="outlined" name="state"/>}
						/>
					</Grid>

					<Grid className={delegationCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.delegation')}name="delegation" value={props.delegation} onChange={(e) => props.setDelegation(e.target.value)}/>
					</Grid>
					<Grid className={colonyCheck} item xs={12} sm={6}>
						<Autocomplete
							id="colony-select"
							
							options={props.colonies}
							value={props.coloniesValue}
							disableListWrap
							onChange={(event, newValue) => {
								if (typeof newValue === 'string') {
									props.setColony(newValue)
								} else if (newValue && newValue.value) {
									props.setColony(newValue.label)
									props.setColoniesValue(newValue)  
								} else {
									props.setColony(newValue.label)
									props.setColoniesValue(newValue)  
								}
							}}
							selectOnFocus
							clearOnBlur
							handleHomeEndKeys
							freeSolo
							getOptionLabel={(option) => option.label}
							renderInput={(params) => <TextField {...params} fullWidth label={t('globalEditForm.colony')} variant="outlined" name="colony"/>}
						/>
					</Grid>

					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<FormControl variant="outlined" className="MuiFormControl-fullWidth">
							<InputLabel id="street_type-simple-select-outlined-label">{t('globalEditForm.StreetType')}</InputLabel>
							<Select
							labelId="street_type-simple-select-outlined-label"
							id="street_type-simple-select-outlined"
							value={props.street_type}
							onChange={(e) => props.setStreettype(e.target.value)}
							label={t('globalEditForm.StreetType')}
							name="street_type"
							>
							{street_types.map((value) => (
								<MenuItem key={value} value={value}>{value}</MenuItem>
							))}
							</Select>
						</FormControl>
					</Grid>

					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.streetName')} name="street_name" value={props.street_name} onChange={(e) => props.setStreetName(e.target.value)}/>
					</Grid>
					
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={extNumberLabel} name="ext_number" value={props.ext_number} onChange={(e) => props.setExtNumber(e.target.value)}/>
					</Grid>
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={intNumberLabel} name="int_number" value={props.int_number} onChange={(e) => props.setIntNumber(e.target.value)}/>
					</Grid>
					
					<Grid className={noProjectCheck}  item xs={12} sm={6}>
						<InputMask
							mask={ `(${phoneCode}) 9999999999`}
							value={props.phone}
							disabled={false}
							maskChar=" "
							onChange={(e) => props.setPhone(e.target.value)}
							>
							{() => <TextField fullWidth variant="outlined" label={t('globalEditForm.phone')} name="phone" />}
						</InputMask>
					</Grid>
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<InputMask
							mask={ `(${phoneCode}) 9999999999`}
							value={props.cellphone}
							disabled={false}
							maskChar=" "
							onChange={(e) => props.setCellphone(e.target.value)}
							>
							{() => <TextField fullWidth variant="outlined" label={t('globalEditForm.cellPhone')} name="cellphone" />}
						</InputMask>
					</Grid>
					
					<Grid className={noProjectCheck} item xs={12}>
						<TextField fullWidth multiline rows={2} rowsMax={4} variant="outlined" label={t('globalEditForm.references')} name="reference" value={props.reference} onChange={(e) => props.setReference(e.target.value)}/>
					</Grid>
							
					<Grid className={noProjectCheck} item xs={12}>
						<h6>{t('globalEditForm.title#2')}</h6>
					</Grid>
						
				
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.businessName')} name="business_name" value={props.business_name} onChange={(e) => props.setBusinessName(e.target.value)}/>
					</Grid>
					<Grid className={noProjectCheck} item xs={12} sm={6}>

						<InputMask
							mask={rfcDocumentMasks[props.country] || null}
              value={props.rfc}
							disabled={false}
							maskChar={null}
							onChange={handleRfc}
							>
							{() => <TextField fullWidth variant="outlined" label={rfcLabel} name="rfc" />}
						</InputMask>
					</Grid>

					<Grid className={commercialBusinessCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.commercialBusiness')} name="commercial_business" value={props.commercial_business} onChange={(e) => props.setCommercialBusiness(e.target.value)}/>
					</Grid>

					
					
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" type="email" label={t('globalEditForm.email')} name="email_fn" value={props.email_fn} onChange={(e) => props.setEmailFn(e.target.value)}/>
					</Grid>
					
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<FormControlLabel
							className="mg-top-25"
							control={
							<Checkbox
								checked={sameAddress}
								onChange={handleSameAddressChange}
								name="sameAddress"
								color="primary"
							/>
							}
							label={t('globalEditForm.sameAddress')}
						/>
					</Grid>

					<Grid className={zipcodeCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.zipcode')} name="zipcode_fn" value={props.zipcode_fn} onChange={(e) => handleZipcodeFNChange(e) }/>
					</Grid>
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<Autocomplete
							id="state-fn-select"
							disableListWrap
							disabled={zipcodeRequired}
							options={props.administrativeDemarcationsFN}
							value={props.administrativeDemarcationsFNValue}
							onChange={(event, newValue) => {
								if (typeof newValue === 'string') {
									props.setStateFn(newValue)
								} else if (newValue && newValue.inputValue) {
									props.setStateFn(newValue.value)
									props.setAdministrativeDemarcationsFNValue(newValue)  
								} else {
									props.setStateFn(newValue.value)
									props.setAdministrativeDemarcationsFNValue(newValue)  
								}							
							}}
							selectOnFocus
							clearOnBlur
							handleHomeEndKeys
							freeSolo
							getOptionLabel={(option) => option.label}
							renderInput={(params) => <TextField {...params} fullWidth label={stateLabel} variant="outlined" name="state_fn"/>}
						/>
					</Grid>

					<Grid className={delegationCheck}  item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.delegation')} name="delegation_fn" value={props.delegation_fn} onChange={(e) => props.setDelegationFn(e.target.value)}/>
					</Grid>
					<Grid className={colonyCheck} item xs={12} sm={6}>
						<Autocomplete
							id="colony-fn-select"
							
							options={props.coloniesFN}
							value={props.coloniesFNValue}
							disableListWrap
							onChange={(event, newValue) => {
								if (typeof newValue === 'string') {
									props.setColonyFn(newValue)
								} else if (newValue && newValue.value) {
									props.setColonyFn(newValue.label)
									props.setColoniesFNValue(newValue)  
								} else {
									props.setColonyFn(newValue.label)
									props.setColoniesFNValue(newValue)  
								}
							}}
							selectOnFocus
							clearOnBlur
							handleHomeEndKeys
							freeSolo
							getOptionLabel={(option) => option.label}
							renderInput={(params) => <TextField {...params} fullWidth label={t('globalEditForm.colony')} variant="outlined" name="colony"/>}
						/>
					</Grid>
					
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<FormControl variant="outlined" className="MuiFormControl-fullWidth">
							<InputLabel id="street_type-simple-select-outlined-label">{t('globalEditForm.StreetType')}</InputLabel>
							<Select
							labelId="street_type-simple-select-outlined-label"
							id="street_type-simple-select-outlined"
							value={props.street_type_fn}
							onChange={(e) => props.setStreettypeFn(e.target.value)}
							label={t('globalEditForm.StreetType')}
							name="street_type_fn"
							>
							{street_types.map((value) => (
								<MenuItem key={value} value={value}>{value}</MenuItem>
							))}
							</Select>
						</FormControl>
					</Grid>

					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('globalEditForm.streetName')} name="street_name_fn" value={props.street_name_fn} onChange={(e) => props.setStreetNameFn(e.target.value)}/>
					</Grid>
					
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={extNumberLabel} name="ext_number_fn" value={props.ext_number_fn} onChange={(e) => props.setExtNumberFn(e.target.value)}/>
					</Grid>
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={intNumberLabel} name="int_number_fn" value={props.int_number_fn} onChange={(e) => props.setIntNumberFn(e.target.value)}/>
					</Grid>
					
					<Grid className={noProjectCheck} item xs={12} sm={6}>
						<InputMask
							mask={ `(${phoneCode}) 9999999999`}
							value={props.phone_fn}
							disabled={false}
							maskChar=" "
							onChange={(e) => props.setPhoneFn(e.target.value)}
							>
							{() => <TextField fullWidth variant="outlined" label={t('globalEditForm.phone')} name="phone_fn" />}
						</InputMask>
					</Grid>

					<Grid item xs={12} container
						direction="row"
						justify="flex-end"
						alignItems="center">
						<div className={classes.wrapper}>
							<Button id="customer-save" disabled={props.loading} onClick={handleSubmitButtonClick} type="submit" variant="contained" color="primary">
							{t('globalText.save')}
							</Button>
							{props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
						</div>
					</Grid>	
				</Grid>
			</form>
		 	
	  	</React.Fragment>
    );
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(CustomerForm)
export const country_names_g = country_names
export const countries_g = countries
export const street_types_mx_g = street_types_mx
export const street_types_cl_g = street_types_cl

