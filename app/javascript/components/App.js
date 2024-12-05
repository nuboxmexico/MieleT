
import i18n from 'i18n'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Routes from "../routes/Index";
import Footer from "components/site/Footer"
import ErrorBoundary from "components/site/ErrorBoundary"

import { Provider } from "react-redux"
import configureStore from "../stores/configureStore"
//./bin/webpack-dev-server

// FRONT END
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// Notifications
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import SimpleReactLightbox from 'simple-react-lightbox'
import { I18nextProvider } from 'react-i18next';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8C0014',
    },
    secondary: {
      main: '#ececec',
    },
    tertiary:{
      main: '#1f1f1f',
    },
    tonalOffset: 0.2,
  },
});


function App(props){
  const store_r = configureStore(props.current_user);

  return (
		<Provider store={store_r}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <ReactNotification/>
          <Container> 
            <main id="main" className={"main-margin-bottom"}>
              <SimpleReactLightbox>
               <ErrorBoundary>
                <Router> 
                  <Routes current_user={props.current_user}/>
                </Router>
              </ErrorBoundary>
              </SimpleReactLightbox>
            </main>
          </Container>
        </I18nextProvider>
      </ThemeProvider>
  	</Provider>
  );
}

export default App
export const flash_alert = function(title, message, type){
  let alert_type = type
  switch (type){
    case 'alert':
      alert_type = "danger"
      break;  
    case "error":
      alert_type = "danger"
      break;
    case "danger":
        alert_type = "danger"
        break;    
    case "notice":
      alert_type = "info"
      break;
    case 'success':
      alert_type = "success"
      break;
    default: 
      alert_type = "default"
      break;
  }
	store.addNotification({
      title: title,
      message: message,
      type: alert_type,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000,
        showIcon: true,
        pauseOnHover: true
      }
    });
}
