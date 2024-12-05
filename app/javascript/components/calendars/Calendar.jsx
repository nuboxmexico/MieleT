import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {connect} from "react-redux"
import {createStructuredSelector} from "reselect"
import EventColors from './EventColors';
import Paper from '@material-ui/core/Paper';
import FullCalendar from '@fullcalendar/react'
import EventTooltip from './EventTooltip';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/timegrid";
import {headers} from "constants/csrf"
import esLocale from "@fullcalendar/core/locales/es";
import ptLocale from "@fullcalendar/core/locales/pt";
import Grid from '@material-ui/core/Grid';
import ReactCountryFlag from "react-country-flag";
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import {Box} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import TechnicianFilter from './TechnicianFilter';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import useCountries from 'hooks/useCountries';
const GET_CALENDAR_EVENTS_REQUEST = "GET_CALENDAR_EVENTS_REQUEST";
const GET_CALENDAR_EVENTS_SUCCESS = "GET_CALENDAR_EVENTS_SUCCESS";
const countries = [
  "MX",
  "CL"
];

const useStyles = makeStyles((theme) => ({

  buttonProgressAbsolute: {
      position: 'absolute',
      left: '50%',
      top: '40%',
  },
  pRelative:{
    position: 'relative',
      
  }
}));

/*
 npm install --save @fullcalendar/react @fullcalendar/daygrid
 npm install --save @fullcalendar/interaction
 npm install --save @fullcalendar/core
 npm install --save @fullcalendar/timegrid
 npm install --save @fullcalendar/daygrid
 yarn install --check-files
*/
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function getCalendarEvents(country_iso, technician_ids = null, calendar_start_date= null, calendar_finish_date = null, setLoading = null) {
  // const url = technician_ids === null ? `api/v1/calendar_events?country=${country_iso}&all=1` : `api/v1/technician_calendar_events?technician_id=${technician_ids}`
  setLoading && setLoading(true);
  const url = `api/v1/technician_calendar_events?technician_id=${technician_ids}&calendar_start_date=${calendar_start_date}&calendar_finish_date=${calendar_finish_date}`
  if (technician_ids === null) {
    return dispatch => {
      dispatch(getCalendarEventsSuccess([]))
    }
  } else {
    return dispatch => {
      dispatch({type: GET_CALENDAR_EVENTS_REQUEST});
      return fetch(url)
        .then(response => response.json())
        .then(json => dispatch(getCalendarEventsSuccess(json)) && setLoading && setLoading(false))
        .catch(error => console.log(error));
    };
  }
};

export function getCalendarEventsSuccess(json) {
  console.log(json)
  return {
    type: GET_CALENDAR_EVENTS_SUCCESS,
    json
  };
};



