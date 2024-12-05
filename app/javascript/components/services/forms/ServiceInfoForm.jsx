import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Checkbox from '@material-ui/core/Checkbox'

import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { flash_alert } from 'components/App'
import MaterialTable from 'react-data-table-component'
import Paper from '@material-ui/core/Paper'
// Card
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import PoliciesList from 'components/policies/PoliciesList'
import { DropzoneArea } from 'material-ui-dropzone'

// Dialog
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
// Image
import Image from 'material-ui-image'

import { SRLWrapper } from 'simple-react-lightbox'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { channelLabels, serviceTypeLabels } from 'constants/services'


function ServiceInfoForm (props) {
  const serviceTypes = serviceTypeLabels(i18next.language)
  const { t } = useTranslation()
  /// ////////////////////////////////////////////////////////////////////
  // Delete image dialog
  const { costCenters, setSelectedCostCenterId, selectedCostCenterId } = props
  const [openDeleteImageDialog, setOpenDeleteImageDialog] = React.useState(false)
  const [currentDeleteImage, setCurrentDeleteImage] = React.useState('')

  const handleClickOpenImageDialog = (image_id) => {
    setCurrentDeleteImage(image_id)
    setOpenDeleteImageDialog(true)
  }

  const handleCloseImageDialog = () => {
    setOpenDeleteImageDialog(false)
  }

  const handleCostCenterChange = (event) => {
    setSelectedCostCenterId(event.target.value)
  }

  const handleDeleteImage = () => {
    setOpenDeleteImageDialog(false)
    return axios.delete(`/api/v1/file_resources/${currentDeleteImage}`, { headers })
      .then(response => {
        const files_t = props.serviceFiles.filter(file => String(file.id) != String(currentDeleteImage))
        props.setServiceFiles(files_t)
        flash_alert('Eliminado!', 'El archivo ha sido eliminado correctamente', 'success')
      })
      .catch(e => {
        flash_alert('Error!', 'No se ha podido eliminar el archivo', 'danger')
      })
  }

  return (
    <>
      <Paper className='custom-paper'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h1 className='panel-custom-title'>{t('customer.newService.serviceRequestInfo.title')}</h1>
            <p className='service-p'>{t('customer.newService.serviceRequestInfo.subTitle')}</p>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl variant='outlined' className='MuiFormControl-fullWidth' error={props.service_typeErrorMessage != ''}>
              <InputLabel id='service_type-simple-select-outlined-label'>{t('customer.newService.serviceRequestInfo.serviceType')}</InputLabel>
              <Select
                labelId='service_type-simple-select-outlined-label'
                id='service_type-simple-select-outlined'
                value={props.service_type}
                onChange={(e) => props.handleServiceTypeChange(e.target.value)}
                label={t('customer.newService.serviceRequestInfo.serviceType')}
                name='service_type'
              >
                {Object.keys(serviceTypes).map((key) => (
                  <MenuItem key={'service_type-' + serviceTypes[key].key} value={serviceTypes[key].key}>{serviceTypes[key].label}</MenuItem>
                ))}
              </Select>
              <FormHelperText className='brand-error-message'>{props.service_typeErrorMessage}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl variant='outlined' className='MuiFormControl-fullWidth' error={props.subcategoryErrorMessage != ''}>
              <InputLabel id='subcategory-simple-select-outlined-label'>{t('customer.newService.serviceRequestInfo.subCategory')}</InputLabel>
              <Select
                labelId='subcategory-simple-select-outlined-label'
                id='subcategory-simple-select-outlined'
                value={props.subcategory}
                onChange={(e) => props.setSubcategory(e.target.value)}
                label={t('customer.newService.serviceRequestInfo.serviceType')}
                name='subcategory'
              >
                {props.subcategoryOptions.map((subcategory) => (
                  <MenuItem key={'subcategory-' + subcategory.key} value={subcategory.key}>{subcategory.label}</MenuItem>
                ))}
              </Select>
              <FormHelperText className='brand-error-message'>{props.subcategoryErrorMessage}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant='outlined' className='MuiFormControl-fullWidth' error={props.requestedErrorMessage != ''}>
                  <InputLabel id='requested-simple-select-outlined-label'>{t('customer.newService.serviceRequestInfo.request')}</InputLabel>
                  <Select
                    labelId='requested-simple-select-outlined-label'
                    id='requested-simple-select-outlined'
                    value={props.requested}
                    onChange={(e) => props.handleRequestedChange(e)}
                    label={t('customer.newService.serviceRequestInfo.request')}
                    name='requested'
                  >
                    {props.requestedBy.map((value) => (
                      <MenuItem key={'requested-' + value.key} value={value.key}>{value.label}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText className='brand-error-message'>{props.requestedErrorMessage}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl variant='outlined' className='MuiFormControl-fullWidth' error={props.requestChannelErrorMessage != ''}>
              <InputLabel id='requestChannel-simple-select-outlined-label'>{t('customer.newService.serviceRequestInfo.requestChannel')}</InputLabel>
              <Select
                labelId='requestChannel-simple-select-outlined-label'
                id='requestChannel-simple-select-outlined'
                value={props.requestChannel}
                onChange={(e) => props.setRequestChannel(e.target.value)}
                label={t('customer.newService.serviceRequestInfo.requestChannel')}
                name='requestChannel'
              >
                {channelLabels(i18next.language).map((value) => (
                  <MenuItem key={'requestChannel-' + value.key} value={value.key}>{value.label}</MenuItem>
                ))}
              </Select>
              <FormHelperText className='brand-error-message'>{props.requestChannelErrorMessage}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <FormControl variant='outlined' className='MuiFormControl-fullWidth'>
              <InputLabel id='cost-center-label'>{t('customer.newService.serviceRequestInfo.costCenter')}</InputLabel>
              <Select
                value={selectedCostCenterId || ''}
                id='cost-center'
                labelId='cost-center-label'
                onChange={handleCostCenterChange}
                label={t('customer.newService.serviceRequestInfo.costCenter')}
              >
                {costCenters.map((costCenter) => (
                  <MenuItem key={costCenter.id} value={costCenter.id}>{costCenter.fullname}</MenuItem>
                ))}
              </Select>
              <FormHelperText className='brand-error-message'>{props.requestChannelErrorMessage}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3} className={props.distributorCheck}>
            <TextField fullWidth variant='outlined' label={t('customer.newService.serviceRequestInfo.distributorName')} name='distributorName' value={props.distributorName} onChange={(e) => props.setDistributorName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={3} className={props.distributorCheck}>
            <TextField fullWidth variant='outlined' type='email' label={t('customer.newService.serviceRequestInfo.distributorEmail')} name='distributorEmail' value={props.distributorEmail} onChange={(e) => props.setDistributorEmail(e.target.value)} />
          </Grid>
        </Grid>
      </Paper>

      <br />
      <Paper className='custom-paper'>
        {props.service_type == 'Póliza de Mantenimiento' &&
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PoliciesList
                policies={props.policies}
                country={props.country}
                handlePolicyRowChange={props.handlePolicyRowChange}
                selectedPolicies={props.selectedPolicies}
              />
            </Grid>
          </Grid>}
        {props.service_type != 'Póliza de Mantenimiento' &&
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1 className='panel-custom-title'>{t('customer.newService.productSelection.title')}</h1>
              {
                props.selectedProductRows.length > 0 && props.service_type == 'Reparaciones en Taller' &&
                  <Button size='small' color='primary' onClick={() => props.handleProductDisabledSelected()}>
                    {t('customer.newService.productSelection.removeButton')}
                  </Button>
              }
              {props.products.length > 0 && <MaterialTable
                className='customer-products-table'
                title=''
                columns={props.product_columns}
                data={props.products}
                responsive
                onSelectedRowsChange={props.handleProductRowChange}
                highlightOnHover
                striped
                noDataComponent={i18next.t('globalText.NoDataComponent')}
                paginationComponentOptions={{ rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                selectableRows
                selectableRowsComponent={Checkbox}
                selectableRowsNoSelectAll={props.service_type == 'Reparaciones en Taller'}
                selectableRowSelected={row => (props.selectedProductRows.find(product => product.id === row.id) != undefined)}
                selectableRowDisabled={row => (row.status == 'Servicio completado' && props.submit_type == 'new_visit')}
                selectableRowsComponentProps={{ color: 'primary' }}
                contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                clearSelectedRows={props.toggledClearProductsRows}
                disabled={props.productTableDisabled}
                                            />}
            </Grid>
            {(props.consumables.length > 0 && props.service_type == 'Mantenimiento') &&
              <Grid item xs={12}>
                <h1 className='panel-custom-title'>{t('customer.newService.productSelection.requiredConsumables')}</h1>
                <MaterialTable
                  className='customer-products-table'
                  title=''
                  columns={props.consumable_columns}
                  data={props.consumables}
                  responsive
                  onSelectedRowsChange={props.handleConsumableRowChange}
                  highlightOnHover
                  striped
                  noDataComponent={i18next.t('globalText.NoDataComponent')}
                  paginationComponentOptions={{ rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                  selectableRows
                  selectableRowsComponent={Checkbox}
                  selectableRowSelected={row => (props.consumableSelectableRowCriteria(row))}
                  selectableRowsComponentProps={{ color: 'primary' }}
                  contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                />
              </Grid>}

            {(props.requested_spare_parts && props.requested_spare_parts.length > 0 && props.submit_type == 'new_visit') &&
              <Grid item xs={12}>
                <h1 className='panel-custom-title'>{t('customer.newService.productSelection.spareParts')}</h1>
                <MaterialTable
                  className='customer-products-table'
                  noHeader
                  columns={props.spare_part_columns}
                  data={props.requested_spare_parts}
                  progressPending={props.userLoading}
                  progressComponent={<CircularProgress size={75} />}
                  responsive
                  highlightOnHover
                  striped
                  noDataComponent={i18next.t('globalText.NoDataComponent')}
                  paginationComponentOptions={{ rowsPerPageText: i18next.t('globalText.rowsPerPageText'), rangeSeparatorText: i18next.t('globalText.rangeSeparatorText'), noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: i18next.t('globalText.selectAllRowsItemText') }}
                  contextMessage={{ singular: 'producto', plural: 'productos', message: 'seleccionados' }}
                />
              </Grid>}
            <Grid item xs={12}>
              <p className='service-p'>{t('customer.newService.productSelection.backgroundTitle')}</p>
            </Grid>
          </Grid>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth variant='outlined' multiline rows={8} label={t('customer.newService.productSelection.background')} name='background' value={props.background} onChange={(e) => props.setBackground(e.target.value)} error={props.backgroundErrorMessage != ''} helperText={
              props.backgroundErrorMessage
            }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DropzoneArea
                  name='services_files'
                  dropzoneText={t('customer.newService.productSelection.dragFile')}
                  onChange={props.onServiceChangeFiles}
                  showPreviews
                  showPreviewsInDropzone={false}
                  useChipsForPreview
                  previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                  previewChipProps={{ classes: { root: props.classes.previewChip } }}
                  previewText={t('customer.newService.productSelection.selectedFiles')}
                  filesLimit={10}
                  showAlerts={false}
                  maxFileSize={10000000}
                  alertSnackbarProps={{ anchorOrigin: { vertical: 'top', horizontal: 'right' } }}
                  onAlert={props.handleMessage}
                />
              </Grid>
              <SRLWrapper>
                <Grid container spacing={1}>

                  {props.serviceFiles.map((serviceFile) => {
                    const labelId = `file-list-label-${serviceFile.id}`
                    return (
                      <Grid key={labelId} item xs={6} sm={3}>
                        <Card>
                          <CardActionArea>
                            <a href={serviceFile.resource_url} className='mdl-navigation__link file-image-link'>
                              <Image
                                src={serviceFile.resource_url}
                                className='file-image'
                                srl_gallery_image='true'
                              />
                            </a>
                          </CardActionArea>
                          <CardActions>
                            <Button size='small' color='primary' onClick={() => handleClickOpenImageDialog(serviceFile.id)}>
                              {t('globalText.deleteButton')}
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              </SRLWrapper>
              <Dialog open={openDeleteImageDialog} onClose={handleCloseImageDialog} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{t('customer.newService.productSelection.deleteImage')}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {t('customer.newService.productSelection.confirmMessage')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseImageDialog} color='primary'>
                    {t('customer.newService.productSelection.no')}
                  </Button>
                  <Button onClick={handleDeleteImage} color='primary'>
                    {t('customer.newService.productSelection.yes')}
                  </Button>
                </DialogActions>
              </Dialog>

            </Grid>
          </Grid>
        </Grid>
      </Paper>

    </>
  )
}

const structuredSelector = createStructuredSelector({
})
const mapDispatchToProps = {}

export default connect(structuredSelector, mapDispatchToProps)(ServiceInfoForm)
