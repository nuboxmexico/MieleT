import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import {csrf, headers,api_token, getRandomColor, getTechiniansInfo, getProductsInfo} from "constants/csrf"

import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { flash_alert } from 'components/App';
import { makeStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

// TABS
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CheckboxTree from 'react-checkbox-tree';

// Accordeon
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TechnicianReintegratedSpareParts from "components/technicians/TechnicianReintegratedSpareParts"

//Calendar
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
import daygridPlugin from "@fullcalendar/daygrid";
import EventTooltip from '../calendars/EventTooltip';
import esLocale from '@fullcalendar/core/locales/es';

// Data Upload
import { DropzoneArea } from 'material-ui-dropzone';

//Translation
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {serviceTypes} from 'constants/technicians';


const GET_CALENDAR_EVENTS_REQUEST = "GET_CALENDAR_EVENTS_REQUEST";
const GET_CALENDAR_EVENTS_SUCCESS = "GET_CALENDAR_EVENTS_SUCCESS";
axios.defaults.headers.common['Authorization'] = `Token token=${api_token(process.env.RAILS_ENV)}` 
function getCalendarEvents(user) {
    return dispatch => {
    dispatch({type: GET_CALENDAR_EVENTS_REQUEST});
    return fetch(`/api/v1/calendar_events?country=${user}`)
        .then(response => response.json())
        .then(json => dispatch(getCalendarEventsSuccess(json)))
        .catch(error => console.log(error));
    };
};

export function getCalendarEventsSuccess(json) {
    return {
    type: GET_CALENDAR_EVENTS_SUCCESS,
    json
    };
};
    
  
const useStyles = makeStyles((theme) => ({
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
      },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
	},
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
	previewChip: {
		minWidth: 160,
		maxWidth: 210
	},
  }));
  

function labelName(name){
	if( name == 'Instalación'){
		return "installation"
	}
	else if( name == 'Mantenimiento'){
		return "maintenance"
	}
	else if( name == 'Reparación'){
		return "repair"
	}
	else if( name == 'Diagnóstico en Taller'){
		return "diagnosis"
	}
	else if( name == 'Home Program'){
		return "home_program"
	}
	else if( name == 'Entregas/Despachos'){
		return "delivery"
	}
	
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;
  
	return (
	  <div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	  >
		{value === index && (
		  <Box p={3}>
			<Typography>{children}</Typography>
		  </Box>
		)}
	  </div>
	);
  }
  
  TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
	return {
	  id: `simple-tab-${index}`,
	  'aria-controls': `simple-tabpanel-${index}`,
	};
  }
  


