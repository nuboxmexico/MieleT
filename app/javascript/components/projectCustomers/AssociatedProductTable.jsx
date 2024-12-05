import React from "react"
import MaterialTable from 'react-data-table-component';
import CustomerProductEan from "components/customers/common/CustomerProductEan";


function AssociatedProductTable(props) {
  const {customerProducts = []} = props;
  const columns = [
    {
      name: "Nombre",
      selector: "product.name",
    },
    {
      name: "TNR",
      selector: "product.tnr"
    },
    {
      name: "ID",
      cell: row => (
        <CustomerProductEan key={row.serial_id} serial_id={row.serial_id} b2b_ean={row.b2b_ean} />
      )
    },
  ]

  return (
    <div>
      <MaterialTable
        noHeader={true}
        columns={columns}
        data={customerProducts}
        responsive={true}
        highlightOnHover={true}
        striped={true}
        noDataComponent={<h6>No se han encontrado resultados</h6>}
      />
    </div>
  )
}


export default AssociatedProductTable
