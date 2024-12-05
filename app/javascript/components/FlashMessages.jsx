import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { flash_alert } from 'components/App';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

function FlashMessages(props){
	
	useEffect(() => {
	  async function fetchData() {
	  	if(props.messages){
	  		props.messages.forEach(function(message){
	  			handleMessage(message[1] , message[0])
	  		});
	  	}
	  }
	  fetchData();
	}, []);

	function handleMessage(message , type) {
			flash_alert("", message , type)
	}
  	return (
  		<React.Fragment>
  			<ReactNotification />
		</React.Fragment>
	);
}


export default FlashMessages
