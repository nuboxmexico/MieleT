import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link, withRouter, Redirect, useHistory} from 'react-router-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Home from "components/site/Home"
import Searcher from "components/site/Searcher"
import Users from "components/users/Users"
import NewUser from "components/users/NewUser";
import EditUser from "components/users/EditUser";
import Technicians from "components/technicians/Technicians"
import NewTechnician from "components/technicians/NewTechnician";
import EditTechnician from "components/technicians/EditTechnician";
import Customers from "components/customers/Customers"
import ProjectCustomers from "components/projectCustomers/ProjectCustomers"  //////
import ProjectDetail from "components/projectCustomers/ProjectDetail"
import Services from "components/services/Services"
import Finance from 'components/finance'
import NewCustomer from "components/customers/NewCustomer";
import EditCustomer from "components/customers/EditCustomer";
import ShowCustomer from "components/customers/ShowCustomer";
import NewAdditional from "components/customers/NewAdditional";
import EditAdditional from "components/customers/EditAdditional";
import NewAdditionalAddress from "components/customers/NewAdditionalAddress";
import EditAdditionalAddress from "components/customers/EditAdditionalAddress";
import NewService from "components/services/NewService";
import EditService from "components/services/EditService";
import NewVisit from "components/services/visits/NewVisit";
import NewPolicy from "components/policies/NewPolicy";
import EditPolicy from "components/policies/EditPolicy";
import Calendar from "components/calendars/Calendar"
import Surveys from "components/surveys/Surveys";
import Notifications from "components/notifications/Notifications";
import Downloads from "components/downloads/Downloads";
import NavLinks from "components/site/NavLinks"
import SideNavLinks from "components/site/SideNavLinks"
import SiteBreadCrumbs from "components/site/SiteBreadCrumbs"
import CircularProgress from '@material-ui/core/CircularProgress';
import NoMatch from "components/site/NoMatch"
import { csrf, headers} from "constants/csrf"
import { flash_alert } from 'components/App';
const GET_CURRENT_USER = "GET_CURRENT_USER";
function getCurrentUser(user) {
  return dispatch => {
    dispatch(getCurrentUserSuccess(user))
  };
};

export function getCurrentUserSuccess(json) {
  return {
    type: GET_CURRENT_USER,
    json
  };
};

const GET_UNREAD_NOTIFICATIONS_REQUEST = "GET_UNREAD_NOTIFICATIONS_REQUEST";
const GET_UNREAD_NOTIFICATIONS_SUCCESS = "GET_UNREAD_NOTIFICATIONS_SUCCESS";

function getNotifications(current_user_id = nil) {
	return dispatch => {
		dispatch({type: GET_UNREAD_NOTIFICATIONS_REQUEST});
		return fetch(`/api/v1/users/${current_user_id}/notifications_unread`)
		.then(response => response.json())
		.then(json => dispatch(getNotificationsSuccess(json)))
		.catch(error => console.log(error));
		};
	};
	  
  export function getNotificationsSuccess(json) {
	  return {
		  type: GET_UNREAD_NOTIFICATIONS_SUCCESS,
		  json
	  };
  };
	  



