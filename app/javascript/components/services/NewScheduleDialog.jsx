import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import {csrf, headers, getRandomColor, getTechiniansInfo, getProductsInfo} from "constants/csrf"
import { flash_alert } from 'components/App';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import CircularProgress from '@material-ui/core/CircularProgress';

//Calendar
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
import daygridPlugin from "@fullcalendar/daygrid";
import Tooltip from '@material-ui/core/Tooltip';
import esLocale from '@fullcalendar/core/locales/es';
 
// List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

// Accordeon
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



const GET_TECHNICIANS_TAXONS_REQUEST = "GET_TECHNICIANS_TAXONS_REQUEST";
const GET_TECHNICIANS_TAXONS_SUCCESS = "GET_TECHNICIANS_TAXONS_SUCCESS";

function getTechnicians(country = "", taxons_names="", taxon_type = "", zone = "") {
    return dispatch => {
      dispatch({type: GET_TECHNICIANS_TAXONS_REQUEST});
      return fetch(`/api/v1/get_technicians_by_taxon?country=${country}&taxons_names=${taxons_names}&taxon_type=${taxon_type}&zone=${zone}`)
        .then(response => response.json())
        .then(json => dispatch(getTechniciansSuccess(json)))
        .catch(error => console.log(error));
    };
  };
  
  export function getTechniciansSuccess(json) {
    return {
      type: GET_TECHNICIANS_TAXONS_SUCCESS,
      json
    };
  };


const GET_CALENDAR_EVENTS_REQUEST = "GET_CALENDAR_EVENTS_REQUEST";
const GET_CALENDAR_EVENTS_SUCCESS = "GET_CALENDAR_EVENTS_SUCCESS";

