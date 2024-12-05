import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';


import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


function SurveyQuestionValue(props){
    
    const [value, setValue] = useState("");


    useEffect(() => {
        props.handleQuestionAnswer(props.survey_question.id, value)
    }, [value]);
    
    useEffect(() => {
        if(props.survey && props.survey.survey_answers && props.survey.survey_answers.length > 0){
            let answered = props.survey.survey_answers.find(answer => answer.survey_question_id == props.survey_question.id)
            if(answered){
                setValue(answered.answer)
            }
        }
    }, [props.survey]);
    
    
	return (
		<React.Fragment>
           <FormControl variant="outlined" className="MuiFormControl-fullWidth">
                <InputLabel id="survey_status-simple-select-outlined-label">-</InputLabel>
                <Select
                    labelId="survey_status-simple-select-outlined-label"
                    id="survey_status-simple-select-outlined"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    label="-"
                    name="survey_status"
                >
                { [...Array(props.survey_question.scale_max).keys()].map((value) => (
                    <MenuItem key={props.survey_question.id+"-survey_status-"+value+1} value={value+1}>{value+1}</MenuItem>
                ))}
            </Select>
        </FormControl>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(SurveyQuestionValue)