function TechnicianForm(props){
  const [loadingTaxons, setLoadingTaxons] = useState(true)
  const {t} = useTranslation();
	const [currentTab, setCurrentTab] = useState(0);
	const [techTaxon, setTechTaxon] = useState([]);
	
	const classes = useStyles();

  const [allTechnicians, setAllTechnicians] = useState([])
	const [expandedinstallation, setExpandedinstallation] = useState([]);
	const [expandedmaintenance, setExpandedmaintenance] = useState([]);
	const [expandedrepair, setExpandedrepair] = useState([]);
	const [expandeddiagnosis, setExpandeddiagnosis] =  useState([]);
	const [expandedhome_program, setExpandedHomeProgram] = useState([]);
	const [expandeddelivery, setDelivery] = useState([]);
	
	
	// Calendar accordeon
	const [expanded, setExpanded] = useState(false);
	const calendarRef = React.useRef('')
	const [eventID, setEventID] = useState(1);
	
	function getAllTechnicians() {
    axios.get('/api/v1/all_technicians', {headers: headers})
         .then(response => setAllTechnicians(response.data))
  }

	function onZoneChangeFiles(e){
		if(e.length > 0){
			props.setZoneFile(e[0]);
		}
	}


	const handleSubmitButtonClick = (e) => {
	  if (!props.loading) {
		props.setLoading(true);
		props.handleSubmit(e)
	  }
	};
	

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
	
	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};

	function handleCheckedTaxon(checked, from, label){
		if(from == "installation" ){
			props.setCheckedinstallation(checked)
		}else if (from == "maintenance" ){
			props.setCheckedmaintenance(checked)
		}else if (from == "repair" ){
			props.setCheckedrepair(checked)
		}else if (from == "diagnosis" ){
			props.setCheckeddiagnosis(checked)
		}else if (from == "home_program" ){
			props.setCheckedHomeProgram(checked)
		}else if (from == "delivery" ){
			props.setCheckedDelivery(checked)
		}
	}

	function handleExpandedTaxon(expanded, from){
		if(from == "installation" ){
			setExpandedinstallation(expanded)
		}else if (from == "maintenance" ){
			setExpandedmaintenance(expanded)
		}else if (from == "repair" ){
			setExpandedrepair(expanded)
		}else if (from == "diagnosis" ){
			setExpandeddiagnosis(expanded)
		}else if (from == "home_program" ){
			setExpandedHomeProgram(expanded)
		}else if (from == "delivery" ){
			setDelivery(expanded)
		}
		
	}

	function handleImageChange(e){
		if (e.target.files[0]){
			props.setPhoto(e.target.files[0]);
		}
	};

	const handleDateClick = (arg) => { // bind with an arrow function
    }
    
       
    const handleDateSelect = (arg) => { // bind with an arrow function
        let calendarApi = arg.view.calendar
        calendarApi.addEvent({
			id: eventID,
            title: `Bloqueado`,
            description: `Tecnico: ${props.userdata.firstname + " " + props.userdata.lastname}`,
            start: arg.startStr,
            end: arg.endStr,
            allDay: arg.allDay,
            color: getRandomColor()
		});
		
		props.newEvents.push({
			id: eventID,
            title: `Bloqueado`,
            description: `Tecnico: ${props.userdata.firstname + " " + props.userdata.lastname}`,
            start: arg.startStr,
            end: arg.endStr,
            allDay: arg.allDay,
            color: getRandomColor()
		});
		
		calendarApi.updateSize();
		setEventID((eventID + 1));
    }

    const handleDateUnselect = (arg) => { // bind with an arrow function
        console.log(arg);
    }
    

    const handleEventClick = (clickInfo) => {
        if(clickInfo.event.title){
            if (confirm(`${t('technicians.flashAlert.confirm')}, ${clickInfo.event.title}, ${clickInfo.event.extendedProps.description}'?`)) {
				var temp_events = props.newEvents
				var temp_event = temp_events.findIndex(event => event.id == clickInfo.event.id) 
				
				if (temp_event > -1) {
					temp_events.splice(temp_event, 1);
				}

				props.setNewEvents(temp_events)
				
				if (clickInfo.event.groupId == "Blocked_Technician"){
					var body = new FormData();
					body.set('start_date', clickInfo.event.start);
					body.set('finish_date', clickInfo.event.end);
					body.set('technician_id', props.technicianID);
					axios.post('/api/v1/calendar_events/destroy_event', body, { headers: props.headers})
					.then(response => {
						flash_alert(t('technicians.flashAlert.done'), t('technicians.flashAlert.unlockedDate'), "success")
						setOpen(false);
					})
					.catch(e => {
						if(e.response.data){
							for (var key in e.response.data) {
								flash_alert(t('globalText.error'), e.response.data[key], "danger")
							}
						}
					});
				
				}
				clickInfo.event.remove()
            }
        }
    }
	async function handleSchedule(e){
		e.preventDefault();
		setOpen(false);
    }

    function renderInnerContent( innerProps ) {
        return (
            <span className="fc-daygrid-dot-event">
                <div className="fc-daygrid-event-dot" style={{ "borderColor": innerProps.backgroundColor }}></div>
                <div className="fc-event-time">{ innerProps.timeText }</div>
                <div className="fc-event-title">{ innerProps.event.title || "" }</div>
            </span>
        );
    }

	async function fetchTaxonData(country) {
		return fetch(`/api/v1/taxons?keywords=tickets&country=${country}`)
			.then(response => response.json())
			.then(json => {
				setTechTaxon(json)
        if (!!json.length) {
          setLoadingTaxons(false)
        }
			})
      .catch(error => {
        console.log(error)
        setLoadingTaxons(true)
      });
	}
	useEffect(() => {
		if(props.userdata != {} && props.userdata != undefined){
			props.getCalendarEvents(props.userdata.country);
		}
	}, [props.userdata]);

	useEffect(() => {
		if(props.technicianID){
			async function fetchTechnicianEventsData() {
				return fetch(`/api/v1/technician_calendar_events?technician_id=${props.technicianID}`)
					.then(response => response.json())
					.then(json => {
						json.data.forEach(event => {
							event.display = ""
							calendarRef.current.getApi().addEvent(event);
						});
					})
					.catch(error => console.log(error));
			}
			fetchTechnicianEventsData();
		}
	}, [props.technicianID]);

	useEffect(() => {
		if(props.userdata != {} && props.userdata != undefined){
			if(props.userdata.id != props.user ){
				async function fetchUserData() {
					let userId = props.user;
					return fetch(`/api/v1/users/${userId}`)
						.then(response => response.json())
						.then(json => {
							if(json.data){
								props.setUser(json.data.id)
								props.setUserdata(json.data)
								props.getCalendarEvents(json.data.country);
								fetchTaxonData(json.data.country);
							}
						})
						.catch(error => console.log(error));
				}
				fetchUserData();
        getAllTechnicians();
			}
		}
	}, [props.user]);

    return (
		<React.Fragment>
			<form className="custom-form" onSubmit={props.handleSubmit} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} autoComplete="off">

				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<Autocomplete
						id="asynchronous-users"
						onChange={(event, newValue) => {
							props.setUser(newValue.value);
							props.setSelectedOption(newValue);
						}}
						getOptionSelected={(option, value) => option.label === value.label}
						getOptionLabel={(option) => option.label}
						options={props.options}
						value={props.selectedOption}
						renderInput={(params) => (
							<TextField
							{...params}
							autoComplete={"false"}
							type="search"
							label={t('technicians.editForm.choseTechnicians')}
							variant="outlined"
							name="client_name"
							className="asynchronous-users"
							InputProps={{
								...params.InputProps,
								endAdornment: (
								<React.Fragment>
									{params.InputProps.endAdornment}
								</React.Fragment>
								),
							}}
							/>
						)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
							<TextField fullWidth variant="outlined" label={t('technicians.editForm.enterprise')} name="enterprise" value={props.enterprise} onChange={(e) => props.setEnterprise(e.target.value)}/>
					</Grid>
					
					<Grid item xs={12} sm={6}>
						<FormControl className="MuiFormControl-fullWidth Mui-MultiSelect" variant="outlined">
							<InputLabel focused className="white-bg padding-sides-5 MuiInputLabel-shrink" htmlFor="select-multiple-chip" id="role-chip-multiple-label">{t('technicians.editForm.photo')}</InputLabel>
								
							<OutlinedInput fullWidth variant="outlined"  type="file" name="newPhoto" accept="image/png, image/jpeg, image/svg" onChange={handleImageChange} />
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
							<TextField fullWidth variant="outlined" label={t('technicians.editForm.store')} name="store" value={props.store} onChange={(e) => props.setStore(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl className="MuiFormControl-fullWidth Mui-MultiSelect" variant="outlined">
							<InputLabel className="white-bg padding-sides-5" htmlFor="select-multiple-chip" id="role-chip-multiple-label">{t('technicians.editForm.selectMultipleChip')}</InputLabel>
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
							{serviceTypes(i18next.language).map((serviceType) => (
								<MenuItem key={serviceType.key} value={serviceType.key} >
									<Checkbox color="primary" checked={props.roleName.indexOf(serviceType.key) > -1} />
									<ListItemText primary={serviceType.label} />
								</MenuItem>
							))}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('technicians.editForm.vehicleInfo')} name="vehicleInfo" value={props.vehicleInfo} onChange={(e) => props.setVehicleInfo(e.target.value)}/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField fullWidth variant="outlined" label={t('technicians.editForm.vehicleLicense')} name="vehicleLicense" value={props.vehicleLicense} onChange={(e) => props.setVehicleLicense(e.target.value)}/>
					</Grid>
					<Grid item xs={12}>
						<h1>{t('technicians.editForm.techniciansCompetents')}</h1>
						{props.roleName.length > 0 ?  "" : t('technicians.flashAlert.noSelectActivity')}
						<Tabs value={currentTab} onChange={handleTabChange} aria-label="simple tabs example"
								indicatorColor="primary"
								variant="scrollable"
								scrollButtons="auto"
								className="tech-taxon-tabs"
							>
							{props.roleName.map((name) => (
								<Tab key={name} label={name} {...a11yProps(props.roleName.indexOf(name))} />
							))}
						</Tabs>
						{props.roleName.map((name) => (
							<TabPanel key={name} value={currentTab} index={props.roleName.indexOf(name)}>
                {
                  !loadingTaxons && <CheckboxTree
									nodes={techTaxon}
									checked={eval("props.checked"+ labelName(name))}
									expanded={eval("expanded"+ labelName(name))}
									onCheck={(checked, label) => handleCheckedTaxon(checked, labelName(name), label)}
									onExpand={expanded => handleExpandedTaxon(expanded, labelName(name))}
									checkModel={"all"}
									icons={{
										check: <i className="material-icons">check_box</i>,
										uncheck: <i className="material-icons">check_box_outline_blank</i>,
										halfCheck: <i className="material-icons">indeterminate_check_box</i>,
										expandClose: <i className="material-icons">expand_more</i>,
										expandOpen: <i className="material-icons">chevron_right</i>,
										expandAll: <i className="material-icons">add_circle</i>,
										collapseAll: <i className="material-icons">remove_circle</i>,
										parentClose: <span></span>,
										parentOpen: <span></span>,
										leaf: <span></span>,
									}}
								
								/>

                }
							</TabPanel>
						))}
					</Grid>
					<Grid item xs={12}>
						<Accordion className="tech-calendar-accordeon" expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
							<AccordionSummary
							className="technician-calendar-accordeon-summary"
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1bh-content"
							id="panel1bh-header"
							>
							<Typography variant="h1">{t('technicians.scheduledTechnicians')}</Typography>
							<Typography className={classes.secondaryHeading}></Typography>
							</AccordionSummary>
							<AccordionDetails className={"calendar-full-width"}>
								<FullCalendar
								timeZone= {'local'}
								plugins={[ dayGridPlugin, interactionPlugin,timegridPlugin, daygridPlugin ]}
								initialView="timeGridWeek"
								selectable={true}
								ref={calendarRef}
								//weekends={false}
								
								events={
									props.calendar_events
								}
								selectOverlap={function(event) {
									return event.rendering === 'background';
								}}
								headerToolbar={{
									start: 'today',
									center: 'prevYear,prev,title,next,nextYear',
									end: 'dayGridMonth,timeGridWeek,timeGridDay'
								}}
								slotLabelFormat={  { month: 'long', year: 'numeric' },
													{ hour: 'numeric',
													minute: '2-digit',meridiem: 'short', hour12: true }}
								locale={esLocale}
								slotDuration={"01:00:00"}
								slotMinTime={"07:00"}
								slotMaxTime={"21:00"}
								dateClick={handleDateClick}
								select={handleDateSelect}
								unselect={handleDateUnselect}
								eventClick={handleEventClick}
								eventContent={ ( arg ) => {
									return (
                    <EventTooltip arg={arg} tecnicos={allTechnicians} />
									);
								}}
								businessHours= {{
									daysOfWeek: [0, 1, 2, 3, 4, 5, 6 ],
									startTime: '07:00',
									endTime: '21:00',
								}}
								/>
							</AccordionDetails>
						</Accordion>
					</Grid>
					<Grid item xs={12}>
						<Accordion className="tech-calendar-accordeon" expanded={expanded === 'panelzipcode'} onChange={handleChange('panelzipcode')}>
							<AccordionSummary
							className="technician-calendar-accordeon-summary"
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panelzipcodebh-content"
							id="panelzipcodebh-header"
							>
							<Typography variant="h1">{t('technicians.techniciansZone')}</Typography>
							<Typography className={classes.secondaryHeading}></Typography>
							</AccordionSummary>
							<AccordionDetails className={"calendar-full-width"}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<DropzoneArea
										name={"zones_file"}
										dropzoneText={t('technicians.flashAlert.zoneFileText')}
										onChange={onZoneChangeFiles}
										showPreviews={true}
										showPreviewsInDropzone={false}
										useChipsForPreview
										previewGridProps={{container: { spacing: 1, direction: 'row' }}}
										previewChipProps={{classes: { root: classes.previewChip } }}
										previewText={t('technicians.flashAlert.selectedFile')}
										filesLimit={1}
										showAlerts={false}
									/>
								</Grid>
								{
								 props.technicianID && 
								 <Grid item xs={12}>
									<Button variant="contained" color="primary" href={"/download_zipcodes?technician_id="+ props.technicianID}>
                                        {t('technicians.infoDownload')}
									</Button>
								</Grid>
								}
							</Grid>
							</AccordionDetails>
						</Accordion>
					</Grid>
					{
						props.technicianID &&
							<Grid item xs={12}>
								<Accordion className="tech-calendar-accordeon" expanded={expanded === 'panelspare_parts'} onChange={handleChange('panelspare_parts')}>
									<AccordionSummary
									className="technician-calendar-accordeon-summary"
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panelspare_partsbh-content"
									id="panelspare_partsbh-header"
									>
									<Typography variant="h1">{t('technicians.editForm.spareParts')}</Typography>
									<Typography className={classes.secondaryHeading}></Typography>
									</AccordionSummary>
									<AccordionDetails className={"technician-spare-part"}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<TechnicianReintegratedSpareParts 
												technician_id={props.technicianID}
											/>
										</Grid>
									</Grid>
									</AccordionDetails>
								</Accordion>
							</Grid>
					}

					<Grid item xs={12} container
						direction="row"
						justify="center"
						alignItems="center">
						<div className={classes.wrapper}>
							
							<Button disabled={props.loading} onClick={handleSubmitButtonClick}  id="techinician-save" type="submit" variant="contained" color="primary">
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

const structuredSelector = createStructuredSelector({
    calendar_events: state => state.calendar_events,
});
const mapDispatchToProps = {getCalendarEvents};
export default connect(structuredSelector, mapDispatchToProps)(TechnicianForm)