function Routes(props){
		const [redirect, setRedirect] = useState(false);
		const [loading, setLoading] = useState(true);
		
      	const history = useHistory();

      	useEffect(() => {
	      	props.getCurrentUser(props.current_user);
			setLoading(true);
			check_permissions(location.pathname)
			setLoading(false);
			
		  	history.listen((location, action) => {
				props.getCurrentUser(props.current_user);
				props.getNotifications(props.current_user.id)
				let element_to_scroll_to = document.getElementById('logo');
				element_to_scroll_to.scrollIntoView();
				setLoading(true);
				check_permissions(location.pathname);
				setLoading(false);
			});
      	},[history.location.pathname]);
		

		useEffect(() => {
			if(props.current_user){
				props.getNotifications(props.current_user.id)
			}
		},[props.notifications]);


		useEffect(() => {
			if(props.current_user){
				props.getNotifications(props.current_user.id)
			}
		},[props.current_user]);
		  function check_permissions(pathname) {
		   return fetch(`/api/v1/abilities/check?location=${pathname}`)
		      .then(response => response.json())
		      .then(json => {
				setRedirect(!json.response)
				if(!json.response){
					flash_alert("No autorizado", "Usted no tiene permisos para realizar esta acción", "danger")
				}
		      })
		    .catch(error => console.log(error));
		}


      	let redirect_check = []
		if (redirect){
			redirect_check.push(
				<Redirect key="redirect-to-home" to="/home"><Home /></Redirect>
			);
		}

		let loading_check = []
		if (loading){
			loading_check.push(
				<div key="loading-container" className="loading-container">
					<CircularProgress key="loading" />
 				</div>
			);
		}
	    return (
		  <div>
		  	{redirect_check}
		  	<NavLinks headers={headers} unread_notifications={props.unread_notifications} notifications={props.notifications} current_user={props.current_user} />
    	    <SideNavLinks />
			<Searcher  setLoading={setLoading} />
    	    <SiteBreadCrumbs />
		  	{loading_check}
		  	<div className="main">
			    <Switch>
				  {/* All */}
			      <Route  exact path="/" component={Home}/>
			      <Route path="/home" component={Home}/>
				  {/* Users */}
				  <Route exact path="/users" render={({ match }) => <Users setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/users/:id/edit" render={({ match }) => <EditUser setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/users/new" render={({ match }) => <NewUser setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Technicians */}
				  <Route exact path="/technicians" render={({ match }) => <	Technicians setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/technicians/:id/edit" render={({ match }) => <EditTechnician setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/technicians/new" render={({ match }) => <NewTechnician setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Customers */}
				  <Route exact path="/customers" render={({ match }) => <	Customers setLoading={setLoading} history={history} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/customers/:id/edit" render={({ match }) => <EditCustomer setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/customers/new" render={({ match }) => <NewCustomer setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/customers/:id/show" render={({ match }) => <ShowCustomer setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
				  {/* Project Customers */}
				  <Route exact path="/customers/projectCustomers" render={({ match }) => <ProjectCustomers setLoading={setLoading} history={history} headers={headers} match={match} current_user={props.current_user} />} />
            <Route exact path="/customers/:id/projects/:project_id/show" render={({ match }) => <ProjectDetail setLoading={setLoading} history={history} headers={headers} match={match} current_user={props.current_user} />} />
				  {/* services*/}
				  <Route exact path="/services" render={({ match }) => <Services setLoading={setLoading} history={history} headers={headers} match={match} current_user={props.current_user} />} />
				  {/* Finance */}
				  <Route exact path="/finance" render={({ match }) => <Finance setLoading={setLoading} history={history} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Customers additionals*/}
				  <Route exact path="/customers/:id/additional" render={({ match }) => <NewAdditional setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/customers/:id/additional/:id_ad/edit" render={({ match }) => <EditAdditional setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Customers additionals address*/}
				  <Route exact path="/customers/:id/additional_address" render={({ match }) => <NewAdditionalAddress setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/customers/:id/additional_address/:id_ad/edit" render={({ match }) => <EditAdditionalAddress setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Customers Services*/}
				  <Route exact path="/customers/:id/new_service" render={({ match }) => <NewService setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/customers/:id/services/:service_id/edit_service" render={({ match }) => <EditService setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/customers/:id/services/:service_id/new_visit" render={({ match }) => <NewVisit setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Policies */}
				  <Route exact path="/customers/:id/new_policy" render={({ match }) => <NewPolicy setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      <Route exact path="/customers/:id/policies/:id_policy/edit_policy" render={({ match }) => <EditPolicy setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
				  {/* Calendars*/}
				  <Route exact path="/calendar" render={({ match }) => <Calendar setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Surveys*/}
				  <Route exact path="/surveys" render={({ match }) => <Surveys setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Notifications*/}
				  <Route exact path="/notifications" render={({ match }) => <Notifications setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      {/* Downloads*/}
				  <Route exact path="/data_download" render={({ match }) => <Downloads setLoading={setLoading} headers={headers} match={match} current_user={props.current_user} />} />
			      

				  <Route component={NoMatch} />
			    </Switch>
		    </div>
		  </div>
		);
}

const structuredSelector = createStructuredSelector({
    current_user: state => state.current_user,
	unread_notifications: state => state.unread_notifications,
	notifications: state => state.notifications,
});
const mapDispatchToProps = {getCurrentUser,getNotifications};
export default (connect(structuredSelector, mapDispatchToProps)(Routes));
