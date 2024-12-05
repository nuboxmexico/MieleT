import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'react-data-table-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Complaint from "components/complaints/Complaint"
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuServices from './MenuServices';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';


const customer_product_columns = [
  {
    name: i18next.t('globalTables.productsColumns.tnr'),
    selector: 'tnr',
    sortable: true,
    cell: row => (
      <span>
        {(row.tnr == "" ? "Sin información" : row.tnr)}
      </span>
    ),
  },
  {
    name: i18next.t('globalTables.productsColumns.id'),
    selector: 'serial_id',
    sortable: true,
    cell: row => (
      <span>
        {(!row.serial_id ? "Sin información" : row.serial_id)}
      </span>
    ),
},
{
  name: i18next.t('globalTables.productsColumns.name'),
  selector: 'name',
  sortable: true,
  cell: row => (
    <span>
      {(!row.name ? "Sin información" : row.name)}
    </span>
  ),
},
{
  name: i18next.t('globalTables.productsColumns.status'),
  selector: 'state',
  sortable: true,
  cell: row => (
    <span>
      {(!row.state ? "Sin información" : row.state)}
    </span>
  ),
},
{
  name: i18next.t('globalTables.productsColumns.services'),
  selector: 'services',
  sortable: true,
  cell: row => (
    <span>
      {(!row.services ? "Sin información" : row.services)}
    </span>
  ),
},
];

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '25%',
    flexShrink: 0,
    ['@media (max-width:545px)']: { // eslint-disable-line no-useless-computed-key
      flexBasis: '100%',
    },
    p: {
      display: "inline-block",
    }
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));



function CustomerQuotations(props) {
  const classes = useStyles();
  const {t} = useTranslation();
  const [quotationProductIds, setQuotationProductIds] = useState([]);
  const [quotationServices, setQuotationServices] = useState([]);
  const [quotationServiceActual, setQuotationServiceActual] = useState([])
  const [showQuotationServices, setShowQuotationServices] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState([]);



  useEffect(() => {
    var aux= []
    var aux_anchor = []
    for (var i in props.quotations){
      aux_anchor.push(null)
      var ids = ""
      for (var j in props.quotations[i].quotation_products ){
        ids = ids + props.quotations[i].quotation_products[j].core_id+","
      }
      aux.push(ids)
    }
    setAnchorEl(aux_anchor)
    setQuotationProductIds(aux);
  }, []);

  useEffect(() => {
    var aux_1 = []
    for (var i in props.quotations){
      var aux_2 = []
      for (var j in props.services){
        for (var k in props.services[j].customer_products){
          if (props.services[j].customer_products[k].quotation_id == props.quotations[i].quotation.id.toString()){
            aux_2.push(props.services[j])
            break;
          }
          
        }
      }
      aux_1.push(aux_2);
    }
   
    setQuotationServices(aux_1);
    setShowQuotationServices(true);
  }, []);

  function cardQuotationColor(sale_channel_id) {
    if (sale_channel_id == 2) {
      return <div class="project-card"></div>;
    } else if (sale_channel_id == 4) {
      return <div class="retail-card"></div>;
    } else if (sale_channel_id == 5) {
      return <div class="ecommerce-card"></div>;
    }
  }
  
  return (
    <React.Fragment>
      {props.quotations && showQuotationServices && props.quotations.map((quotation,index) => {
        return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header-address"
            >
              {cardQuotationColor(quotation.quotation.sale_channel_id)}
              <Grid container >
                <Grid className={props.zipcodeCheck} item xs={12} sm={3}>
                  <p className="light-label-quotation">{t('customer.quotation.purchaseNumber')}</p>
                  <p className="normal-label-quotation">{quotation.quotation.code && quotation.quotation.code || "Sin información"}</p>
                </Grid>
                {quotation.quotation.sale_channel_id? 
                  <Grid className={props.zipcodeCheck} item xs={12} sm={3}>
                    <p className="light-label-quotation">{t('customer.quotation.orderNumber')}</p>
                    <p className="normal-label-quotation">{quotation.quotation.b2c_order_number && quotation.quotation.b2c_order_number || "Sin información"}</p>
                  </Grid>
                  :
                  <></>
                }
                <Grid className={props.zipcodeCheck} item xs={12} sm={3}>
                  <p className="light-label-quotation">{t('customer.quotation.status')}</p>
                  <p className="normal-label-quotation">{quotation.quotation_state.name && quotation.quotation_state.name || "Sin información"}</p>
                </Grid>
                <Grid className={props.zipcodeCheck} item xs={12} sm={2}>
                  <p className="light-label-quotation">{t('customer.quotation.ibsNumber')}</p>
                  <p className="normal-label-quotation">{quotation.quotation.so_code && quotation.quotation.so_code || "Sin información"}</p>
                </Grid>
                <Grid className={props.zipcodeCheck} item xs={12} sm={2}> 
                  <p className="light-label-quotation">{t('customer.quotation.dateOfAdmission')}</p>
                  <p className="normal-label-quotation">{quotation.quotation_products[0].admission_date && quotation.quotation_products[0].admission_date || "Sin información"}</p>
                </Grid>
                <Grid item xs={12} sm={2} className="show-customer-edit-link">
                  <br/>
                  <Link className="mdl-navigation__link brand-primary-link customers-show-link services-show-link mg-r-15" to={`/customers/${props.customer_id}/new_service?products=${quotationProductIds[index]}`}>
                    <i className="material-icons material-icons-20">add_circle_outline</i> {t('customer.quotation.newService')}
                  </Link>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container >
                <Grid className={props.zipcodeCheck} item xs={12} sm={3}>
                  <p className="light-label-quotation">{t('customer.quotation.requestedBy')}</p>
                  <p className="normal-label-quotation">{t('customer.quotation.client')}</p>
                </Grid>
                <Grid className={props.zipcodeCheck} item xs={12} sm={6}>
                  <p className="light-label-quotation">{t('customer.quotation.channel')}</p>
                  <p className="normal-label-quotation">{t('customer.quotation.partnersB2B')}</p>
                </Grid>
                <Grid className={props.zipcodeCheck} item xs={12} sm={3}>
                  <MenuServices
                    quotationServices = {quotationServices} 
                    index = {index}
                    quotationServiceActual={quotationServiceActual}
                    customer_id={props.customer_id}
                  />
                </Grid>
                <Grid item xs={12} className="accordion-margin">
                  <MaterialTable
                    noHeader={true}
                    columns={customer_product_columns}
                    data={quotation.quotation_products}
                    responsive={true}
                    highlightOnHover={true}
                    striped={true}
                    contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                    noDataComponent={i18next.t('globalText.NoDataComponent')}
                    paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
        )
      }
      )
      }
        
      
    </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(CustomerQuotations)
