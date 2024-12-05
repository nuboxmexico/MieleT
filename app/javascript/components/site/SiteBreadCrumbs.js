import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link, useHistory } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { TranslatorProvider, useTranslate } from "react-translate"
import { useTranslation } from 'react-i18next';

const breadcrumbNameMap_es = {
  '/users': 'Usuarios',
  '/users/new': 'Nuevo',
  '/users/:id/edit': 'Editar',
  '/technicians': 'Técnicos',
  '/technicians/new': 'Nuevo',
  '/technicians/:id/edit': 'Editar',
  '/customers': 'Clientes',
  '/customers/new': 'Nuevo',
  '/customers/:id/edit': 'Editar',
  '/customers/:id/show': 'Detalle Cliente',
  '/customers/show': 'Detalle Cliente',
  '/customers/:id/additional': 'Adicional Cliente',
  '/customers/:id/additional_address': 'Dirección Adicional',
  '/customers/:id/new_service': 'Nuevo Servicio',
  '/customers/:id/edit_service': 'Servicio Agendado',
  '/customers/:id/services/new_visit': 'Nueva Visita',
  '/customers/:id/new_policy': 'Nueva Póliza',
  '/customers/:id/edit_policy': 'Editar Póliza',
  '/customers/:id/projects/:project_id/show': 'Detalle proyecto',
  '/services': 'Servicios',
  '/finance': 'Finanzas',
  '/calendar': 'Calendario general',
  '/surveys': 'Encuestas',
  '/notifications': 'Notificaciones',
};

const breadcrumbNameMap_pt = {
  '/users': 'Usuários',
  '/users/new': 'Novo',
  '/users/:id/edit': 'Editar',
  '/technicians': 'Técnicos',
  '/technicians/new': 'Novo',
  '/technicians/:id/edit': 'Editar',
  '/customers': 'Clientes',
  '/customers/new': 'Novo',
  '/customers/:id/edit': 'Editar',
  '/customers/:id/show': 'Detalhes do cliente',
  '/customers/show': 'Detalhes do cliente',
  '/customers/:id/additional': 'Cliente Adicional',
  '/customers/:id/additional_address': 'Endereço adicional',
  '/customers/:id/new_service': 'Novo serviço',
  '/customers/:id/edit_service': 'Serviço agendado',
  '/customers/:id/services/new_visit': 'Nova visita',
  '/customers/:id/new_policy': 'Nova Política',
  '/customers/:id/edit_policy': 'Editar política',
  '/customers/:id/projects/:project_id/show': 'Detalhes do projeto',
  '/services': 'Serviços',
  '/finance': 'Finanças',
  '/calendar': 'Calendário geral',
  '/surveys': 'Pesquisas',
  '/notifications': 'Notificações',
};

let translations_es = {
  locale: "es",
  BreadCrumb: {
    "edit": "Editar",
    "show": "Detalles",
    "additional": "Adicional",
    "additional_address": "Dirección Adicional",
    "new_service": "Nuevo Servicio",
    "edit_service": "Servicio Agendado",
    "new_policy": "Nueva Póliza",
    "edit_policy": "Editar Póliza",
    "new_visit": "Nueva Visita"
  }
};

let translations_pt = {
  locale: "pt",
  BreadCrumb: {
    "edit": "Editar",
    "show": "Detalhes",
    "additional": "Adicional",
    "additional_address": "Endereço Adicional",
    "new_service": "Novo serviço",
    "edit_service": "Serviço agendado",
    "new_policy": "Nova Política",
    "edit_policy": "Editar Política",
    "new_visit": "Nova visita"
  }
};
 
function BreadCrumbT(text) {
  let t = useTranslate("BreadCrumb");
  return t(text.text)
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: "auto",
  },
  lists: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));


function SiteBreadCrumbs(props){
  const classes = useStyles();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const history = useHistory();
  const {i18n} = useTranslation();
  useEffect(() => {
    fetchData();
    history.listen((location, action) => {
      fetchData();
    });
  },[history.location.pathname]);

  async function fetchData() {
    const breadcrumbNameMap = (i18n.language === 'es'? breadcrumbNameMap_es : breadcrumbNameMap_pt) 
    let newBreadcrumbs = []
      if (breadcrumbNameMap){
        const pathnames = location.pathname.split('/').filter((x) => x);
        let last_path = null;
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
         
          if(last && pathnames.length > 2){
            newBreadcrumbs.push(
                <Typography className="mdl-navigation__link capitalize" key={to}>
                    <BreadCrumbT text={pathnames[pathnames.length - 1]}/>
                </Typography>
            );
          }else{
            if(breadcrumbNameMap[to]){
              newBreadcrumbs.push(
                <Link className="mdl-navigation__link" to={to} key={to}>
                  {breadcrumbNameMap[to]}
                </Link>
              );
            }else{
              var to_t = `/${pathnames[0]}/show`;
              if (last_path != breadcrumbNameMap[to_t]){
                if(breadcrumbNameMap[to_t]){
                  console.log(to_t)
                  newBreadcrumbs.push(
                  <Link className="mdl-navigation__link" to={to+"/show"} key={to+"/show"}>
                      {breadcrumbNameMap[to_t]}
                  </Link>
                  );
                }
              }
              last_path = breadcrumbNameMap[to_t]   
            }
          }
          
        })}
      }
      setBreadcrumbs(newBreadcrumbs);
  }

  return (
      <div className={classes.root}>
        <TranslatorProvider translations={i18n.language === 'es'? translations_es : translations_pt}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link className="mdl-navigation__link" to="/">
                Inicio
            </Link>
            {breadcrumbs}  
          
          </Breadcrumbs>
        </TranslatorProvider>
      </div>
  );
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default (connect(structuredSelector, mapDispatchToProps)(SiteBreadCrumbs));
