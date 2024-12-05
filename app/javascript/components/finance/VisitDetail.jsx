import React, {useState} from "react"
import MaterialTable from 'react-data-table-component';
import {pendingInvoicing, visitAreCompleted, visitPaidStatus, visitPaidStatusLabel} from "./utils";
import {invoiceStatus} from "../../constants/visitService";
import {
  Box,
  AccordionDetails,
  Grid,
  AccordionSummary,
  Checkbox,
  CircularProgress,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

function VisitDetail(props) {
  const {t} = useTranslation();
  const {service, selectedVisits, setSelectedVisits, selectedService, setSelectedService} = props
  const {service_type, last_visit: {created_at}, requested, cost_center={}} = service
  const visits = service.visits.sort((a, b) => a.visit_number - b.visit_number)
  const rowSelectCritera = row => selectedVisits[service.id]?.some(visit => visit.id === row.id)
  const rowDisabledCriteria = row => row.invoiced !== 'pending' || !visitAreCompleted(row) || (visitPaidStatus(row) === 'unpaid')
  const [selectedRows, setSelectedRows] = useState([]);

  function handleRowChange(state) {
    setSelectedRows(state.selectedRows);
    let newSelectedVisits = selectedVisits

    // Si no existe una visita seleccionada, entonces los eliminaremos de las visitas seleccionadas y los servicios seleccionados
    if (state.selectedRows.length === 0) {
      const newSelectedService = selectedService.filter(selected => selected.id !== service.id)
      delete newSelectedVisits[service.id]
      setSelectedVisits(newSelectedVisits)
      setSelectedService(newSelectedService)
      return
    }

    if (!selectedService.some(selected => selected.id === service.id)) {
      setSelectedService([...selectedService, service])
    } else {
    }

    newSelectedVisits[service.id] = state.selectedRows
    setSelectedVisits(newSelectedVisits)
  }


  const visitColumns = [
    {
      name: i18next.t('globalTables.visitColumns.visitNumber'),
      selector: 'visit_number',
      sortable: true,
    },

    {
      name: t('globalTables.visitColumns.paid'),
      sortable: true,
      cell: row => (
        <span>
        {
          visitPaidStatusLabel(row)
        }
        </span>
      )
    },

    {
      name: t('globalTables.visitColumns.completed'),
      sortable: true,
      cell: row => (
        <span>
        {
          !!row.cancel_from ? t('globalTables.visitColumns.canceled') : (visitAreCompleted(row) ? t('globalTables.visitColumns.yes'): t('globalTables.visitColumns.no'))
        }
        </span>
      )
    },

    {
      name: t('globalTables.visitColumns.invoiced'),
      sortable: true,
      selector: 'invoiced',
      cell: row => (
        <span>{invoiceStatus(row.invoiced) || '-'}</span>
      )
    },

    {
      name: t('globalTables.visitColumns.daysWithoutInvoicing'),
      selector: 'days_without_invoicing',
      sortable: true,
    },
  ]
  const dateOptions = {day: 'numeric', month: 'numeric', year: 'numeric'}
  const lastVisitAt = new Date(created_at).toLocaleString('es-ES', dateOptions)
  return (
    <Box>
      <AccordionSummary
        aria-controls="panel2a-content"
        id="paneladditional-header"
      >
        <span style={{fontWeight: 'medium'}}>
          {t('services.visits.additionalInfo')}
        </span>
      </AccordionSummary>

      <AccordionDetails>
        <Grid item xs={12} sm={3}>
          <span className="service-price-table-label">{t('services.visits.requestFor')}</span>
          {(!service_type) &&
            <Skeleton height={21} />
            ||
            <span className="service-price-table-value service-type-value">{requested}</span>
          }
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <span className="service-price-table-label">{t('services.visits.lastService')}</span>
            {(!created_at) &&
              <Skeleton height={21} />
              ||
              <span className="service-price-table-value service-type-value">{lastVisitAt} </span>
            }
          </Grid>

          <Grid item xs={12} sm={3}>
            <span className="service-price-table-label">{t('services.visits.costCenter')}</span>
            <span className="service-price-table-value service-type-value">{cost_center?.fullname || '-'}</span>
          </Grid>
        </Grid>
      </AccordionDetails>
      <Box>
        <AccordionSummary
          aria-controls="panel2a-content"
          id="paneladditional-header"
        >
          <span style={{fontWeight: 'medium'}}>
            {t('services.visits.associatedVisits')}
          </span>
        </AccordionSummary>

        <AccordionDetails style={{margin: '0 0 60px 0'}}>
          <MaterialTable
            noHeader={true}
            selectableRowsComponentProps={{className: "product-checkbox", color: "primary"}}
            columns={visitColumns}
            striped={true}
            data={visits}
            selectableRows
            selectableRowsComponent={Checkbox}
            highlightOnHover={true}
            onSelectedRowsChange={handleRowChange}
            selectableRowSelected={rowSelectCritera}
            selectableRowDisabled={rowDisabledCriteria}
            progressComponent={<CircularProgress size={50} />}
            noDataComponent={i18next.t('globalText.NoDataComponent')}
          />
        </AccordionDetails>
      </Box>
    </Box>
  )
}

export default VisitDetail;
