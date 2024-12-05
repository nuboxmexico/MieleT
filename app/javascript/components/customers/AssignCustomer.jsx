import React, {useState, useEffect} from "react"
import axios from 'axios'
import {AddCircleOutline, CloseOutlined} from '@material-ui/icons';
import {Box, Chip, Link as MuiLink} from "@material-ui/core";
import {buildFullName, buildCustomerShowLink} from 'components/customers/utils'
import {headers} from 'constants/csrf'
import Searcher from 'components/customers/Searcher'
import { useTranslation } from 'react-i18next';

function AssignCustomer(props) {
  const {t} = useTranslation();
  const {unitRealState} = props
  const [customersMapped, setCustomersMapped] = useState([])
  const [editMode, setEditMode] = useState(false)
  const selectedCustomerInitialState = unitRealState?.customer || {}
  const [selectedCustomer, setSelectedCustomer] = useState(selectedCustomerInitialState)

  async function handleAssign() {
    try {
      const {data} = await axios.put(`/api/v1/customers/${selectedCustomer.id}/assign_unit_real_state/${unitRealState.id}`, {headers})
      setEditMode(false)
      setSelectedCustomer(data)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setSelectedCustomer(selectedCustomerInitialState)
  }, [unitRealState])

  return (
    <>
      {
        editMode ?

          <Box display="flex" alignItems="center" justifyContent="center">
            <Searcher
              customersMapped={customersMapped}
              setCustomersMapped={setCustomersMapped}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />

            <Chip
              disabled={!Object.keys(selectedCustomer).length}
              component="button"
              type="submit"
              style={{borderRadius: "initial", marginLeft: "3px"}}
              label={t('customer.projectCustomer.assignButton')}
              onClick={handleAssign}
              color="primary"
              variant="outlined"
              size="medium" />
            <CloseOutlined color="action" onClick={() => setEditMode(false)} />
          </Box>
          :
          <>
            {Object.keys(selectedCustomer).length > 0 && <MuiLink className="force-underline" href={buildCustomerShowLink(selectedCustomer)} target="_blank">{buildFullName(selectedCustomer)}</MuiLink>}
            <AddCircleOutline style={{marginLeft: "5px"}} onClick={() => setEditMode(true)} color="primary" />
          </>
      }
    </>
  )
}

export default AssignCustomer
