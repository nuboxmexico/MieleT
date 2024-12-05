import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';
import Typography from '@material-ui/core/Typography';
import VisitCheckList from "components/services/visits/VisitCheckList";
import VisitProducts from "components/services/visits/VisitProducts";
import VisitPayments from "components/services/visits/VisitPayments";
import VisitRequestedSpareParts from "components/services/visits/VisitRequestedSpareParts";
import VisitUsedSpareParts from "components/services/visits/VisitUsedSpareParts";


import PropTypes from "prop-types"
// TABS
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {useTranslation} from 'react-i18next';


let indexes = [0,1,2,3,4];


function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
	  <div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	  >
		{value === index && (
		  <Box p={3}>
			<Typography>{children}</Typography>
		  </Box>
		)}
	  </div>
	);
  }
  
  TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
	return {
	  id: `simple-tab-${index}`,
	  'aria-controls': `simple-tabpanel-${index}`,
	};
  }

function VisitTabs(props){
    const {t} = useTranslation();
    const [currentTab, setCurrentTab] = useState(0);
    const [updated, setUpdated] = useState(false);
    const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	  };

    useEffect(() => {
      indexes = [0,1,2,3,4];
      if(props.service_type != "Instalación" ){
        indexes = indexes.map((value) => (
            value - 1
        ))
        console.log(indexes)
      } 
      setUpdated(true)
  }, [props.service_type]);
    
	return (
		<React.Fragment>
            {
              updated && 
                <>
                  <Tabs value={currentTab} onChange={handleTabChange} aria-label="simple tabs example"
                          indicatorColor="primary"
                          variant="scrollable"
                          scrollButtons="auto"
                          className="tech-taxon-tabs"
                      >
                      {
                        props.service_type == "Instalación" &&
                        <Tab key={"Checklist"} label={"Checklist"} {...a11yProps(indexes[0])} />
                      }
                      <Tab key={"Productos"} label={t('services.visits.productTableInfo.productsInfo')} {...a11yProps(indexes[1])} />
                      <Tab key={"Refacciones utilizadas"} label={t('services.visits.productTableInfo.useSpareParts')} {...a11yProps(indexes[2])} />
                      <Tab key={"Refacciones solicitadas"} label={t('services.visits.productTableInfo.requestSpareParts')} {...a11yProps(indexes[3])} />
                      <Tab key={"Pagos"} label={t('services.visits.productTableInfo.paymentsInfo')} {...a11yProps(indexes[4])} />
                  </Tabs>
                  {
                        props.service_type == "Instalación" &&
                    <TabPanel key={"tab-Checklist"} value={currentTab} index={indexes[0]}>
                        <VisitCheckList
                        visit={props.visit}
                        />  
                    </TabPanel>
                  }
                  <TabPanel key={"tab-Productos"} value={currentTab} index={indexes[1]}>
                      <VisitProducts 
                          visit={props.visit}
                      />
                      
                  </TabPanel>
                  <TabPanel key={"tab-utilizadas"} value={currentTab} index={indexes[2]}>
                      <VisitUsedSpareParts
                        serviceID={props.serviceID}
                        visit={props.visit}
                      />  
                  </TabPanel>
                  <TabPanel key={"tab-solicitadas"} value={currentTab} index={indexes[3]}>
                      <VisitRequestedSpareParts
                        serviceID={props.serviceID}
                        visit={props.visit}
                      />
                  </TabPanel>
                  <TabPanel key={"tab-Pagos"} value={currentTab} index={indexes[4]}>
                      <VisitPayments 
                          subcategory={props.subcategory}
                          customerID = {props.customerID}
                          visit={props.visit}
                          paymentChannel={props.paymentChannel}
                          country={props.country}
                          totalAmount={props.totalAmount}
                          noPaymentCheck={props.noPaymentCheck}
                          noPaymentOption={props.noPaymentOption}
                          validated_payment={props.validated_payment}
                          invoiceCheck={props.invoiceCheck}
                          paymentFiles={props.paymentFiles}
                          service_type={props.service_type}
                          // Totals
                          selectedPaymentDate={props.selectedPaymentDate}
                          customerPaymentDate={props.customerPaymentDate}
                          totalhours={props.totalhours}
                          hourAmout={props.hourAmout}
                          feeAmount={props.feeAmount}
                          laborAmount={props.laborAmount}
                          consumableAmount={props.consumableAmount}
                          viaticAmout={props.viaticAmout}
                          ivaAmount={props.ivaAmount}
                          subtotalAmount={props.subtotalAmount}
                          totalAmount={props.totalAmount}
                          selectedConsumables={props.selectedConsumables}
                          // Bill address
                          zipcode_fn={props.zipcode_fn}
                          state_fn={props.state_fn}
                          delegation_fn={props.delegation_fn}
                          colony_fn={props.colony_fn}
                          street_type_fn={props.street_type_fn}
                          street_name_fn={props.street_name_fn}
                          ext_number_fn={props.ext_number_fn}
                          int_number_fn={props.int_number_fn}
                          phone_fn={props.phone_fn}
                          administrative_demarcation_fn={props.administrative_demarcation_fn}


                          //callbacks
                          callbacks={props.callbacks}
                      />
                      
                  </TabPanel>
                </>
            }
            
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(VisitTabs)

