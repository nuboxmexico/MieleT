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
import InputMask from 'react-input-mask';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {country_names_g} from 'components/customers/CustomerForm';
import {useTranslation} from 'react-i18next';

function AdditionalForm(props){
    const {t} = useTranslation();
    const [phoneCode, setPhoneCode] = useState("");
    useEffect(() => {
		setPhoneCode(country_names_g.find(country => country["iso"] == props.country)["phone_code"] )
	});

    return (
        <React.Fragment>
              <form className="custom-form" onSubmit={props.handleSubmit} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} autoComplete="off">
                  
                  <Grid container spacing={3}>

                      <Grid item xs={12} sm={6}>
                          <TextField fullWidth variant="outlined" label={t('globalEditForm.name')} name="firstname" value={props.names} onChange={(e) => props.setFirstname(e.target.value)}/>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                          <TextField fullWidth variant="outlined" label={t('globalEditForm.lastName')} name="lastname" value={props.lastname} onChange={(e) => props.setLastname(e.target.value)}/>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                          <TextField fullWidth variant="outlined" label={t('globalEditForm.surName')}name="surname" value={props.surname} onChange={(e) => props.setSurname(e.target.value)}/>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                          <TextField fullWidth variant="outlined" type="email" label={t('globalEditForm.email')} name="email" value={props.email} onChange={(e) => props.setEmail(e.target.value)}/>
                      </Grid>

                      <Grid item xs={12} sm={6}>
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

                      <Grid item xs={12} sm={6}>
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
export default connect(structuredSelector, mapDispatchToProps)(AdditionalForm)
