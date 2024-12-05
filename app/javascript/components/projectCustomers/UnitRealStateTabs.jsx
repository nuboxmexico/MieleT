import React, {useState} from "react"
import {Tabs, Tab, Box, Typography} from '@material-ui/core';
import AssociatedProductTable from "components/projectCustomers/AssociatedProductTable";
import { useTranslation } from 'react-i18next';

function UnitRealStateTabs({data: unitRealState = {}}) {
  const {t} = useTranslation();
  const [currentTab, setCurrentTab] = useState(0)
  console.log(unitRealState);

  function handleTabChange(_event, newValue) {
    console.log({newValue});
    setCurrentTab(newValue);
  };

  function TabPanel(props) {
    const {children, value, index, ...other} = props;

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
            <Typography component="span">{children}</Typography>
          </Box>
        )}
      </div>
    );
  }


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box p={2}>
      <Tabs
        indicatorColor="primary"
        value={currentTab}
        onChange={handleTabChange}
        className="tech-taxon-tabs"
      >

        <Tab key={"associated-products"} label={t('customer.projectCustomer.associatedProducts')} {...a11yProps(0)} />
      </Tabs >

      <TabPanel value={currentTab} index={0}>
        <AssociatedProductTable customerProducts={unitRealState.customer_products} />
      </TabPanel>
    </Box>
  )
}

export default UnitRealStateTabs
