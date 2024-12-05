import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { flash_alert } from 'components/App';
import ShowCustomer from "components/customers/ShowCustomer";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import {country_names_g, countries_g, street_types_mx_g, street_types_cl_g} from 'components/customers/CustomerForm';
import {useTranslation} from 'react-i18next';

function AdditionalAddressForm(props){
    const {t} = useTranslation();
    const [personCheck, setPersonCheck] = useState("");
    const [zipcodeCheck, setZipcodeCheck] = useState("");
    const [stateLabel, setStateLabel] = useState("Estado");
    const [colonyCheck, setColonyCheck] = useState("");
	const [delegationCheck, setDelegationCheck] = useState("");
	const [extNumberLabel, setExtNumberLabel] = useState("Número Exterior");
	const [intNumberLabel, setIntNumberLabel] = useState("Número Interior");
    const [street_types, setStreetTypes] = useState([]);
    const [namesLabel, setNamesLabel] = useState("Nombre");
	const [personPCheck, setPersonPCheck] = useState("");
    const [personMCheck, setPersonMCheck] = useState("");
    
    // CHECK COUNTRY_ZIPCODE_REQUIRED
    const [zipcodeRequired, setZipcodeRequired] = useState(props.zipcodeParentRequired);
    
    useEffect(() => {
		handleCountryInputs(props.country)
        handlePersonInputs(props.country, props.selectedPerson)
    },[props.country]);
    
    function handlePersonInputs(country_iso, person_type){
		
		if (person_type == "person_m" && country_iso == "MX"){
			setPersonPCheck("hidden")
			setPersonMCheck("")
			setNamesLabel("Alias")
		}else{
			setPersonPCheck("")
			setPersonMCheck("hidden")
			setNamesLabel("Alias")
		}
	}
	
	function handleCountryInputs(country_iso){
		if(country_iso == "CL"){
			setPersonCheck("hidden");
			setZipcodeCheck("hidden");
			setDelegationCheck("hidden");
			setColonyCheck("hidden");
			setStateLabel("Comuna/Región");
			setExtNumberLabel("Número");
			setIntNumberLabel("Depto");
			setStreetTypes(street_types_cl_g);
			//props.fetchadministrativeDemarcationsData(props.country, "", "", "") 
		}else{
			setPersonCheck("");
			setZipcodeCheck("");
			setDelegationCheck("");
			setColonyCheck("");
			setStateLabel("Estado");
			setExtNumberLabel("Número Exterior");
			setIntNumberLabel("Número Interior");
			setStreetTypes(street_types_mx_g);
		}
    }
    
    const handleZipcodeChange = (event) => {
		props.setZipcode(event.target.value);
        if (event.target.value.length > 3){
            setZipcodeRequired(false)
            props.fetchadministrativeDemarcationsData(props.country, "", event.target.value, props.colony)
        }
	}

    return (
        <React.Fragment>
              <form className="custom-form" onSubmit={props.handleSubmit} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} autoComplete="off">
                  
                  <Grid container spacing={3}>


                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth variant="outlined" label={namesLabel} name="firstname" value={props.name} onChange={(e) => props.setName(e.target.value)}/>
                        </Grid>
                        <Grid className={zipcodeCheck} item xs={12} sm={6}>
                            <TextField fullWidth error={zipcodeRequired} variant="outlined" label={t('globalEditForm.zipcode')} name="zipcode" value={props.zipcode} onChange={(e) => handleZipcodeChange(e)}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                id="state-select"
                                
                                options={props.administrativeDemarcations}
                                value={props.administrativeDemarcationsValue}
                                disableListWrap
                                disabled={zipcodeRequired}
                                onChange={(event, newValue) => {
                                    if(newValue){
                                        if (typeof newValue === 'string') {
                                            props.setState(newValue)
                                        } else if (newValue && newValue.inputValue) {
                                            props.setState(newValue.value)
                                            props.setAdministrativeDemarcationsValue(newValue)  
                                        } else {
                                            props.setState(newValue.value)
                                            props.setAdministrativeDemarcationsValue(newValue)  
                                        }
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
                            <TextField fullWidth variant="outlined" label={t('globalEditForm.delegation')} name="delegation" value={props.delegation} onChange={(e) => props.setDelegation(e.target.value)}/>
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
                                renderInput={(params) => <TextField {...params} fullWidth label={t('globalEditForm.colony')}variant="outlined" name="colony"/>}
                            />
                        </Grid>
                            
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" className="MuiFormControl-fullWidth">
                                <InputLabel id="street_type-simple-select-outlined-label">{t('globalEditForm.StreetType')}</InputLabel>
                                <Select
                                labelId="street_type-simple-select-outlined-label"
                                id="street_type-simple-select-outlined"
                                value={props.street_type}
                                onChange={(e) => props.setStreettype(e.target.value)}
                                label={t('globalEditForm.Streettype')}
                                name="street_type"
                                >
                                {street_types.map((value) => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth variant="outlined" label={t('globalEditForm.streetName')} name="street_name" value={props.street_name} onChange={(e) => props.setStreetName(e.target.value)}/>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth variant="outlined" label={extNumberLabel} name="ext_number" value={props.ext_number} onChange={(e) => props.setExtNumber(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth variant="outlined" label={intNumberLabel} name="int_number" value={props.int_number} onChange={(e) => props.setIntNumber(e.target.value)}/>
					    </Grid>
                      <Grid item xs={12} container
                              direction="row"
                              justify="flex-end"
                              alignItems="center">
                              <FormControl>
                                  <Button id="additional-save" type="submit" variant="contained" color="primary">
                                  {t('globalText.save')}
                                  </Button>
                              </FormControl>
                      </Grid>	
                  </Grid>
              </form>
      </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(AdditionalAddressForm)
