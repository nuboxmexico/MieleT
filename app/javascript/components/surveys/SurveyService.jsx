import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Grid from '@material-ui/core/Grid';
import { flash_alert } from 'components/App';
import {csrf, headers, money_format, date_format,date_event_format, date_difference_in_hours, headers_www_form} from "constants/csrf"
import pluralize from 'pluralize';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

import TextField from '@material-ui/core/TextField';

import SurveyQuestionValue from "components/surveys/SurveyQuestionValue";

const GET_SURVEY_QUESTIONS_REQUEST = "GET_SURVEY_QUESTIONS_REQUEST";
const GET_SURVEY_QUESTIONS_SUCCESS = "GET_SURVEY_QUESTIONS_SUCCESS";

function getSurveysQustions(setLoading) {
    return dispatch => {
        dispatch({type: GET_SURVEY_QUESTIONS_REQUEST});
        return fetch(`/api/v1/survey_questions`)
        .then(response => response.json())
        .then(json => dispatch(getSurveysQustionsSuccess(json)) && setLoading(false))
        .catch(error => console.log(error) && setLoading(false));
    };
};
export function getSurveysQustionsSuccess(json) {
    return {
        type: GET_SURVEY_QUESTIONS_SUCCESS,
        json
    };
};

const survey_status_values = ["Realizadas", "No contactados", "Cliente NO acepto la encuesta"]

function SurveyService(props){
    const [loading, setLoading] =  useState(false);
    const [survey_status, setSurveyStatus] =  useState("");
    const [background, setBackground] =  useState("");
    const [surveyAnswers, setSurveyAnswers] =  useState([]);
    const [checkAnswers, setCheckAnswers] =  useState(false);


    async function fetchSurveys() {
        props.getSurveysQustions(setLoading);
    }

    useEffect(() => {
        fetchSurveys();   
    }, []);

    useEffect(() => {
        if(props.survey){
            setBackground(props.survey.background)
            setSurveyStatus(props.survey.status)
            
        }   
    }, [props.survey]);

    useEffect(() => {
        if(props.survey_questions){
            let answer_obect = new Array();
            Object.entries(props.survey_questions).map(([key, value]) => {
                    console.log(value)
                    answer_obect = [...answer_obect, ...value]  
            });
            let answer_obect_array = answer_obect.map(answer => ({id: answer.id, value: ""}))
            setSurveyAnswers(answer_obect_array)
            if(props.survey.survey_answers && (props.survey.survey_answers.length == props.survey_questions.length)){
                setCheckAnswers(true) 
            } 
        }

        
    }, props.survey_questions);


    function handleQuestionAnswer(question_id, new_value){
        if(surveyAnswers.length > 0){
            let answer_changed = surveyAnswers.findIndex(answer => answer.id == question_id) 
            let new_object = [... surveyAnswers];
            new_object[answer_changed].value = new_value
            setSurveyAnswers(new_object)
          
        }
    }

    function saveSurvey(){
        var body = new FormData();
        setLoading(true);
        body.set('service_id', props.serviceID);
        body.set('survey_id', props.survey.id);
        body.set('status', survey_status);
        body.set('background', background);
        
        
        surveyAnswers.forEach((surveyAnswer) => {
            body.append('answers[]', JSON.stringify(surveyAnswer));
        });

        return axios.post(`/api//v1/survey_questions/answer`, body, { headers: headers_www_form})
            .then(response => {
                flash_alert("", "Encuesta actualizada con éxito", "success");
                setLoading(false);
                 
            })
        .catch(e => {
            console.log(e);
            if(e.response.data){
                setLoading(false);
                console.log(e.response.data);
                for (var key in e.response.data) {
                    flash_alert("Error", e.response.data[key], "danger")
                }
            }
        });
    }
    

	return (
		<React.Fragment>

            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="paneladditional-header"
                >
                <h1 className="panel-custom-title">Encuesta de servicio</h1>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={1}>
                        <Grid item xs={12}> 
                            <Grid container spacing={1} justify="center" alignItems="center">
                                <Grid item xs={12}> 
                                    {loading && <CircularProgress size={24} />}  
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>

                            <FormControl variant="outlined" className="MuiFormControl-fullWidth">
                                <InputLabel id="survey_status-simple-select-outlined-label">Estatus encuesta</InputLabel>
                                    <Select
                                        labelId="survey_status-simple-select-outlined-label"
                                        id="survey_status-simple-select-outlined"
                                        value={survey_status}
                                        onChange={(e) => setSurveyStatus(e.target.value)}
                                        label="Solicitado por"
                                        name="survey_status"
                                    >
                                    {survey_status_values.map((value) => (
                                        <MenuItem key={"survey_status-"+value} value={value}>{value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}> 
                            <Grid container spacing={1}>
                           
                            {props.survey_questions != undefined && 
                                Object.entries(props.survey_questions).map(([key, value]) => {
                                   
                                    return (
                                        <>
                                            <Grid item xs={12}>
                                                <p class="service-subtitle survey-subtitle">{key}</p>
                                            </Grid>
                                            {value && value.map((survey_question, index) => {
                                                const labelId = `accordeon-survey_question-${survey_question.id}-${index}`;
                                                return (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <p key={labelId} className="visit-summary-2">{survey_question.title}</p>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <SurveyQuestionValue
                                                                survey_question={survey_question}
                                                                handleQuestionAnswer={(question_id, new_value) => handleQuestionAnswer(question_id, new_value) }
                                                                survey={props.survey}
                                                            />
                                                        </Grid>
                                                    </>
                                                    );
                                                })}
                                            <hr />
                                        </>
                                    );
                                })
                            }
                            
                            </Grid>
                        </Grid>
                        <br />
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                
                                <Grid item xs={12}>
                                    <TextField fullWidth variant="outlined" multiline rows={8} label="Añadir comentarios adicionales del cliente" name="background" value={background} onChange={(e) => setBackground(e.target.value)} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid item xs={12}>

                            <Button id="send-survey" variant="contained" color="primary" onClick={() => saveSurvey()} disabled={props.survey.is_completed}>
                                Guardar Encuesta
                            </Button>
                            
                        </Grid>

                    </Grid>
                </AccordionDetails>
            </Accordion>
                

		   
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
    survey_questions: state => state.survey_questions,
});
const mapDispatchToProps = {getSurveysQustions};

export default connect(structuredSelector, mapDispatchToProps)(SurveyService)

