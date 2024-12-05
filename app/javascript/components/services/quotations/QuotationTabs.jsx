import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';
import Typography from '@material-ui/core/Typography';
import QuotationPayments from "components/services/quotations/QuotationPayments";

import PropTypes from "prop-types"
// TABS
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import Button from '@material-ui/core/Button'
import QuotationDetails from "components/services/quotations/QuotationDetails";
import {csrf, headers, headers_www_form, money_format, product_price, date_event_format, date_format_without_time, date_difference_in_hours, api_token, site_url, payment_channel_label} from "constants/csrf"
import {useTranslation} from 'react-i18next';
let indexes = [0,1];


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

function QuotationTabs(props){
    const { t } = useTranslation('translation', { keyPrefix: 'services.quotes.detailsTab' });
    const [currentTab, setCurrentTab] = useState(0);
    const [updated, setUpdated] = useState(false);
    const [serviceStatusLabel, setserviceStatusLabel] = useState(props.serviceStatusLabel);
    const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
    };

    useEffect(() => {
      indexes = [0,1];
      setUpdated(true)
  }, [props.service_type]);

  useEffect(() => {
    setserviceStatusLabel(props.serviceStatusLabel)
}, [props.serviceStatusLabel]);

  
  
    
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
                      <Tab key={"Detalles"} label={t('details')} {...a11yProps(indexes[0])} />
                      <Tab key={"Pagos"} label={"Pagos"} {...a11yProps(indexes[1])} />
                  </Tabs>
                  
                  <TabPanel key={"tab-Detalles"} value={currentTab} index={indexes[0]}>
                      <QuotationDetails
                        serviceStatusLabel={serviceStatusLabel}
                        serviceID={props.serviceID}
                        quotation={props.quotation}
                        service_type={props.service_type}
                        country={props.country}
                        zipcode={props.zipcode}
                        administrative_demarcation={props.administrative_demarcation}
                        countryIVA={props.countryIVA}
                                                            
                        callbacks={props.callbacks}
                        setLoading={props.setLoading}
                        email={props.email}
                        email2={props.email2}
                        
                        customer_products={props.customer_products}
                        // ADD SPARE PARTS
                        current_user={props.current_user}
                        userLoading={props.userLoading}
                        canAddSparePart={props.canAddSparePart}
                        displayProducTable={props.displayProducTable}
                        classes={props.classes}
                        filterText={props.filterText}
                        changeFilterText={props.changeFilterText}
                        handleClear={props.handleClear}
                        handleAddSparePart={props.handleAddSparePart}
                        products_columns={props.products_columns}
                        products={props.products}
                        total={props.total}
                        handleProductsPerRowsChange={props.handleProductsPerRowsChange}
                        handleProductsPageChange={props.handleProductsPageChange}
                        handleProductRowChange={props.handleProductRowChange}
                        selectedSparePartsRows={props.selectedSparePartsRows}
                        // Viatic amount
                        viaticAmout={props.viaticAmout}
                      />
                  </TabPanel>
                  <TabPanel key={"tab-Pagos"} value={currentTab} index={indexes[1]}>
                    <QuotationPayments
                      callbacks={props.callbacks}
                      serviceID={props.serviceID}
                      country={props.country}
                      index={props.index} 
                      customerPaymentDate={props.customerPaymentDate}
                      selectedPaymentDate={props.selectedPaymentDate}
                      invoiceCheck={props.invoiceCheck}
                      validated_payment={props.validated_payment}
                      noPaymentCheck={props.noPaymentCheck}
                      totalAmount={props.totalAmount}
                      paymentChannel={props.paymentChannel}
                      quotation={props.quotation}
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

export default connect(structuredSelector, mapDispatchToProps)(QuotationTabs)

