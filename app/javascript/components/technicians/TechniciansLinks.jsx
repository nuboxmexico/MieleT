import React from "react"
import ReactDOM from 'react-dom'

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import NewTechnician from "components/technicians/NewTechnician";
import Button from '@material-ui/core/Button';
import i18next from 'i18next';
class TechniciansLinks extends React.Component {
  render() {
  	return (
  		<React.Fragment>
		  	<Link className="mdl-navigation__link action-plus-btn" id="technicians-new" to="/technicians/new">
		  	<Button variant="outlined" color="primary">
			  <i className="material-icons">person_add</i>&nbsp;&nbsp;{i18next.t('technicians.createTechnicians')}
			</Button>
		  	</Link>
		</React.Fragment>
	);
  }
}

export default TechniciansLinks
