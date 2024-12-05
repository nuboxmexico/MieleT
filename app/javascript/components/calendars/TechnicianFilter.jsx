import React, {useState, useEffect} from "react"
import axios from 'axios'

import {FormControl, InputLabel, Select, MenuItem, ListItemText, OutlinedInput, Checkbox} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function TechnicianFilter({setTecnicos, country, getCalendarEvents, calendar_start_date, calendar_finish_date, loading, setLoading}) {
  const {t} = useTranslation();
  const MenuProps = {
    PaperProps: {
      style: {
        width: 300,
      },
    },
  };

  const [technicians, setTechnicians] = useState([])
  const [technicianIds, setTechnicianIds] = useState([])
  const [load, setLoad] = useState(false)
  function handleTechnicianChange(event) {
    const {target: {value}} = event;
    if (value[value.length - 1] === "all") {
      setTechnicianIds(technicianIds.length === technicians.length ? [] : technicians.map(technician => technician.id));
      return;
    }
    setTechnicianIds(value)
  }

  function handleOnClose(_event) {
    getCalendarEvents(country, technicianIds.join(','), calendar_start_date, calendar_finish_date, setLoading)
  }
  
  useEffect(() => {
    if (load){
      handleOnClose()
    }
  }, [calendar_start_date, calendar_finish_date])

  async function getTechniciansByCountry(country) {
    try {
      const {data} = await axios.get(`api/v1/all_technicians?country=${country}`)
      setTechnicians(data)
      setTecnicos(data)
      setTechnicianIds(data.map(technician => technician.id))
      
    } catch (error) {
      console.log(error);
    }
  }

  
  useEffect(() => {
    if (technicianIds.length != 0) {
      setLoad(true)
    }

  }, [technicianIds])

  useEffect(() => {
    if(country != ""){
      setLoad(false)
      setTechnicians([])
      getTechniciansByCountry(country)
    }
  }, [country])

  useEffect(() => {
    if (load) {
      handleOnClose()
    }

  }, [load])

  return (
    <FormControl variant="outlined" size="small">
      <InputLabel className="white-bg padding-sides-5">{t('technicians.selectTechnician')}</InputLabel>
      <Select
        multiple
        value={technicianIds}
        onClose={handleOnClose}
        onChange={handleTechnicianChange}
        MenuProps={MenuProps}
        disabled={loading}
        renderValue={(selected) => {
          if (technicianIds.length !== technicians.length) {
            return selected.map(selected => {
              return technicians.find(tecnico => selected == tecnico.id)?.user?.fullname
            }).join(', ')
          }
          return 'Todos'
        }}
        input={<OutlinedInput style={{height: '41px', width: '300px'}} label={t('technicians.techniciansTech')} />}
      >
        <MenuItem value="all" >
          <Checkbox color="primary" checked={technicianIds.length === technicians.length} />
          <ListItemText primary="Todos" />
        </MenuItem>

        {technicians.map((tecnico) => (
          <MenuItem key={tecnico.id} value={tecnico.id} >
            <Checkbox color="primary" checked={technicianIds.indexOf(tecnico.id) > -1} />
            <ListItemText primary={tecnico.user.fullname} />
          </MenuItem>
        ))
        }
      </Select>
    </FormControl>
  )
}
