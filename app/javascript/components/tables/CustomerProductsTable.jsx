import React from "react"
import MaterialTable from 'react-data-table-component';
import { CircularProgress } from '@material-ui/core'
import EditCustomerProductDialog from "components/customers/EditCustomerProductDialog"
import DeleteCustomerProductDialog from "components/customers/DeleteCustomerProductDialog"
import CustomerProductEan from "components/customers/common/CustomerProductEan";
import { headers, date_format_without_time, date_format_without_time_and_zone } from "constants/csrf"
import i18next from 'i18next';

  const customerProductColumns = [
    
    {
      name: i18next.t('services.productDetails.family'),
      hide: 'md',
      cell: row => (
        <span>
          {row.product.product_taxons &&
            <>
              {(!row.product.product_taxons.find(object => object["depth"] == 1) ? i18next.t('globalText.noInfo') : row.product.product_taxons.find(object => object["depth"] == 1).taxon.name)}
            </>
          }
        </span>
      ),
    },
    {
      name: i18next.t('services.productDetails.subFamily'),
      hide: 'md',
      cell: row => (
        <span>
          {row.product.product_taxons &&
            <>
              {(!row.product.product_taxons.find(object => object["depth"] == 2) ? i18next.t('globalText.noInfo') : row.product.product_taxons.find(object => object["depth"] == 2).taxon.name)}
            </>
          }
        </span>
      ),
    },
    {
      name: i18next.t('services.productDetails.serialId'),
      selector: 'serial_id',
      sortable: true,
      cell: row => (
        <CustomerProductEan key={row.serial_id} serial_id={row.serial_id} b2b_ean={row.b2b_ean} />
      ),
    },
    {
      name: i18next.t('services.productDetails.tnr'),
      selector: 'product.tnr',
      sortable: true,
      cell: row => (
        <span>
          {(row.product.tnr == "" ? i18next.t('globalText.noInfo') : row.product.tnr)}
        </span>
      ),
    },
    {
      name: i18next.t('services.productDetails.name'),
      selector: 'product.name',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(row.product.name == "" ? i18next.t('globalText.noInfo') : row.product.name)}
        </span>
      ),
    },
    {
      name: i18next.t('services.productDetails.installed'),
      selector: 'instalation_date',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(row.instalation_date == null ? "No" : date_format_without_time_and_zone(row.instalation_date))}
          {row.reinstalation_date != null &&
            <>
              <br /><br />
              {(row.reinstalation_date == null ? "" : date_format_without_time_and_zone(row.reinstalation_date) + " reinstalado")}
            </>
          }
        </span>
      ),
    },
    {
      name: i18next.t('services.productDetails.discontinued.columName'),
      selector: 'discontinued',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(row.discontinued ? i18next.t('services.productDetails.discontinued.yes') : i18next.t('services.productDetails.discontinued.no'))}
        </span>
      ),
    },
    {
      name: i18next.t('services.productDetails.warranty.title'),
      selector: 'warranty',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {((row.warranty == null ? i18next.t('services.productDetails.warranty.no') : i18next.t('services.productDetails.warranty.validate') + date_format_without_time(row.warranty)))}
        </span>
      ),
    },
    {
      name: i18next.t('services.productDetails.policy'),
      selector: 'policy',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('services.productDetails.status'),
      selector: 'status',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('services.productDetails.actions'),
      selector: 'id',
      grow: true,
      cell: row => (
        <span>
          <EditCustomerProductDialog key={"edit-customer-product" + row.id} customer_id={row.customer_id} id={row.serial_id} customer_product_id={row.id} tnr={row.product.tnr} name={row.product.name} taxons={row.product.taxons} product_taxons={row.product.product_taxons} discontinued={row.discontinued} instalation_date={row.instalation_date} headers={headers} />
          <DeleteCustomerProductDialog key={"delete-customer-product" + row.id} customer_id={row.customer_id} customer_product_id={row.id} tnr={row.product.tnr} name={row.product.name} headers={headers} />
        </span>
      ),
    },

  ]

function CustomerProductsTable(props) {
  const { customerProducts, loading } = props

  
  return (
    <MaterialTable
      noHeader={true}
      columns={customerProductColumns}
      data={customerProducts}
      progressPending={loading}
      progressComponent={<CircularProgress size={75} />}
      responsive={true}
      highlightOnHover={true}
      striped={true}
      contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
      noDataComponent={i18next.t('globalText.NoDataComponent')}
      paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
    />
  )
}

export default CustomerProductsTable
