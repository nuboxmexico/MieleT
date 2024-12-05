import React, {useState, useEffect} from "react"
import MaterialTable from 'react-data-table-component';
import {Link as MuiLink, CircularProgress, Tooltip} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';
import {KeyboardArrowUp, KeyboardArrowDown, AddCircleOutline} from '@material-ui/icons';
import UnitRealStateTabs from 'components/projectCustomers/UnitRealStateTabs'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import AssignCustomer from 'components/customers/AssignCustomer'
import { useTranslation } from 'react-i18next';

function ProjectUnitRealStates(props) {
  const {t} = useTranslation();
  const {unitRealStates = []} = props
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(false)
  }, [unitRealStates])

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
      "& a": {
        color: theme.palette.primary.main,
      }
    },
  }))(Tooltip);

  function AssignCustomerTitle() {
    return (
      <div>
        <span style={{marginRight: "6px"}}>{t('customer.projectCustomer.assignClient')}</span>
        <HtmlTooltip placement="right" interactive title={
          <>
            {t('customer.newService.flashAlert.projectCustomerRequired')}
            <a className="force-underline" target="_blank" href="/customers/new"> {t('customer.projectCustomer.here')}</a>
          </>
        } aria-label="add">
          <ErrorOutlineIcon fontSize="small" />
        </HtmlTooltip>
      </div>
    )

  }

  const columns = [
    {
      name: t('globalTables.realEstateUnitColumns.unitType'),
      selector: "unit_type",
    },
    {
      name: t('globalTables.realEstateUnitColumns.unitNumber'),
      selector: "unit_number"
    },
    {
      name: t('globalTables.realEstateUnitColumns.productQuantity'),
      cell: row => <span>{row.customer_products.length}</span>
    },
    {
      name: t('globalTables.realEstateUnitColumns.deliveredProducts'),
      selector: "customer_product_statuses.entregado"
    },
    {
      name: t('globalTables.realEstateUnitColumns.installedProducts'),
      selector: "customer_product_statuses.instalado"
    },
    {
      name: t('globalTables.realEstateUnitColumns.pendingProducts'),
      selector: "customer_product_statuses.inicial"
    },
    {
      name: <AssignCustomerTitle />,
      center: true,
      width: "320px",
      cell: (row) => (
        <AssignCustomer unitRealState={row} />
      ),
    }

  ]
  return (
    <div>
      <h1 className="panel-custom-title">{t('customer.projectCustomer.title')}</h1>
      <MaterialTable
        noHeader
        expandableRows
        columns={columns}
        data={unitRealStates}
        expandOnRowClicked
        expandableIcon={{expanded: <KeyboardArrowUp />, collapsed: <KeyboardArrowDown />}}
        expandableRowsComponent={<UnitRealStateTabs />}
        noDataComponent={i18next.t('globalText.NoDataComponent')}
        progressComponent={<CircularProgress size={50} />}
        progressPending={loading}
      />
    </div>
  )
}

export default ProjectUnitRealStates

