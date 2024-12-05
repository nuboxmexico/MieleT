import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { canManage } from 'redux-cancan';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import Badge from '@material-ui/core/Badge';
import { withRouter } from 'react-router-dom';
import LanguageSwitcher from 'components/LanguageSwitcher'


function NavLinks(props){
	
	const [notificationsNumber, setNotificationsNumber] = useState("");
	
	useEffect(() => {
		if(props.unread_notifications){
			setNotificationsNumber(props.unread_notifications.length)
		}
	}, [props.unread_notifications]);
	
	  

	return ReactDOM.createPortal(
		<React.Fragment>
      <LanguageSwitcher />
			<Link key="notifications" to="/notifications">
				{notificationsNumber &&
				<Badge badgeContent={notificationsNumber} color="primary">
					<NotificationsNoneIcon className="mdl-navigation__link_tertiary"  fontSize="large" />
				</Badge>
				||
				<NotificationsNoneIcon className="mdl-navigation__link_tertiary"  fontSize="large" />
				}
			</Link>
		</React.Fragment>
	,document.getElementById('nav-links')
	)
}
  const structuredSelector = createStructuredSelector({});
  const mapDispatchToProps = {};
  export default withRouter(connect(structuredSelector, mapDispatchToProps)(NavLinks));
  