function Calendar(props) {
  const {i18n,t} = useTranslation();
  const {isos: countryCodes, data: countries, loading: loadingCountries} = useCountries();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tecnicos, setTecnicos] = useState([])
  const [start_date, setStartDate] = useState(new Date);
  const [finish_date, setFinishDate] = useState(new Date);
  const [calendar_start_date, setCalendarStartDate] = useState();
  const [calendar_finish_date, setCalendarFinishDate] = useState();
  
  const [allDay, setAllDay] = useState(false);
  const [country, setCountry] = useState("");
  const [eventColors, setEventColors] = useState({})
  const [load, setLoad] = useState(false)
  const calendarRef = React.createRef("")

  async function getEventColors() {
    const {data} = await axios.get('api/v1/calendar_events/colors', {headers: headers})
    setEventColors(data)

  }

  async function getAllTechnicians() {
    const {data} = await axios.get('api/v1/all_technicians', {headers: headers})
    setTecnicos(data)
  }

  useEffect(() => {
    let user_country = country
    if (props.current_user) {
      if (props.current_user.country != "" && props.current_user.country != null) {
        user_country = props.current_user.country
        setCountry(user_country)
      }
    }

  }, []);

  useEffect(() => {
    let user_country = country
    if (user_country != null && user_country != "") {
      async function fetchData(country) {
        //await getAllTechnicians();
        // props.getCalendarEvents(country);
      }
  
      //fetchData(user_country);
    }

  }, [country]);

  const handleDateClick = (arg) => { // bind with an arrow function
    console.log(arg);
    //alert(arg.dateStr)
  }

  const handleDateSelect = (arg) => { // bind with an arrow function
    console.log(arg);
    setStartDate(arg.start);
    setFinishDate(arg.end);
    setAllDay(arg.allDay)
  }

  const handleDateUnselect = (arg) => { // bind with an arrow function
    console.log(arg);
  }

  const handleCountryChange = (event) => {
    setCountry(event.target.value)
    // props.getCalendarEvents(event.target.value);
  };

  return (
    <React.Fragment>
      <Paper className="custom-paper">

        <Grid container spacing={3}>

          <Grid item xs={12}>
            <h1>{t('calendar.title')}</h1>
            <Box display="flex" justifyContent="flex-start" >
              <div style={{marginRight: '14px'}} className='country-container'>
                <FormControl sx={{m: 1, width: 300}} variant="outlined" size="small">
                  <InputLabel className="white-bg padding-sides-5" htmlFor="select-multiple-chip-country" id="country-chip-multiple-label"></InputLabel>
                  {
                    !loadingCountries && 
                    <Select
                    id="country-chip"
                    value={country}
                    onChange={handleCountryChange}
                    input={<OutlinedInput style={{width: '300px'}} />}
                    disabled={loading}
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
                          <ListItemText primary={countries.find(object => object["iso"] === selected).name} />
                        </MenuItem>
                      </div>
                    )}
                  >
                    {countryCodes.map((name) => {
                      return props.current_user.countries.find(object => object.iso === name) &&

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
                          <ListItemText primary={countries.find(object => object["iso"] === name).name} />
                        </MenuItem>
                    }
                    )}
                  </Select>

                  }
                </FormControl>
              </div>

              <div className="technician-container">
                <TechnicianFilter setTecnicos={setTecnicos} getCalendarEvents={props.getCalendarEvents} loading={loading} setLoading={setLoading} country={country} calendar_start_date={calendar_start_date} calendar_finish_date={calendar_finish_date} />
              </div>
            </Box>



            <Box mt={2} >
              <EventColors />
            </Box>
          </Grid>

          <Grid item xs={12} className={classes.pRelative} >
            {loading && <CircularProgress size={24} className={classes.buttonProgressAbsolute} />}
            <FullCalendar
              timeZone={'local'}
              plugins={[dayGridPlugin, interactionPlugin, timegridPlugin]}
              initialView="timeGridWeek"
              selectable={true}
              ref={calendarRef}
              events={
                props.calendar_events
              }
              headerToolbar={{
                start: 'today',
                center: 'prevYear,prev,title,next,nextYear',
                end: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              slotLabelFormat={{month: 'long', year: 'numeric'},
              {
                hour: 'numeric',
                minute: '2-digit', meridiem: 'short', hour12: true
              }}
              datesSet={(dateInfo) => {
                setCalendarStartDate(dateInfo.start)
                setCalendarFinishDate(dateInfo.end)
              }}
              slotLabelContent={(arg) => {
                let label_text = arg.text;
                if (arg.text == "0:00 p. m.") {
                  label_text = "12:00 p. m."
                }
                return (
                  <>
                    {label_text}
                  </>
                );
              }}
              slotDuration={"01:00:00"}
              slotMinTime={"07:00"}
              slotMaxTime={"21:00"}
              locale={i18n.language === 'pt' ?  ptLocale : esLocale}
              dateClick={handleDateClick}
              select={handleDateSelect}
              unselect={handleDateUnselect}
              businessHours={{
                daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                startTime: '07:00',
                endTime: '21:00',
              }}
              eventContent={(arg) => {
                return (
                  <EventTooltip arg={arg} tecnicos={tecnicos} />
                )
              }}
            />
          </Grid>
        </Grid>

      </Paper>
    </React.Fragment >
  );

}

const structuredSelector = createStructuredSelector({
  calendar_events: state => state.calendar_events,
  curent_user: state => state.curent_user
});
const mapDispatchToProps = {getCalendarEvents};

export default connect(structuredSelector, mapDispatchToProps)(Calendar)
