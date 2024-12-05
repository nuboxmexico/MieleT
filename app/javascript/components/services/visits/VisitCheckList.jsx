
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";
import { flash_alert } from 'components/App';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'

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

//translation
import { useTranslation } from 'react-i18next';



import { SRLWrapper } from "simple-react-lightbox";

import {csrf, headers, money_format, date_event_format, date_difference_in_hours, api_token, site_url, payment_channel_label} from "constants/csrf"

const useStyles = makeStyles((theme) => ({

    buttonProgress: {
        position: 'relative',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
  }));
  


function VisitCheckList(props){
    const {t} = useTranslation();
    const classes = useStyles();
    const [checked, setChecked] = useState((props.visit.customer_products.length > 0 && props.visit.customer_products[0].id || ""));
    const [selectedCustomerProduct, setSelectedCustomerProduct] = useState((props.visit.customer_products && props.visit.customer_products[0] || {}));
    
    const [checklists, setChecklists] = useState([])
    const [images, setImages] = useState([])
    function handleToggle(customer_product){
        setChecked(customer_product.id)
        setSelectedCustomerProduct(customer_product)
    }


    useEffect(() => {
        console.log(selectedCustomerProduct)
        setChecklists(selectedCustomerProduct.customer_product_checklists)
        getProductImages(selectedCustomerProduct)
    }, [selectedCustomerProduct]);

    
    function getProductImages(customer_product){
        var url = `/api/v1/file_resources/${customer_product.id}/checklist_product_images`
        fetch(url).then((response) => response.json())
        .then((json) => {
            if(json.data)
            {
                setImages(json.data)
            }
            setIsLoading(false)
        })
        .catch((error) => console.error(error) && setIsLoading(false));
      }
    
    
	return (
		<React.Fragment>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <p className="service-subtitle">{t('services.visits.visit.checkList.title')}</p>
                        </Grid>
                    </Grid>  


                    <List>
                    {props.visit.customer_products && props.visit.customer_products.map((customer_product) => {
                    const listId = `list-visit-products-${props.visit.id}-${customer_product.id}`;
                    const labelId = `visit-products-${props.visit.id}-${customer_product.id}`;

                    return (
                    <ListItem key={listId} role={undefined} dense button onClick={() => handleToggle(customer_product)}>
                        <ListItemIcon className="service-address-label">
                        <FormControlLabel value={customer_product.id} control={<Radio color="primary"/>} label="" checked={checked == customer_product.id}
                            tabIndex={-1}
                        />
                        </ListItemIcon>
                        <ListItemText 
                            id={labelId}
                            secondary={
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={4}>
                                        <span className="visit-summary-1">{t('visits.checkList.name')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.product.name}</span>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <span className="visit-summary-1">{t('services.visits.visit.checkList.tnr')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.product.tnr}</span>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <span className="visit-summary-1">{t('services.visits.visit.checkList.id')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.serial_id}</span>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <span className="visit-summary-1">{t('services.visits.visit.checkList.status')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.status}</span>
                                    </Grid>
                                </Grid>
                            } 
                        />
                        
                    
                        <ListItemSecondaryAction>
                        
                        </ListItemSecondaryAction>
                    </ListItem>
                    );
                })}
                
                </List>
                <Grid className={"mg-t-15"} container spacing={1}>
                    <Grid item xs={12}>
                        <p className="service-subtitle">{t('services.visits.visit.checkList.questionnaire')}</p>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                        {checklists &&
                            checklists.length > 0 &&
                                checklists.map((checklist,index) => {
                                const listId = `checklist-${checklist.id}`;

                                return (
                                    <Grid key={listId} item xs={12} sm={6} className="checklist-block">
                                        <span className="checklist-question">{index+1}. {checklist.checklist.question}</span><br/>
                                        <span className="checklist-answer">{checklist.answer}</span>
                                        <span className="checklist-additionals">{t('services.visits.visit.checkList.coments')}</span><br/>
                                        <span className="checklist-background">{checklist.background}</span>
                                    </Grid>
                                );
                                })
                            ||
                            <Grid item xs={12}>
                                <span className="visit-summary-2">{t('services.visits.visit.checkList.noCheckList')}</span>
                            </Grid>
                        }
                        </Grid>
                    </Grid>
                    <Grid item  xs={12} className={"mg-t-15"}>
                        <p className="service-subtitle">{t('services.visits.visit.checkList.images')}</p>
                    </Grid>
                    <Grid item xs={12}>
                        <SRLWrapper>
                        <Grid container spacing={1}>
                        {images &&
                            images.length > 0 &&
                                images.map((image,index) => {
                                const listId = `checklist-${image.id}`;

                                return (
                                    <Grid key={listId} item xs={6} sm={2}>
                                        <Card>
                                            <CardActionArea>
                                                <a href={image.resource_url} className="mdl-navigation__link file-image-link">
                                                    <Image
                                                        src={image.resource_url}
                                                        className="file-image"
                                                        srl_gallery_image="true" 
                                                    />
                                                </a>
                                            </CardActionArea>
                                            {
                                            <CardActions>
                                                    <a target="_blank" href={image.resource_url} className="mdl-navigation__link brand-link" >{image.description}</a>
                                            </CardActions>
                                            
                                            }
                                        </Card>
                                    </Grid>
                                );
                                })
                            ||
                            <Grid item xs={12}>
                                <span className="visit-summary-2">{t('services.visits.visit.checkList.noImages')}</span>
                            </Grid>
                        }
                        </Grid>
                        </SRLWrapper>
                    </Grid>
                </Grid>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(VisitCheckList)

