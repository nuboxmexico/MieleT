import React from "react"
import ReactDOM from 'react-dom'

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import NewUser from "components/users/NewUser";
import Button from '@material-ui/core/Button';
import i18next from 'i18next';
class UsersLinks extends React.Component {

  render() {
  	return (
  		<React.Fragment>
		  	<Link className="mdl-navigation__link action-plus-btn" id="users-new" to="/users/new">
		  	<Button variant="outlined" color="primary">
			  <i className="material-icons">person_add</i>&nbsp;&nbsp;{i18next.t('users.userCreateButton')}
			</Button>
		  	</Link>
		</React.Fragment>
	);
  }
}

export default UsersLinks
