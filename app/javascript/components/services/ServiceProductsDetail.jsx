import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CustomerProductsTable from 'components/tables/CustomerProductsTable';
import { flash_alert } from 'components/App';


import CircularProgress from '@material-ui/core/CircularProgress';
//Accordeon 
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MaterialTable from 'react-data-table-component';
// Card
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Image from 'material-ui-image'
import {useTranslation} from "react-i18next"

import { SRLWrapper } from "simple-react-lightbox";
function ServiceProductsDetail(props){
    const { t } = useTranslation('translation', { keyPrefix: 'services.productDetails' });

	return (
		<React.Fragment>

            <Accordion defaultExpanded>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="paneladditional-header"
                >
                
                <h1 className="panel-custom-title">{t('title')}</h1>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                      <CustomerProductsTable customerProducts={props.selectedProductRows} loading={props.productLoadingCP}/>
                        <Grid item xs={12}>
                            <p className="service-p">{t('historyProblem')}</p>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <p className="service-background">
                                {props.background == "" ? t('noDetails'): props.background}
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <SRLWrapper>
                            <Grid container spacing={2}>
                                {props.serviceFiles && props.serviceFiles.map((serviceFile) => {
                                    const labelId = `file-list-label-${serviceFile.id}`;
                                    return (
                                        <Grid item xs={6} sm={3}>
                                            <Card>
                                                <CardActionArea>
                                                        <a href={serviceFile.resource_url} className="mdl-navigation__link file-image-link">
                                                            <Image
                                                                src={serviceFile.resource_url}
                                                                className="file-image"
                                                                srl_gallery_image="true" 
                                                            />
                                                        </a>
                                                </CardActionArea>
                                                <CardActions>
                                                    <Button size="small" color="primary" onClick={() => props.handleClickOpenImageDialog(serviceFile.id)}>
                                                    {t('delete')}
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            <Dialog open={props.openDeleteImageDialog} onClose={props.handleCloseImageDialog} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">{t('deleteImage')}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {t('confirm.confirmDelete')}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={props.handleCloseImageDialog} color="primary">
                                        {t('confirm.no')}
                                    </Button>
                                    <Button onClick={props.handleDeleteImage} color="primary">
                                        {t('confirm.yes')}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            
                            </Grid>

                            </SRLWrapper>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(ServiceProductsDetail)
