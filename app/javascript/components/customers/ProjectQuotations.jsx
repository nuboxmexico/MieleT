import React from 'react'
import MaterialTable from 'react-data-table-component';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {
  Paper,
  Typography,
  Link as MuiLink,
} from '@material-ui/core';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

function ProjectQuotations(props) {
  const {t} = useTranslation();
  const {projectCustomer = {}} = props
  const {projects = []} = projectCustomer
  console.log({projects})

  const projectColumns = [
    {
      name: t('globalTables.projectColumns.quoteCode'),
      selector: "code",
    },
    {
      name: t('globalTables.projectColumns.address'),
      selector: "address_label"
    },
    {
      name: t('globalTables.projectColumns.commune'),
      selector: "commune"
    },
    {
      name: t('globalTables.projectColumns.email'),
      selector: "contact_email"
    },
    {
      name: t('globalTables.projectColumns.status'),
      selector: "status"
    },
    {
      name: t('globalTables.projectColumns.actions'),
      cell: (row) => (
        <MuiLink color="primary" className="" component={Link} to={`/customers/${projectCustomer.customer_id}/projects/${row.id}/show`}>
          <AssignmentIcon fontSize="small" />
          <Typography component="span" color="primary" className="mdl-navigation__link">{t('globalText.details')}</Typography>
        </MuiLink>
        )
    }
  ]

  return (
    <Paper className="custom-paper">
      <h1 className="panel-custom-title">{t('customer.showCustomer.currentQuotesTitle')}</h1>

      <MaterialTable
        noHeader={true}
        columns={projectColumns}
        data={projects}
        responsive={true}
        highlightOnHover={true}
        striped={true}
        noDataComponent={i18next.t('globalText.NoDataComponent')}
      />

    </Paper>
  )
}

export default ProjectQuotations

