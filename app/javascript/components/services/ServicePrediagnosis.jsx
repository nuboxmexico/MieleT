import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {is_TM, is_CS} from "constants/user_functions"
import { flash_alert } from 'components/App';

import CircularProgress from '@material-ui/core/CircularProgress';
//Accordeon 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MaterialTable from 'react-data-table-component';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

function ServicePrediagnosis(props){
    const {t} = useTranslation();

	return (
		<React.Fragment>

            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="paneladditional-header"
                >
                <h1 className="panel-custom-title">{t('services.preDiagnostic.title')}</h1>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <p className="service-subtitle">{t('services.preDiagnostic.subTitle')}</p>
                        </Grid>
                        <Grid item xs={12}>
                            <MaterialTable
                                noHeader={true}
                                columns={props.spare_part_columns}
                                data={props.spare_parts}
                                progressPending={props.userLoading}
                                progressComponent={<CircularProgress size={75} />}
                                responsive={true}
                                highlightOnHover={true}
                                striped={true}
                                contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                                noDataComponent={i18next.t('globalText.NoDataComponent')}
                                paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                            />
                        </Grid>
                
                        { props.canAddSparePart &&
                            <>
                            <Grid item xs={12}>
                                <p className="service-subtitle">{t('services.preDiagnostic.addSpareParts')}</p>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box component="span" display={props.displayProducTable} p={0} m={0} bgcolor="background.paper">
                                <Grid container spacing={1} direction="row" justify="flex-start" alignItems="center" className={props.classes.root}>
                                    <FormControl variant="outlined" fullWidth>
                                    <InputLabel className="white-bg padding-sides-5 table-search-label"  htmlFor="search">{t('globalText.filterFor')}</InputLabel>
                                    <OutlinedInput
                                        id="search"
                                        type= "text"
                                        className="table-search-input"
                                        value={props.filterText}
                                        onChange={props.changeFilterText}
                                        endAdornment={
                                            <InputAdornment className="table-search-end" position="end" >
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={props.handleClear}
                                                    >
                                                {<Close />}
                                                </IconButton>
                                            
                                            </InputAdornment>
                                        }
                                        />
                                    </FormControl>
                                </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid container spacing={1} direction="row" justify="flex-end" alignItems="center">
                                    <Box component="span" display={props.displayProducTable} p={0} m={0} bgcolor="background.paper">
                                        <Button variant="contained" id="add-customer-product" onClick={props.handleAddSparePart} color="primary">
                                            {t('services.preDiagnostic.addSpareParts')}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Box component="span" display={props.displayProducTable} p={0} m={0} bgcolor="background.paper">
                                    <MaterialTable
                                        noHeader={true}
                                        columns={props.products_columns}
                                        data={props.products}
                                        progressPending={props.userLoading}
                                        progressComponent={<CircularProgress size={75} />}
                                        pagination
                                        paginationServer
                                        responsive={true}
                                        onChangeRowsPerPage={props.handleProductsPerRowsChange}
                                        onChangePage={props.handleProductsPageChange}
                                        onSelectedRowsChange={props.handleProductRowChange}
                                        paginationTotalRows={props.total}
                                        highlightOnHover={true}
                                        striped={true}
                                        selectableRows
                                        selectableRowsComponent={Checkbox}
                                        selectableRowsComponentProps={{ className: "product-checkbox", color: "primary" }}
                                        contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                                        noDataComponent={i18next.t('globalText.NoDataComponent')}
                                        paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                                    />
                                
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth variant="outlined" multiline disabled={props.checkBackgroundPrediagnosis || !is_TM(props.current_user)} rows={8} label={t('services.preDiagnostic.backgroundPrediagnosis')} name="backgroundPrediagnosis" value={props.backgroundPrediagnosis} onChange={(e) => props.setBackgroundPrediagnosis(e.target.value)} />
                            </Grid>
                            <Grid item xs={12}>
                            
                                <div className={props.classes.wrapper}>
                                    <Button id="service-save" disabled={props.loading || props.checkBackgroundPrediagnosis || !is_TM(props.current_user)} type="submit" variant="contained" color="primary" onClick={props.handlePrediagnosisSubmit}>
                                    {t('services.preDiagnostic.saveAndSendButton')}
                                    </Button>
                                    {props.loading && <CircularProgress size={24} className={props.classes.buttonProgress} />}
                                </div>
                            </Grid>
                                
                            </>
                        }
                    </Grid>
                    

                </AccordionDetails>
            </Accordion>
                

		    
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(ServicePrediagnosis)