function getCalendarEvents(country_iso) {
    return dispatch => {
    dispatch({type: GET_CALENDAR_EVENTS_REQUEST});
    return fetch(`/api/v1/calendar_events?country=${country_iso}`)
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
    appBar: {
      position: 'relative',
      minHeight: "50px",
    },
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
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    buttonProgressRelative: {
        position: 'relative',
        left: '50%',
        marginTop: 12,
        marginLeft: -24,
    },
  }));
  

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function NewScheduleDialog(props){
    const {t} = useTranslation();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [current_event, setCurrentEvent] = useState({start: "", end: ""});
    const [userLoading, setUserLoading] = useState(false);
    const [checkedTechnicians, setCheckedTechnicians] = useState([]);
    const [checkedTechniciansObject, setCheckedTechniciansObject] = useState([]);
    const [checkedOthersTechnicians, setCheckedOthersTechnicians] = useState([]);
    const [checkedOthersTechniciansObject, setCheckedOthersTechniciansObject] = useState([]);
    const [technician_calendar_events, setTechnician_calendar_events] = useState([]);
    const [eventObject, setEventObject] = useState("");
    const [loading, setLoading] = useState(false);
    const [firstLoad, setfirstLoad] = useState(false);
    
    const calendarRef = React.createRef("")
    

    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    useEffect(() => {
        if(firstLoad){
            fetch_technician_events(props.technicians_ids, firstLoad)
            setfirstLoad(false)
        }
        if(props.event){
            if(calendarRef.current != null){
                let last_event = calendarRef.current.getApi().getEventById("service_schedule")
                if(last_event == null){
                    calendarRef.current.getApi().addEvent({
                        id: "service_schedule",
                        title: `${props.service_type}`,
                        description: `Producto/s: ${getProductsInfo(props.selectedProductRows)} - Técnico/s: ${getTechiniansInfo(checkedTechniciansObject)}`,
                        start: props.event.start,
                        end: props.event.end,
                        allDay: false,
                        color: getRandomColor()
                    });
                }
            }
        }
        if(props.current_event){
            if(props.current_event.start != ""){
                if(calendarRef.current != null){
                    let last_event = calendarRef.current.getApi().getEventById("visit_schedule")
                    let last_service_event = calendarRef.current.getApi().getEventById("service_schedule")
                    if(last_service_event){
                        last_service_event.remove()
                    }
                    if(last_event == null){
                        calendarRef.current.getApi().addEvent({
                            id: "visit_schedule",
                            title: `${props.service_type}`,
                            description: `Producto/s: ${getProductsInfo(props.selectedProductRows)} - Técnico/s: ${getTechiniansInfo(checkedTechniciansObject)}`,
                            start: props.current_event.start,
                            end: props.current_event.end,
                            allDay: false,
                            color: getRandomColor()
                        });
                    }
                    
                }
            }
        }
    }, [calendarRef]);

    useEffect(() => {

        fetch_technician_events(props.technicians_ids)
    }, [props.technicians_ids]);
    
    useEffect(() => {
        if(calendarRef.current){
            fetch_technician_events(props.technicians_ids)
        }
    }, []);
    useEffect(() => {
        if(open){
            
            setfirstLoad(true)
            //props.technicians_ids.split(",").map((technician_id) => (
                //document.getElementsByClassName("technician-check-"+technician_id)[0].click()
            //))
        }
    }, [open]);

    useEffect(() => {
        if(props.current_event){
            if(props.current_event.start != ""){
                if(calendarRef.current != null){
                    let last_event = calendarRef.current.getApi().getEventById("visit_schedule")
                    if(last_event == null){
                        calendarRef.current.getApi().addEvent({
                            id: "visit_schedule",
                            title: `${props.service_type}`,
                            description: `Producto/s: ${getProductsInfo(props.selectedProductRows)} - Técnico/s: ${getTechiniansInfo(checkedTechniciansObject)}`,
                            start: props.current_event.start,
                            end: props.current_event.end,
                            allDay: false,
                            color: getRandomColor()
                        });
                    }
                }
            }
        }
    }, [props.current_event]);

    function fetch_technician_events(technicians_ids_params, firstLoad_t = false){
        if(calendarRef.current != null && technicians_ids_params != ""){
            setLoading(true)
            let current_ref = (calendarRef.current);
            const new_technician_calendar_events = [...technician_calendar_events]

            new_technician_calendar_events.forEach(event_id => {
                let last_event = current_ref.getApi().getEventById(event_id)
                if(last_event){
                    last_event.remove()
                }
            });

            fetch(`/api/v1/technician_calendar_events?technician_id=${technicians_ids_params}`)
                .then(response => response.json())
                .then(json => {
                    json.data.forEach(event => {
                        event.color = getRandomColor()
                        event.display = "background"
                        event.overlap = true
                        event.id = "technician_events" + new_technician_calendar_events.length
                        event.groupID = "technician_events"
                        current_ref.getApi().addEvent(event);
                        new_technician_calendar_events.push("technician_events" + new_technician_calendar_events.length)
                    });
                    setTechnician_calendar_events(new_technician_calendar_events)
                    if(!firstLoad_t){
                        setCurrentEvent({
                            start: "",
                            end: "",
                        })
                        let last_event = current_ref.getApi().getEventById("service_schedule")
                        if(last_event){
                            last_event.remove()
                        }
                        let last_visit_event = current_ref.getApi().getEventById("visit_schedule")
                        if(last_visit_event){
                            last_visit_event.remove()
                        }
                    }
                    setLoading(false)
                })
                .catch(error => setLoading(false));
        }
    }


	function handleClickOpen(e){

        e.preventDefault();
        if(props.selectedProductRows.length < 1 && props.service_type != 'Póliza de Mantenimiento'){
            flash_alert("Atención", "Debe seleccionar al menos 1 producto" , "warning")
        }else if(props.service_type == ""){
            flash_alert("Atención", "Debe seleccionar el tipo de servicio a solicitar" , "warning")    
        }else{
            var taxons_names = []
            props.selectedProductRows.forEach(customer_product => {
                if(customer_product.product != undefined){
                    if(customer_product.product.taxons.length > 0){
                        customer_product.product.taxons.forEach(taxon => {
                            taxons_names.push(taxon.name)
                        });
                    }
                }
            });
            let zone = ""
            if(props.country == "MX"){
                zone = props.zipcode
            }else{
                zone = props.administrative_demarcation.admin_name_3
            }
            props.getTechnicians(props.country, taxons_names.join(','), props.service_type, zone);
            props.getCalendarEvents(props.country);
            setOpen(true);
        }
	}

	function handleClose(e){
		e.preventDefault();
        setOpen(false);
        //props.setVisit()
        if(props.scheduleCallBack){
            props.scheduleCallBack();
        }
	}


    const handleDateClick = (arg) => { // bind with an arrow function
    }
    
    
        
    const handleDateSelect = (arg) => { // bind with an arrow function
        let calendarApi = arg.view.calendar
        if(props.current_event){
            
            let last_event = calendarApi.getEventById("visit_schedule")
            if(last_event){
                last_event.remove()
            }

            calendarApi.addEvent({
                id: "visit_schedule",
                title: `${props.service_type}`,
                description: `Producto/s: ${getProductsInfo(props.selectedProductRows)} - Técnico/s: ${getTechiniansInfo(checkedTechniciansObject)}`,
                start: arg.startStr,
                end: arg.endStr,
                allDay: arg.allDay,
                color: getRandomColor()
            });
        }else{
            
            let last_event = calendarApi.getEventById("service_schedule")
            if(last_event){
                last_event.remove()
            }

            calendarApi.addEvent({
                id: "service_schedule",
                title: `${props.service_type}`,
                description: `Producto/s: ${getProductsInfo(props.selectedProductRows)} - Técnico/s: ${getTechiniansInfo(checkedTechniciansObject)}`,
                start: arg.startStr,
                end: arg.endStr,
                allDay: arg.allDay,
                color: getRandomColor()
            });
        }

        if(arg.allDay){
            setCurrentEvent({
                start: (arg.startStr + "T08:00:00"),
                end: (arg.startStr + "T20:00:00"),
            })
        }else{
            setCurrentEvent({
                start: arg.startStr,
                end: arg.endStr,
            })

        }
        calendarApi.updateSize();
    }

    const handleDateUnselect = (arg) => { // bind with an arrow function
        console.log(arg);
    }
    

    const handleEventClick = (clickInfo) => {
        if(clickInfo.event.title && clickInfo.event.display != "background"){
            if (confirm(`¿Esta seguro que quiere eliminar el evento '${clickInfo.event.title}'?`)) {
              clickInfo.event.remove()
              setCurrentEvent({
                start: "",
                end: "",
                })
            }
        }
    }
	async function handleSchedule(e){
        e.preventDefault();
        if(((checkedTechnicians.length + checkedOthersTechnicians.length) < 1) || (checkedTechnicians.length + checkedOthersTechnicians.length) == 0){
            flash_alert("Atención", `Debe seleccionar al menos ${1} técnico(s)` , "warning")
        }else{
            props.setEvent(current_event)
            setOpen(false);
            let save_function_param = (props.schedule_type == "visit" ? props.current_visit : false);
            if(props.schedule_type == "visit"){
                props.saveService(save_function_param, current_event)
                console.log("Agendar visita");
            }else{
                props.saveService(save_function_param, "schedule_visit")
            }
        }
    }

    const handleTechToggle = (value) => () => {
        const currentIndex = checkedTechnicians.indexOf(value);
        const newChecked = [...checkedTechnicians];
        const newCheckedObjects = [...checkedTechniciansObject];
        
        const current_techinician = props.technicians.find(function (technician) {
            return technician.id  == value;
          }
        );
        
        if (currentIndex === -1) {
            newChecked.push(value);
            newCheckedObjects.push(current_techinician)
        } else {
            newChecked.splice(currentIndex, 1);
            newCheckedObjects.splice(currentIndex, 1);
        }
        props.setTechniciansIds(newChecked.concat(checkedOthersTechnicians).toString());
        setCheckedTechnicians(newChecked);
        setCheckedTechniciansObject(newCheckedObjects);
        props.setTechnicians(newCheckedObjects.concat(checkedOthersTechniciansObject))
    };

    const handleOtherTechToggle = (value) => () => {
        const currentIndex = checkedOthersTechnicians.indexOf(value);
        const newChecked = [...checkedOthersTechnicians];
        const newCheckedObjects = [...checkedOthersTechniciansObject];
        
        const current_techinician = props.others_technicians.find(function (technician) {
            return technician.id  == value;
          }
        );
        
        
        if (currentIndex === -1) {
            newChecked.push(value);
            newCheckedObjects.push(current_techinician)
        } else {
            newChecked.splice(currentIndex, 1);
            newCheckedObjects.splice(currentIndex, 1);
        }
        props.setTechniciansIds(newChecked.concat(checkedTechnicians).toString());
        
        setCheckedOthersTechnicians(newChecked);
        setCheckedOthersTechniciansObject(newCheckedObjects);
        props.setTechnicians(newCheckedObjects.concat(checkedTechniciansObject))
    };

    function renderInnerContent( innerProps ) {
        return (
            <span className="fc-daygrid-dot-event">
                <div className="fc-daygrid-event-dot" style={{ "borderColor": innerProps.backgroundColor }}></div>
                <div className="fc-event-time">{ innerProps.timeText }</div>
                <div className="fc-event-title">{ innerProps.event.title || "" }</div>
            </span>
        );
    }
    const { loading_var } = userLoading;
    return (
        <React.Fragment>
            {props.schedule_type == "visit" &&
                <Button className={props.btn_classname + "customers-scheddule-visit-link"} color="primary"  onClick={handleClickOpen}>
                    <Tooltip title={
                            <React.Fragment>
                                <div className="service-tooltip" dangerouslySetInnerHTML={{__html: (props.btn_text|| "")}} /> 
                            </React.Fragment>} arrow>
                        { <i className="material-icons">sync</i> }
                    </Tooltip>
                </Button>
            }
            {props.schedule_type == "service" &&
                <Button variant="outlined" className={props.btn_classname} color="primary"  onClick={handleClickOpen}>
                    <i className="material-icons">book_online</i>&nbsp;&nbsp;{props.btn_text}
                </Button>
            }
            <Dialog
                TransitionComponent={Transition}
                fullScreen
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <AppBar className={classes.appBar} color={"secondary"}>
                    <Toolbar className={classes.appBar}>
                        <IconButton className="schedule-back-button" color="inherit" onClick={handleClose} aria-label="close">
                            <i className="material-icons">chevron_left</i>
                            <Typography variant="h6" className={classes.title}>
                                {t('calendarTechnical.scheduleBackButton')}
                            </Typography>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                           
                        </Typography>
                        <Button autoFocus className="schedule-save-buttom" color="primary" onClick={handleSchedule}>
                            {t('calendarTechnical.scheduleSaveButton')}
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h3" className="schedule-service-title">
                                {t('calendarTechnical.scheduleVisit')}
                            </Typography>        
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography variant="h6" className={"schedule-service-techinicias-available"}>
                                {t('calendarTechnical.techniciansAvailable')}
                            </Typography>
                            <p className={"schedule-service-techinicias-available-p mdl-navigation__link"}>
                                <i className="material-icons schedule-material-icon">info_outline</i> <span>{t('calendarTechnical.techniciansText#1')} <strong>{props.techinicianNumber} {t('calendarTechnical.techniciansText#2')} </strong></span> {props.totalhours && <span>y <strong>{props.totalhours} hora(s)</strong></span>}
                            </p>

                            {
                                !props.technicians && !props.others_technicians &&
                                    <CircularProgress size={24} className={classes.buttonProgressRelative} />
                            }
                            <List>
                                {props.technicians && props.technicians.map((technician) => (
                                     <ListItem className="schedule-list-technician" key={technician.id} role={undefined} dense button onClick={handleTechToggle(technician.id)}>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checkedTechnicians.indexOf(technician.id) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            color="primary"
                                            inputProps={{ 'aria-labelledby':  `checkbox-list-label-${technician.id}` }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={ `checkbox-list-label-${technician.id}`} primary={(technician.enterprise != "" && technician.enterprise != null ) ?  technician.user.fullname + " (" + technician.enterprise  + ")" : technician.user.fullname }  />
                                        <ListItemSecondaryAction>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                                {props.technicians && (props.technicians.length > 0 ? "" : <Chip icon={<FaceIcon />} label={t('calendarTechnical.noTechniciansAvailable')} color="primary" variant="outlined" /> )}
                            </List>
                            

                            <Accordion className="others-tech-accordeon" expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                                >
                                <Typography variant="h6" className={"schedule-service-techinicias-available"}>{t('calendarTechnical.otherTechnicians')}</Typography>
                                <Typography className={classes.secondaryHeading}></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <List>
                                            {props.others_technicians && props.others_technicians.map((technician) => (
                                                <ListItem className="schedule-list-technician" key={technician.id} role={undefined} dense button onClick={handleOtherTechToggle(technician.id)}>
                                                    <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        className={"technician-check-"+ technician.id}
                                                        checked={checkedOthersTechnicians.indexOf(technician.id) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        color="primary"
                                                        inputProps={{ 'aria-labelledby':  `checkbox-list-label-${technician.id}` }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText id={ `checkbox-list-label-${technician.id}`} primary={(technician.enterprise != "" && technician.enterprise != null ) ?  technician.user.fullname + " (" + technician.enterprise  + ")" : technician.user.fullname } />
                                                    <ListItemSecondaryAction>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                    
                            
                        </Grid>
                        <Grid item xs={12} sm={9} className="technicians-calendar">
                            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            <FullCalendar
                            timeZone= {'local'}
                            plugins={[ dayGridPlugin, interactionPlugin,timegridPlugin, daygridPlugin ]}
                            initialView="timeGridWeek"
                            selectable={true}
                            ref={calendarRef}
                            //weekends={false}
                            selectAllow={ function(info) {
                                if (info.start < (new Date()))
                                    return false;
                                return true;          
                            }}
                            events={
                                props.calendar_events
                            }
                            id={"initial_events"}
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
                                                minute: '2-digit', meridiem: 'short', hour12: true }}
                            slotLabelContent={ ( arg ) => {
                                let label_text = arg.text; 
                                if(arg.text == "0:00 p. m."){
                                    label_text = "12:00 p. m."
                                }
                                return (
                                    <>
                                        {label_text}
                                    </>
                                );
                            }}
                            locale={esLocale}
                            slotDuration={"01:00:00"}
                            slotMinTime={"07:00"}
                            slotMaxTime={"21:00"}
                            dateClick={handleDateClick}
                            select={handleDateSelect}
                            unselect={handleDateUnselect}
                            eventClick={handleEventClick}
                            eventContent={ ( arg ) => {
                                if( (arg.event.id == "service_schedule" || arg.event.id == "visit_schedule")){
                                    return (
                                        <>
                                            { renderInnerContent( arg ) }
                                        </>
                                    );


                                }else{
                                    return (
                                        <Tooltip title={<React.Fragment>
                                            <div className="service-tooltip" dangerouslySetInnerHTML={{__html: (arg.event.extendedProps.description || "")}} /> 
                                         </React.Fragment>
                                         
                                         } arrow>
                                            { renderInnerContent( arg ) }
                                        </Tooltip>
                                    );

                                }
                            }}
                            businessHours= {{
                                daysOfWeek: [0, 1, 2, 3, 4, 5, 6 ],
                                startTime: '07:00',
                                endTime: '21:00',
                            }}
                            />
                        </Grid>
                    </Grid>


                </DialogContent>
                {
                    /* 
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            No
                        </Button>
                        <Button onClick={handleSchedule} color="primary" autoFocus>
                            Si
                        </Button>
                    </DialogActions>
                    */
                }
		  </Dialog>
      </React.Fragment>
  );

}
const structuredSelector = createStructuredSelector({
    technicians: state => state.technicians,
    calendar_events: state => state.calendar_events,
    others_technicians: state => state.others_technicians,
});
const mapDispatchToProps = {getTechnicians,getCalendarEvents};
export default connect(structuredSelector, mapDispatchToProps)(NewScheduleDialog)
