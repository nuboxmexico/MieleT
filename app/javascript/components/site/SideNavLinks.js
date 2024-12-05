import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import BuildIcon from '@material-ui/icons/Build';
import { canManage } from 'redux-cancan';
import { useTranslation } from 'react-i18next';

function SideNavLinks(props){
    const {t,i18n} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [currentLanguage,setCurrentLanguage] = React.useState()
    const subdomainRegex = /^\w{2}\./
    const handleClick = () => {
      setOpen(!open);
    };

    useEffect(() => {
      const subdomain = window.location.host.match(subdomainRegex)?.toString()
      if (!subdomain){
        i18n.changeLanguage('es')
      }else{
        i18n.changeLanguage('pt')
      }
      async function fetchData() {
        var elements = document.getElementsByClassName("MuiListItem-button MuiListItem-button-closer")
        for (var i = 0; i < elements.length; i++) {
          elements[i].addEventListener("click", function(){
            document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
            document.querySelector('.mdl-layout__drawer').classList.remove('is-visible'); 
          });
        }

        var elements = document.getElementsByClassName("side-nav-icon")
        for (var i = 0; i < elements.length; i++) {
          elements[i].addEventListener("mouseenter", function( event ) {   
            document.querySelector('.mdl-layout__obfuscator').classList.add('is-visible');
            document.querySelector('.mdl-layout__drawer').classList.add('is-visible'); 
          }, false);           
        }

        var elements = document.getElementsByClassName("mdl-layout__drawer")
        for (var i = 0; i < elements.length; i++) {
          elements[i].addEventListener("mouseleave", function( event ) {   
            document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
            document.querySelector('.mdl-layout__drawer').classList.remove('is-visible'); 
          }, false); 
        }
      }
      fetchData();
    }, []);

     return ReactDOM.createPortal(
      <React.Fragment>
              
        {canManage('/home')? 
          <Link key="home" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/">
            <i className="material-icons MuiListItemIcon-root side-nav-icon">home</i> {t('sideNavBar.home')}
          </Link>:<></>
        }
        
        {canManage('/users')?
            <Link key="users" id="users-link" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/users">
              <i className="material-icons MuiListItemIcon-root side-nav-icon">group</i> {t('sideNavBar.users')}
            </Link>:<></>
        }
        
        {canManage('/technicians')? 
          <Link key="technicians" id="technicians-link" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/technicians">
            <i className="material-icons MuiListItemIcon-root side-nav-icon">engineering</i> {t('sideNavBar.technicians')}
          </Link>:<></>
        }

        {canManage('/customers')? 
          <React.Fragment>
            <ListItem id="customer-link" button onClick={handleClick}>
              <ListItemIcon>
              <i className="material-icons MuiListItemIcon-root side-nav-icon">people</i>
              </ListItemIcon>
              <ListItemText primary="Clientes" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <div className='margin-icon'>
                  <Link key="customers" id="customers-link" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/customers">
                  <i className="material-icons MuiListItemIcon-root side-nav-icon">maps_home_work</i> <span className='padding-text-icon'>{t('sideNavBar.domestics')}</span>
                  </Link>
                  <Link key="project-customers" id="project-customers-link" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/customers/projectCustomers">
                  <i className="material-icons MuiListItemIcon-root side-nav-icon">business_center</i><span className='padding-text-icon'> {t('sideNavBar.projects')}</span>
                  </Link>
                </div>
              </List>
            </Collapse>
          </React.Fragment> : <></>
        }

        {canManage('/services') ? 
          <Link key="services" id="services-link" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/services">
            <i className="material-icons MuiListItemIcon-root side-nav-icon">handyman</i> {t('sideNavBar.services')}
          </Link>:<></>
        }

        {canManage('/finance') ?
            <Link key="finance" id="finance-link" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/finance">
              <i className="material-icons MuiListItemIcon-root side-nav-icon">request_quote</i> {t('sideNavBar.finances')}
            </Link>:<></>
          
        }

        {canManage('/calendar') ?
            <Link key="calendar" id="calendar-link" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/calendar">
              <i className="material-icons MuiListItemIcon-root side-nav-icon">calendar_today</i> {t('sideNavBar.calendar')}
            </Link>:<></>
          
        }

        {canManage('/surveys') ?
            <Link key="surveys" id="surveys-link" className="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button MuiListItem-button-closer" to="/surveys">
              <i className="material-icons MuiListItemIcon-root side-nav-icon">assignment</i> {t('sideNavBar.surveys')}
            </Link>:<></>
          
        }

        <ListItem button>
          
        </ListItem>
      </React.Fragment>
      ,document.getElementById('side-nav-links')
    )	
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default (connect(structuredSelector, mapDispatchToProps)(SideNavLinks));
