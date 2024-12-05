import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Autosuggest from 'react-autosuggest';
import Grid from '@material-ui/core/Grid';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';


const GET_CUSTOMERS_REQUEST = "GET_CUSTOMERS_REQUEST";
const GET_CUSTOMERS_SUCCESS = "GET_CUSTOMERS_SUCCESS";

  
function getSuggestionValue(suggestion) {
    return suggestion.email;
}

function renderSuggestion(suggestion) {
    return (
        <span>{`${suggestion.names} ${suggestion.lastname} ${suggestion.surname} (${suggestion.email})`}</span>
    );
}

function getCustomers(page = 1, per_page = 10, filterText = "", setter) {
    return dispatch => {
      dispatch({type: GET_CUSTOMERS_REQUEST});
      return fetch(`/api/v1/customers?page=${page}&per_page=${per_page}&keywords=${filterText}`)
        .then(response => response.json())
        .then(json => dispatch(getCustomersSuccess(json, setter)))
        .catch(error => console.log(error));
    };
  };
  

  export function getCustomersSuccess(json, setter) {
    setter(json.data)
    return {
      type: GET_CUSTOMERS_SUCCESS,
      json
    };
  };

function Searcher(props){
    const {t} = useTranslation();
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [status,setStatus] = useState(t('searcher.loading'))

    let lastRequestId = null;
    
    function escapeRegexCharacters(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function getMatchingCustomers(value) {
        const escapedValue = escapeRegexCharacters(value.trim());
        
        if (escapedValue === '') {
            return [];
        }
        
        const regex = new RegExp('^' + escapedValue, 'i');
        
        
        props.getCustomers("1", "10", value, setSuggestions);
        setIsLoading(false);
        props.setLoading(false);
    }

    function loadCustomers(value) {
        console.log(props.customers)
        // Cancel the previous request
        if (lastRequestId !== null) {
          clearTimeout(lastRequestId);
        }
        setIsLoading(true);
        props.setLoading(true);
        // Fake request

        lastRequestId = setTimeout(() => {
        setIsLoading(true);
        props.setLoading(true);
            getMatchingCustomers(value);
        }, 1000);
    }
        
    function onChange(event, { newValue }){
        setValue(newValue);
    };
        
    function handleKeyDown(event){
      if (event.key === 'Enter') {
        document.getElementById('global-search-button').click();
      }
    };

    function onSuggestionsFetchRequested({ value }){
        if( value.length >= 3){
            loadCustomers(value);
        }
    };
    
    function onSuggestionsClearRequested(){
        let search_param = (new URLSearchParams(props.history.location.search)).get('search');
        if( search_param == null || search_param == ""){
          props.getCustomers("1", "10", "", setSuggestions);
        }
    };

    function renderSuggestionsContainer({ containerProps, children, query }) {
      return (
        <div {...containerProps}>
          {children}
          <div className="press-enter">
            {t('searcher.searchEnter')}{'\u00A0'}<strong>{query}</strong>
          </div>
        </div>
      );
    }

    useEffect(() => {
      if(!isLoading){
        setStatus(t('searcher.searcherText'))
      }
    }, []);

    let no_results_found_check = []
		if (suggestions.length < 1 && value.length >= 3 && !isLoading){
			no_results_found_check.push(
				<div key="no_results_found" role="combobox" aria-haspopup="listbox" aria-owns="react-autowhatever-1" aria-expanded="false" className="react-autosuggest__container">
          <div id="react-autowhatever-1" role="listbox" className="react-autosuggest__suggestions-container react-autosuggest__suggestions-container--open react-autosuggest__suggestions-container-no-results">
            <div className="not-found-restults">
              <div className="flex-center">
                {t('searcher.noresults')}{'\u00A0'}<strong>{value}</strong>
              </div>
              <br/>
              <div className="flex-center">
                <Link className="mdl-navigation__link" to="/customers/new">
                  <Button variant="outlined" color="primary">
                    <i className="material-icons">person_add</i>&nbsp;&nbsp;{t('customer.createClientButton')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
			);
		}

    const inputProps = {
      placeholder: status,
      value,
      onChange: onChange,
      onKeyDown: handleKeyDown
    };
    const customers_url = "/customers?search="+value;
  	return (
        <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} md={3}></Grid>
            <Grid item xs={12} md={6} className="search-grid-container">
                <Autosuggest 
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    renderSuggestionsContainer={renderSuggestionsContainer}
                    inputProps={inputProps} />
                  <Link className="mdl-navigation__link" id="global-search-button" to={customers_url}>
                    <Button
                      className="search-btn-full-height"
                      startIcon={<SearchIcon />}
                    ></Button>
                  </Link>  
                {no_results_found_check}             
            </Grid>
            <Grid item xs={12} md={3}></Grid>
            
        </Grid>
	)
}

Searcher.propTypes = {
  customers: PropTypes.array,
  page: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number
};

const structuredSelector = createStructuredSelector({
  customers: state => state.customers,
  page: state => state.page,
  perPage: state => state.perPage,
  total: state => state.total,
  curent_user: state => state.curent_user
});
const mapDispatchToProps = {getCustomers};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Searcher));

