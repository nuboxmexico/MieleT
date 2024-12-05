import React from "react"
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"

import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PeopleIcon from '@material-ui/icons/People';

import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"

function Footer(props){
    return ReactDOM.createPortal(
      <React.Fragment>
              <BottomNavigation value={"value"} className={"root"}>
                <BottomNavigationAction label="HOme" value="home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Users" value="users" icon={<PeopleIcon />} />
              </BottomNavigation>
      </React.Fragment>
      ,document.getElementById('footer')
    )	
}


const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default (connect(structuredSelector, mapDispatchToProps)(Footer));
