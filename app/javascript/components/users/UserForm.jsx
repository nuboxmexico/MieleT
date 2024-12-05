import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"

import TextField from '@material-ui/core/TextField';
import InputMask from 'react-input-mask';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';

import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import ReactCountryFlag from "react-country-flag";

import {country_names_g} from 'components/customers/CustomerForm';

// Button loading
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import useCountries from 'hooks/useCountries';
import { useTranslation } from 'react-i18next';

const names = [
	'Administrador',
	'Contact Center',
	'Technical Management',
	'Field Service',
	'Técnico',
	'Cliente',
	'Entregas/Despacho',
	'Home Program',
	'Finanzas'
  ];

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
  }));

function UserForm(props){
  const {data: countries, loading: loadingCountries} =  useCountries()
	const [phoneCode, setPhoneCode] = useState("+52");
	const {t} = useTranslation();
	// Button loading
	const classes = useStyles();
	const [loading, setLoading] = React.useState(false);
  	const [countryIsos, setCountryIsos] = useState([])

	
  useEffect(() => {
    if (loadingCountries) return

    setCountryIsos(countries.map(country => country.iso))
  }, [loadingCountries])
  

	const handleSubmitButtonClick = (e) => {
	  if (!loading) {
		setLoading(true);
		props.handleSubmit(e, setLoading)
	  }
	};

	function handleDisabledChange(e){
		props.setDisabled(!props.disabled);
    }
	
    useEffect(() => {
    if (loadingCountries) return

		if (props.country[0]){
			setPhoneCode(countries.find(country => country["iso"] == props.country[0]).phone_code )
		}
		
	});

	function handleCountryInputs(e){
		props.setCountry(e.target.value);
		if(e.target.value.length > 0 ){
			setPhoneCode(countries.find(country => country["iso"] == e.target.value[0])["phone_code"] )
		}
	}

    return (
		<React.Fragment>
			<form className="custom-form" onSubmit={props.handleSubmit} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} autoComplete="off">

				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<FormControl required className="MuiFormControl-fullWidth Mui-MultiSelect" variant="outlined">
							<InputLabel className="white-bg padding-sides-5" htmlFor="select-multiple-chip-country" id="country-chip-multiple-label">País</InputLabel>
							<Select
							id="country-chip-multiple"
							multiple
							value={props.country}
							onChange={(e) => handleCountryInputs(e)}
							input={<OutlinedInput id="select-multiple-chip-country" />}
							renderValue={(selected) => (
								<div className="">
								{!loadingCountries && selected.map((value) => (
									<Chip key={value} label={<MenuItem key={value} value={value} >
									<ReactCountryFlag
											countryCode={value}
											svg
											style={{
												width: '2em',
												height: '2em',
												marginRight: "15px",
											}}
											title={value}
										/>
										<ListItemText primary={countries.find(object => object["iso"] ===  value).name} />
									</MenuItem>} className="" />
								))}
								</div>
							)}
							>
							{!loadingCountries && countryIsos.map((name) => (
								<MenuItem key={name} value={name} >
									<Checkbox color="primary" checked={props.country.indexOf(name) > -1} />
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
									<ListItemText primary={countries.find(country => country.iso === name).name} />
								</MenuItem>
							))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField required fullWidth variant="outlined" label={t('users.globalUserForm.firstname')} name="firstname" value={props.firstname} onChange={(e) => props.setFirstname(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField required fullWidth variant="outlined" label={t('users.globalUserForm.lastName')} name="lastname" value={props.lastname} onChange={(e) => props.setLastname(e.target.value)}/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField required fullWidth variant="outlined" label={t('users.globalUserForm.surName')} name="surname" value={props.surname} onChange={(e) => props.setSurname(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField required fullWidth variant="outlined" type="email" label="Email" name="email" value={props.email} onChange={(e) => props.setEmail(e.target.value)}/>
					</Grid>
					
					<Grid item xs={12} sm={6}>
							<InputMask
                                mask={ `(${phoneCode}) 9999999999`}
                                value={props.phone}
                                disabled={false}
                                maskChar=" "
                                onChange={(e) => props.setPhone(e.target.value)}
                                >
                                {() => <TextField fullWidth variant="outlined" label={t('users.globalUserForm.phone')} name="phone" />}
                            </InputMask>
					</Grid>
					<Grid item xs={12} sm={6}>
							<InputMask
                                mask={ `(${phoneCode}) 9999999999`}
                                value={props.cellphone}
                                disabled={false}
                                maskChar=" "
                                onChange={(e) => props.setCellphone(e.target.value)}
                                >
                                {() => <TextField fullWidth variant="outlined" label={t('users.globalUserForm.mobile')} name="cellphone" />}
                            </InputMask>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Autocomplete
						id="center-cost-select"
						options={props.costCenters}
						value={props.costCenterValue}
						onChange={(event, newValue) => {
							props.setCostCenter(newValue.value)
							props.setCostCenterValue(newValue)
						}}
						getOptionLabel={(option) => option.label}
						renderInput={(params) => <TextField {...params} fullWidth label={t('users.globalUserForm.costCenter')} variant="outlined" name="costCenter"/>}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Autocomplete
              required
							id="roleId-select"
							options={props.userUniqueiIds}
							value={props.uniqueiIdsValue}
							onChange={(event, newValue) => {
								props.setRoleId(newValue.value)
								props.setUniqueiIdsValue(newValue)
							}}
							getOptionLabel={(option) => option.label}
							renderInput={(params) => <TextField {...params} fullWidth label={t('users.globalUserForm.roleId')} variant="outlined" name="roleId"/>}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<FormControl variant="outlined" className="MuiFormControl-fullWidth">
							<InputLabel id="demo-simple-select-outlined-label">{t('users.globalUserForm.workingDay')}</InputLabel>
							<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							value={props.worktime}
							onChange={(e) => props.setWorktime(e.target.value)}
							label="Jornada"
							name="worktime"
							>
							<MenuItem value={"Full-Time"}>Full-Time</MenuItem>
							<MenuItem value={"Part-Time"}>Part-Time</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl required className="MuiFormControl-fullWidth Mui-MultiSelect" variant="outlined">
							<InputLabel className="white-bg padding-sides-5" htmlFor="select-multiple-chip" id="role-chip-multiple-label">Rol</InputLabel>
							<Select
							id="role-chip-multiple"
							multiple
							value={props.roleName}
							onChange={(e) => props.setRoleName(e.target.value)}
							input={<OutlinedInput id="select-multiple-chip" />}
							renderValue={(selected) => (
								<div className="">
								{selected.map((value) => (
									<Chip key={value} label={value} className="" />
								))}
								</div>
							)}
							>
							{names.map((name) => (
								<MenuItem key={name} value={name} >
									<Checkbox color="primary" checked={props.roleName.indexOf(name) > -1} />
									<ListItemText primary={name} />
								</MenuItem>
							))}
							</Select>
						</FormControl>
					</Grid>
					
					<Grid item xs={12} sm={6}>
						<FormControl className={"MuiFormControl-fullWidth custom-from-password "+props.passwordClass} variant="outlined">
							<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
							<OutlinedInput
								id="outlined-adornment-password"
								type={props.showPassword ? 'text' : 'password'}
								value={props.password}
								onChange={(e) => props.setPassword(e.target.value)}
								name="password"
								endAdornment={
								<InputAdornment position="end">
									<IconButton
									aria-label="toggle password visibility"
									onClick={props.handleClickShowPassword}
									onMouseDown={props.handleMouseDownPassword}
									>
									{props.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
								}
								labelWidth={70}
							/>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={6}>
						<span className="mdl-navigation__link">
							<Checkbox color="primary" checked={props.disabled} onClick={(e) => handleDisabledChange(e)} />
							&nbsp;
							<span className="quotation-product-name quotation-product-labor-price">{t('users.globalUserForm.disabledCheckButtonP1')} <strong>{t('users.globalUserForm.disabledCheckButtonP2')}</strong>?</span>
						</span>
					</Grid>
					<Grid item xs={12} container
						direction="row"
						justify="flex-end"
						alignItems="center">
						<div className={classes.wrapper}>
							<Button id="user-save" disabled={loading} onClick={handleSubmitButtonClick} type="submit" variant="contained" color="primary">
							{t('globalText.save')}
							</Button>
							{loading && <CircularProgress size={24} className={classes.buttonProgress} />}
						</div>
					</Grid>	
				</Grid>
			</form>
		 	
	  	</React.Fragment>
    );
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(UserForm)
