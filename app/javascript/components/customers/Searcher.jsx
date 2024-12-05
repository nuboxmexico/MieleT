import React, {useState, useEffect} from "react"
import {buildFullName} from 'components/customers/utils'
import {InputPicker} from 'rsuite';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import {Box} from "@material-ui/core";
import axios from "axios"
import 'assets/custom-rsuite.css'
import { useTranslation } from 'react-i18next';

function Searcher(props) {
  const {t} = useTranslation();
  // TODO: Rebuild all with MUI
  const {
    customersMapped, setCustomersMapped,
    selectedCustomer, setSelectedCustomer,
  } = props

  const [loading, setLoading] = useState(true)
  const initialStateCustomers = Object.keys(selectedCustomer).length > 0 ? [selectedCustomer] : []
  const [customers, setCustomers] = useState(initialStateCustomers)

  async function getCustomers(keywords = "") {
    setLoading(true)
    const {data} = await axios.get('/api/v1/customers', {params: {keywords}})
    const newCustomers = data.data.filter((customer) => customer.unit_real_state_id === null)
    setCustomers(newCustomers)
  }

  useEffect(() => {
    if (!(customers.length > 0)) return

    const newCustomersMapped = customers.map((customer) => ({label: buildFullName(customer), value: customer.id}))
    setCustomersMapped(newCustomersMapped)
    setLoading(false)
    console.log({newCustomersMapped});
    console.log({customers});
  }, [customers])

  function handleSelectedCustomer(newSelectedCustomerId) {
    const newSelectedCustomer = customers.find((customer) => customer.id === newSelectedCustomerId)
    setSelectedCustomer(newSelectedCustomer)
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <InputPicker
        data={customersMapped}
        style={{height: "100%", width: "100%"}}
        onSearch={getCustomers}
        placeholder={t('customer.projectCustomer.searcher')}
        onSelect={handleSelectedCustomer}
        defaultValue={selectedCustomer?.id || ""}
        renderMenu={menu => {
          if (loading) {
            return (
              <p style={{padding: 10, color: '#999', textAlign: 'center'}}>
                <SpinnerIcon spin /> {t('customer.projectCustomer.typeToSearch')}
              </p>
            );
          }
          return menu;
        }}
      />
    </Box>
  )
}

export default Searcher
