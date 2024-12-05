import React from "react"
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"

function NoMatch(props){
  	return (
     <React.Fragment>
              NoMatch
      </React.Fragment>
	)
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(NoMatch));
