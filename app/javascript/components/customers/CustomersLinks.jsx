import React from "react"
import ReactDOM from 'react-dom'

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import NewTechnician from "components/customers/NewCustomer";
import Button from '@material-ui/core/Button';
import i18next from 'i18next';


class TechniciansLinks extends React.Component {
  render() {
	
  	return (
  		<React.Fragment>
		  	<Link className="mdl-navigation__link action-plus-btn"  id="customers-new" to="/customers/new">
		  	<Button variant="outlined" color="primary">
			  <i className="material-icons">person_add</i>&nbsp;&nbsp;{i18next.t('customer.customerCreateButton')}
			</Button>
		  	</Link>
		</React.Fragment>
	);
  }
}

export default TechniciansLinks
