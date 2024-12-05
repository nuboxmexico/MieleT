import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'react-data-table-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';

import Complaint from "components/complaints/Complaint"
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

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
      p:{
          display: "inline-block",
      }
    },
  secondaryHeading: {
  fontSize: theme.typography.pxToRem(15),
  color: theme.palette.text.secondary,
  },
}));



function CustomerComplaints(props){
    const {t} = useTranslation();
    const classes = useStyles();
    const [selectedService, setSelectedService] = useState("");
    const [selectedServiceObject, setSelectedServiceObject] = useState({});
    
    const [complaints, setComplaints] = useState([]);
    

    function handleServiceRadioChange(e){
        setSelectedService(e.target.value)
    }
       
    useEffect(() => {
      
      if(selectedService != "" && props.services.length > 0){
        setSelectedServiceObject(props.services.find(service => service.id ==  selectedService))
      }
    }, [selectedService]);

    useEffect(() => {
      if (props.customer_id){
        fetchComplaintData(props.customer_id);
      }
      
    }, [props.customer_id]);
  
    async function fetchComplaintData(customer_id) {
      return fetch(`/api/v1/customers/${customer_id}/complaints`)
        .then(response => response.json())
        .then(json => {
            if(json.data){
              setComplaints(json.data)
            }
        })
        .catch(error => console.log(error));
    }
        
    const service_columns = [

       {
            name: '',
            selector: 'number',
            grow: true,
            minWidth: "65px",
            cell: row => (
                <Radio
                    checked={row.id == selectedService}
                    onChange={handleServiceRadioChange}
                    value={row.id}
                    name="selected-service"
                    color="primary"
                />
            ),
        },
        {
          name: t('globalTables.serviceColumns.number'),
          selector: 'number',
          sortable: true,
          cell: row => (
            <span>
              {(row.number == "" ? t('globalText.noInfo') : row.number)}
            </span>
          ),
        },
        {
          name: t('globalTables.serviceColumns.ibsNumber'),
          selector: 'ibs_number',
          sortable: true,
          hide: 'sm',
          cell: row => (
            <span>
              {(!row.ibs_number ? t('globalText.noInfo') : row.ibs_number)}
            </span>
          ),
        },
        {
          name: t('globalTables.serviceColumns.serviceType'),
          selector: 'service_type',
          sortable: true,
          hide: 'md'
        },
        {
          name: t('globalTables.serviceColumns.subCategory'),
          selector: 'subcategory',
          sortable: true,
          hide: 'md',
          cell: row => (
            <span>
              {(!row.subcategory ? t('globalText.noInfo') : row.subcategory)}
            </span>
          ),
        },
        {
          name: t('globalTables.serviceColumns.statusLabel'),
          selector: 'status_label',
          sortable: true,
          hide: 'md'
        },
        {
          name: t('globalTables.serviceColumns.visitNumber'),
          selector: 'visit_number',
          sortable: true,
          hide: 'md',
          cell: row => (
            <span>
              {(!row.visit_number ? t('globalText.noInfo') : row.visit_number)}
            </span>
          ),
        },
        {
          name: t('globalTables.serviceColumns.createdAt'),
          selector: 'created_at',
          sortable: true,
          hide: 'md'
        },  
    ];
  	return (
  		<React.Fragment>
              <h3 className={"customer-panel-subtitle complaint-subtitle"}>
                {t('customer.showCustomer.enterComplaint')}
              </h3>
              <MaterialTable
                noHeader={true}
                columns={service_columns}
                data={props.services}
                progressPending={props.userLoadingServices}
                progressComponent={<CircularProgress size={75} />}
                pagination
                paginationServer
                responsive={true}
                onChangeRowsPerPage={props.handleServicesPerRowsChange}
                onChangePage={props.handleServicesPageChange}
                paginationTotalRows={props.services_total}
                highlightOnHover={true}
                striped={true}
                highlightOnHover={true}
                striped={true}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                noDataComponent={i18next.t('globalText.NoDataComponent')}
                paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
            />

          {selectedServiceObject.number && 
            <>
            <Complaint
              selectedServiceObject={selectedServiceObject}
              country={props.country}
              customer_id={props.customer_id}
              fetchComplaintData={fetchComplaintData}
              type_c={"new"}
            />
            </>
          }
          <br /><br />
            <Grid container spacing={1}>
              <Grid item xs={12}>       
                    {complaints && complaints.map((complaint, index) => {
                        const labelId = `accordeon-complaint-${complaint.id}-${index}`;
                        
                        return (
                                <Accordion key={labelId}>
                                    <AccordionSummary 
                                    className={'summary-container'}
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`${labelId}-content`}
                                    id={`${labelId}-header`} >
                                    <Typography className={classes.heading}>
                                        <span className="visit-summary-1">{t('customer.showCustomer.complaintNumber')}</span><br/>
                                        <span className="visit-summary-2">{complaint.number}</span>
                                        </Typography>
                                    <Typography className={classes.heading}>
                                        <span className="visit-summary-1">{t('customer.showCustomer.complaintType')}</span><br/>
                                        <span className="visit-summary-2">{complaint.complaint_type}</span>
                                    </Typography>
                                    
                                    <Typography className={classes.heading}>
                                        <span className="visit-summary-1">{t('customer.showCustomer.status')}</span><br/>
                                        <span className="visit-summary-2">{complaint.status_label}</span>
                                    </Typography>
                                    
                                    

                                    <Typography className={classes.heading}>
                                        <span className="visit-summary-1">{t('customer.showCustomer.dateOfEntry')}</span><br/>
                                        <span className="visit-summary-2">{complaint.created_at}</span>
                                    </Typography>
                                    
                                    </AccordionSummary>
                                    <AccordionDetails className="visit-accordeon-details">
                                      <Complaint
                                        selectedServiceObject={selectedServiceObject}
                                        complaint={complaint}
                                        country={props.country}
                                        customer_id={props.customer_id}
                                        fetchComplaintData={fetchComplaintData}
                                        type_c={"edit"}
                                      />
                                    </AccordionDetails>
                                </Accordion>
                        );
                    })}
                </Grid>
            </Grid>
         
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default connect(structuredSelector, mapDispatchToProps)(CustomerComplaints)
