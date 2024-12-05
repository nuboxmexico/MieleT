import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function MenuServices(props){


    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    
	return (
		<React.Fragment>
            <Button className={props.btn_classname + " customers-scheddule-visit-link"} onClick={(e) => handleClick(e) }>
            <InputLabel id="pdf_version-simple-select-outlined-label" className="services-button"><i className="material-icons">build</i> Servicios Asociados</InputLabel>
            </Button>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                    {props.quotationServices[props.index].map((service,i) => (
                              <MenuItem key={service.id+ "-"+i}>
                              <Link to={`/customers/${props.customer_id}/services/${service.id}/edit_service`}>
                                {service.service_type} {service.number} - Visita N°{service.last_visit.number} - {service.created_at}
                              </Link>
                              </MenuItem>
                          ))}
            </Menu>
		   
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(MenuServices)

