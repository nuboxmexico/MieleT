import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {connect} from "react-redux"
import {createStructuredSelector} from "reselect";
import {flash_alert} from 'components/App';


import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import {createStyles, makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'

//List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {csrf, headers, headers_www_form, money_format, product_price, product_price_no_format, quotation_spare_part_price, quotation_spare_part_price_no_format, date_event_format, date_format_without_time, date_difference_in_hours, api_token, site_url, payment_channel_label} from "constants/csrf"
import {is_TM, is_CS} from "constants/user_functions"
import {FileIcon, defaultStyles} from 'react-file-icon';
import mime from "mime-to-extensions";

import MaterialTable from 'react-data-table-component';
import Skeleton from '@material-ui/lab/Skeleton';
import AddSparePartDialog from "components/services/AddSparePartDialog";
import DeleteSparePartDialog from "components/services/DeleteSparePartDialog";
import EditSparePartDialog from "components/services/EditSparePartDialog";
import QuotationProductWarranty from "components/services/quotations/QuotationProductWarranty";

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// translation
import {useTranslation} from 'react-i18next';
import i18next from 'i18next';

const useStyles = makeStyles((theme) => ({

  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function QuotationDetails(props) {
  const {t} = useTranslation();
  const [quotation, setQuotation] = useState({});
  const [requested_spare_parts, setRequestedSpareParts] = useState([]);
  const [used_spare_parts, setUsedSpareParts] = useState([]);
  // Valores de cotización
  const [spare_parts_amount, setSparepartsAmount] = useState(0.0);

  const [laborAmount, setlaborAmount] = useState(0.0);
  const [viaticAmout, setviaticAmout] = useState(0.0);
  const [subtotalAmount, setsubtotalAmount] = useState(0.0);
  const [ivaAmount, setivaAmount] = useState(0.0);
  const [totalAmount, settotalAmount] = useState(0.0);
  // Comentarios
  const [TMbackground, setTMBackground] = useState("");
  const [FSbackground, setFSBackground] = useState("");
  const [Cbackground, setCBackground] = useState("");

  const [loading, setLoading] = React.useState(false);
  // CustomerProcuctsWarranties
  const [customer_product_warranties, setCustomerpProductWarranties] = useState([]);
  const [visit_customer_products, setVisitCustomerProducts] = useState([]);

  const classes = useStyles();

  // Change viatic Dialog
  const [openViaticDialog, setOpenViaticDialog] = React.useState(false);



  const handleClickOpenViaticDialog = () => {
    setOpenViaticDialog(true);
  };

  const handleCloseViaticDialog = () => {
    setOpenViaticDialog(false);
  };

  useEffect(() => {
    if (props.quotation) {
      props.quotation.viatic_amount > 0 && setviaticAmout(props.quotation.viatic_amount)
      setQuotation(props.quotation)
      props.quotation.visit && setVisitCustomerProducts(props.quotation.visit.visit_customer_products);
      //setRequestedSpareParts(props.quotation.requested_spare_parts)
      //setUsedSpareParts(props.quotation.used_spare_parts)
      //setTMBackground(props.quotation.tm_background)
      //setFSBackground(props.quotation.cs_background)
      //setCBackground(props.quotation.customer_background)
      //setlaborAmount(props.quotation.labor_amount)
      setsubtotalAmount(props.quotation.subtotal_amount)
      setivaAmount(props.quotation.iva_amount)
      settotalAmount(props.quotation.total_amount)

      let customer_product_warranties_t = (props.quotation.visit && props.quotation.visit.customer_products || props.customer_products).map(
        (customer_product) => {
          let quotation_product_t = props.quotation.quotation_customer_products.find(quotation_customer_product => quotation_customer_product.customer_product_id == customer_product.id);
          let visit_customer_product = props.quotation.visit.visit_customer_products.find(visit_customer_product => visit_customer_product.customer_product_id == customer_product.id)

          let quotation_product = (!quotation_product_t && visit_customer_product || quotation_product_t)

          return {
            id: customer_product.id,
            warranty: (quotation_product != undefined && quotation_product.warranty || (customer_product.warranty !== undefined ? (customer_product.warranty == "Si" ? "Si" : "No") : "No")),
            amount: (quotation_product != undefined && (quotation_product.amount && quotation_product.amount || 0) || (0)),
          }
        }
      )
      setCustomerpProductWarranties(customer_product_warranties_t)

      setTotals(customer_product_warranties_t, props.quotation.requested_spare_parts, props.quotation.used_spare_parts);

    }
  }, [props.quotation, viaticAmout]);



  useEffect(() => {
    if (props.quotation) {

      setRequestedSpareParts(props.quotation.requested_spare_parts)
      setUsedSpareParts(props.quotation.used_spare_parts)
      setTMBackground(props.quotation.tm_background)
      setFSBackground(props.quotation.cs_background)
      setCBackground(props.quotation.customer_background)
      setlaborAmount(props.quotation.labor_amount)



    }
  }, [props.quotation]);


  useEffect(() => {
    props.viaticAmout > 0 && viaticAmout == 0.0 && setviaticAmout(props.viaticAmout)
  }, [props.viaticAmout]);

  const spare_part_columns = [
    {
      name: i18next.t('globalTables.sparePartColumns.tnr'),
      selector: 'spare_part.tnr',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.name'),
      selector: 'spare_part.name',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.quantity'),
      selector: 'quantity',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.individualPrice'),
      selector: 'quantity',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(quotation_spare_part_price(row, props.country))}
        </span>
      ),
    },

    {
      name: i18next.t('globalTables.sparePartColumns.totalPrice'),
      selector: 'quantity',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(quotation_spare_part_price(row, props.country, row.quantity))}
        </span>
      ),
    },
    {
      name: i18next.t('globalTables.sparePartColumns.warranty'),
      selector: 'warranty',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.actions'),
      selector: 'id',
      grow: true,
      minWidth: "190px",
      cell: row => (
        <span>
          <EditSparePartDialog key={"EditSparePartDialog" + row.id} quotation_id={row.quotation_id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} quantity={row.quantity} requested_quantity={row.requested_quantity} price={quotation_spare_part_price_no_format(row, props.country)} original_price={product_price_no_format(row.spare_part, props.country)} from={"quotation"} headers={headers} callbacks={handlesave} />
          <DeleteSparePartDialog key={"DeleteSparePartDialog" + row.id} quotation_id={row.quotation_id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} from={"quotation"} headers={headers} callbacks={handlesave} />
        </span>
      ),
    }
  ];



  const used_spare_part_columns = [
    {
      name: i18next.t('globalTables.sparePartColumns.tnr'),
      selector: 'spare_part.tnr',
      sortable: true,
      hide: 'sm',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.name'),
      selector: 'spare_part.name',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.quantity'),
      selector: 'quantity',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.individualPrice'),
      selector: 'quantity',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(quotation_spare_part_price(row, props.country))}
        </span>
      ),
    },


    {
      name: i18next.t('globalTables.sparePartColumns.totalPrice'),
      selector: 'quantity',
      sortable: true,
      hide: 'md',
      cell: row => (
        <span>
          {(quotation_spare_part_price(row, props.country, row.quantity))}
        </span>
      ),
    },
    {
      name: i18next.t('globalTables.sparePartColumns.warranty'),
      selector: 'warranty',
      sortable: true,
      hide: 'md',
    },
    {
      name: i18next.t('globalTables.sparePartColumns.actions'),
      selector: 'id',
      grow: true,
      minWidth: "190px",
      cell: row => (
        <span>
          <EditSparePartDialog key={"EditSparePartDialog" + row.id} quotation_id={row.quotation_id} service_id={row.service_id} service_spare_part_id={row.id} tnr={row.spare_part.tnr} name={row.spare_part.name} quantity={row.quantity} requested_quantity={row.requested_quantity} price={quotation_spare_part_price_no_format(row, props.country)} original_price={product_price_no_format(row.spare_part, props.country)} from={"quotation"} headers={headers} callbacks={props.callbacks} />
        </span>
      ),
    }
  ];


  function handlesave() {
    saveQuotation("save_from_spare_part");
  }

  function saveQuotation(save_type) {
    var body = new FormData();
    props.setLoading(true);
    setLoading(true)
    body.set('id', quotation.id);
    body.set('service_id', props.serviceID);
    body.set('save_type', save_type);
    body.set('tm_background', TMbackground);
    body.set('cs_background', FSbackground);
    body.set('customer_background', Cbackground);

    body.set('spare_parts_amount', spare_parts_amount);
    body.set('labor_amount', laborAmount);
    body.set('viatic_amount', viaticAmout);
    body.set('subtotal_amount', subtotalAmount);
    body.set('iva_amount', ivaAmount);
    body.set('total_amount', totalAmount);
    customer_product_warranties.forEach((customer_product_warranty) => {
      body.append('customer_product_warranties[]', JSON.stringify(customer_product_warranty));
    });

    let emails = props.email
    if (props.email2) {
      emails = emails + `,${props.email}`
    }

    body.set('emails', emails);

    return axios.patch(`/api/v1/quotations/${quotation.id}`, body, {headers: headers_www_form})
      .then(response => {
        flash_alert("", t('services.quotes.flashAlert.quoteUpdateSuccess'), "success");
        props.callbacks()
        props.setLoading(false);
        setLoading(false)
      })
      .catch(e => {
        console.log(e);
        if (e.response.data) {
          props.setLoading(false);
          setLoading(false)
          flash_alert("Error", t('services.quotes.flashAlert.quoteCouldNotBeGenerated'), "danger")

        }
      });
  }


  function setCustomerProductWarrantyFromChild(customer_product_id, warranty, amount) {
    if (customer_product_warranties.length > 0) {
      let customer_product_warrant_changed = 0
      customer_product_warrant_changed = customer_product_warranties.findIndex(customer_product_warranty => customer_product_warranty.id == customer_product_id)
      let new_object = [...customer_product_warranties];
      new_object[customer_product_warrant_changed] && (new_object[customer_product_warrant_changed].amount = parseInt(amount))
      if (warranty != null) {
        new_object[customer_product_warrant_changed] && (new_object[customer_product_warrant_changed].warranty = warranty)
      }
      setCustomerpProductWarranties(new_object)
      setTotals(new_object);
    }

  }

  function setTotals(customer_product_warranties_l, requested_spare_parts_t = null, used_spare_parts_t = null) {
    let laborAmount_l = customer_product_warranties_l.map(item => item.amount).reduce((prev, curr) => prev + curr, 0)
    let viaticAmout_l = viaticAmout
    let spare_parts_amount_t = 0;

    let requested_spare_parts_select = (requested_spare_parts_t ? requested_spare_parts_t : requested_spare_parts)

    requested_spare_parts_select.map((spare_part) => {
      spare_parts_amount_t += quotation_spare_part_price_no_format(spare_part, props.country, spare_part.quantity)
    })

    let subtotalAmount_l = laborAmount_l + viaticAmout + spare_parts_amount_t
    let ivaAmount_l = subtotalAmount_l * props.countryIVA
    let totalAmount_l = subtotalAmount_l * (props.countryIVA + 1)

    setSparepartsAmount(spare_parts_amount_t)
    setlaborAmount(laborAmount_l)
    setviaticAmout(viaticAmout_l)
    setsubtotalAmount(subtotalAmount_l)
    setivaAmount(ivaAmount_l)
    settotalAmount(totalAmount_l)

  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3} class="quotation-product-container">
            {props.customer_products.map((customer_product) => {
              const listId = `list-quotation-products-${quotation.id}-${customer_product.id}`;
              const customer_product_used_spare_parts = used_spare_parts.filter(used_spare_part => (used_spare_part.customer_product_id == customer_product.id && used_spare_part.quotation_id == quotation.id))
              const customer_product_requested_spare_parts = requested_spare_parts.filter(requested_spare_part => (requested_spare_part.customer_product_id == customer_product.id && requested_spare_part.quotation_id == quotation.id))
              return (
                <Grid class="quotation-product-grid" key={listId} item xs={12}>
                  <Grid container spacing={1} direction="row"
                    justify="space-between"
                    alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <span className="quotation-product-name">{customer_product.product.name}</span><br />
                      <span className="quotation-products-ids">
                        TNR: {customer_product.product.tnr} - ID: {customer_product.serial_id}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <QuotationProductWarranty
                        serviceID={props.serviceID}
                        customer_product_warranties={customer_product_warranties}
                        visit_customer_products={visit_customer_products}
                        customer_product={customer_product}
                        quotation={quotation}
                        service_type={props.service_type}
                        country={props.country}
                        zipcode={props.zipcode}
                        administrative_demarcation={props.administrative_demarcation}
                        setCustomerProductWarrantyFromChild={setCustomerProductWarrantyFromChild}
                      />

                    </Grid>
                    <Grid item xs={12}>
                      <p className="quotation-sparepart-subtitle">{t('services.quotes.detailsTab.usedSpareParts')}

                      </p>
                      {
                        customer_product_used_spare_parts &&                         
                          <MaterialTable
                            noHeader={true}
                            columns={used_spare_part_columns}
                            data={customer_product_used_spare_parts}
                            progressComponent={<CircularProgress size={75} />}
                            responsive={true}
                            highlightOnHover={true}
                            striped={true}
                            noDataComponent={i18next.t('globalText.NoDataComponent')}
                            paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                          />
                      }

                    </Grid>
                    <Grid item xs={12} >
                      <p className="quotation-sparepart-subtitle">{t('services.quotes.detailsTab.requestSpareParts')}
                        &nbsp;&nbsp;&nbsp;
                        <AddSparePartDialog
                          key={`AddSparePartDialog-${customer_product.id}`}
                          quotation_id={quotation.id}
                          customer_product_id={customer_product.id}
                          tnr={customer_product.product.tnr}
                          name={customer_product.product.name}
                          from={"quotation"} headers={headers}
                          callbacks={handlesave}
                          status={"requested"}
                          // ADD SPARE PARTS

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
                        />
                      </p>
                      {customer_product_requested_spare_parts && 
                        <MaterialTable
                          noHeader={true}
                          columns={spare_part_columns}
                          data={customer_product_requested_spare_parts}
                          progressComponent={<CircularProgress size={75} />}
                          responsive={true}
                          highlightOnHover={true}
                          striped={true}
                          noDataComponent={i18next.t('globalText.NoDataComponent')}
                          paginationComponentOptions={{rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                        />
                      }
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        <Grid item xs={12} className="visit-price-table-container">
          <p className="service-subtitle mg-bottom-30">{t('services.quotes.detailsTab.visitAmount')}</p>


          <p>
          {t('services.quotes.detailsTab.sparePartsAmount')}<span className="pull-right">{money_format(props.country, spare_parts_amount)}</span>
          </p>


          <p>
          {t('services.quotes.detailsTab.viaticAmount')}
            <span className="pull-right">
              <Button color="primary" className="btn-no-padding" onClick={handleClickOpenViaticDialog}>
                <i className="material-icons">edit</i>
              </Button>
              {money_format(props.country, viaticAmout)}
            </span>
          </p>



          <Dialog open={openViaticDialog} onClose={handleCloseViaticDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{t('services.quotes.detailsTab.editViatics.title')}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t('services.quotes.detailsTab.editViatics.viaticMessage')}
              </DialogContentText>
              <TextField
                fullWidth
                variant="outlined"
                label={t('services.quotes.detailsTab.editViatics.tagLabel')}
                name="viatic_amount"
                value={viaticAmout}
                onChange={(e) => setviaticAmout(Number(e.target.value))}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViaticDialog} color="primary">
              {t('services.quotes.detailsTab.editViatics.okButton')}
              </Button>
            </DialogActions>
          </Dialog>

          <p>
            {t('services.quotes.detailsTab.laborAmount')} <span className="pull-right">{money_format(props.country, laborAmount)}</span>
          </p>

          <hr />
          <p>
            {t('services.quotes.detailsTab.subTotalAmount')}<span className="pull-right">{money_format(props.country, subtotalAmount)}</span>
          </p>

          <p>
            {t('services.quotes.detailsTab.ivaAmount')} <span className="pull-right">{money_format(props.country, ivaAmount)}</span>
          </p>

          <hr />

          <p>
            {t('services.quotes.detailsTab.totalAmount')} <span className="pull-right">{money_format(props.country, Number(totalAmount))}</span>
          </p>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth variant="outlined" multiline rows={8} label={t('services.quotes.detailsTab.tmBackground')} name="background" value={TMbackground} onChange={(e) => setTMBackground(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth variant="outlined" multiline rows={8} label={t('services.quotes.detailsTab.fsBackground')} name="background" value={FSbackground} onChange={(e) => setFSBackground(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth variant="outlined" multiline rows={8} label={t('services.quotes.detailsTab.cBackground')} name="background" value={Cbackground} onChange={(e) => setCBackground(e.target.value)} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>

          <Button onClick={() => saveQuotation("save")} className="quotation-link mg-r-15" id="save-quotation-btn" variant="outlined" color="primary">
            {is_CS(props.current_user) ? t('services.quotes.detailsTab.saveButton') : "Guardar Observaciones"}
          </Button>
          {
            is_CS(props.current_user) &&
            <Button id="send-quotation" disabled={loading} variant="contained" color="primary" onClick={() => saveQuotation("save_and_send")}>
                {t('services.quotes.detailsTab.saveAndSendButton')}
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
          }
        </Grid>

      </Grid>
    </React.Fragment>
  );

}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(QuotationDetails)

