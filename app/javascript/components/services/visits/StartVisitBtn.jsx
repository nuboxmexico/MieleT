import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {useTranslation} from "react-i18next"

import Tooltip from '@material-ui/core/Tooltip';

function StartVisitBtn(props){
    const { t } = useTranslation('translation', { keyPrefix: 'services.visits' });


    const [start_finish_text, setStartFinishText] = useState("Iniciar visita");
    const [start_finish_icon, setStartFinishIcon] = useState("play_arrow");
    
    const [arrival_text, setArrivalText] = useState("Avisar llegada al domicilio");
    const [arrival_icon, setArrivalIcon] = useState("home_work");


    function toggleStartFinish(visit_id){
        
        if(start_finish_icon == "play_arrow"){
            setStartFinishText("Terminar Visita")
            setStartFinishIcon("stop")
            props.startVisit(visit_id)
        }else{
            setStartFinishText("Iniciar Visita")
            setStartFinishIcon("play_arrow")
            props.finishVisit(visit_id)
        }
    }

    function toggleArrival(visit_id){
        
        if(arrival_icon == "home_work"){
            setArrivalText("Reiniciar Tiempo")
            setArrivalIcon("restart_alt")
            props.arrivalVisit(visit_id)
        }else{
            setArrivalText("Avisar llegada al domicilio")
            setArrivalIcon("home_work")
            flash_alert("Reinicio", t('flashAlert.startTheCounterAgain'), "success")
        }
    }

    
    
    
	return (
		<React.Fragment>
            <Typography className={props.classes.heading}>
                <Button className={props.btn_classname + "customers-start-finish-visit-link"} color="primary" onClick={() => toggleArrival(props.visit_id) }>
                    <Tooltip title={
                        <React.Fragment>
                            <div className="service-tooltip" dangerouslySetInnerHTML={{__html: (arrival_text|| "")}} /> 
                        </React.Fragment>} arrow>
                        { <i className="material-icons">{arrival_icon}</i> }
                    </Tooltip>
                </Button>
            </Typography>
            <Typography className={props.classes.heading}>
                <Button className={props.btn_classname + "customers-start-finish-visit-link"} color="primary" onClick={() => toggleStartFinish(props.visit_id) }>
                    <Tooltip title={
                        <React.Fragment>
                            <div className="service-tooltip" dangerouslySetInnerHTML={{__html: (start_finish_text|| "")}} /> 
                        </React.Fragment>} arrow>
                        { <i className="material-icons">{start_finish_icon}</i> }
                    </Tooltip>
                </Button>
            </Typography>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(StartVisitBtn)

