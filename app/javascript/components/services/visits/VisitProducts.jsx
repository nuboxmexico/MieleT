import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import CustomerProductEan from "components/customers/common/CustomerProductEan";
import Radio from '@material-ui/core/Radio';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import {csrf, headers,money_format, date_format_without_time, date_format_without_time_and_zone} from "constants/csrf"
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
import Button from '@material-ui/core/Button';
import {useTranslation} from "react-i18next"

import { SRLWrapper } from "simple-react-lightbox";


function VisitProducts(props){
    const { t } = useTranslation('translation', { keyPrefix: 'services.visits' });
    const [checked, setChecked] = useState((props.visit.customer_products.length > 0 && props.visit.customer_products[0].id || ""));
    const [selectedCustomerProduct, setSelectedCustomerProduct] = useState((props.visit.customer_products && props.visit.customer_products[0] || {}));
    const [selectedVisitCustomerProduct, setSelectedVisitCustomerProduct] = useState((props.visit.visit_customer_products && props.visit.visit_customer_products[0] || {}));
    const [images, setImages] = useState([]);
    

     // Delete image dialog
     const [openDeleteImageDialog, setOpenDeleteImageDialog] = React.useState(false);
     const [currentDeleteImage, setCurrentDeleteImage] = React.useState("");
     
     const handleClickOpenImageDialog = (image_id) => {
        setCurrentDeleteImage(image_id)
        setOpenDeleteImageDialog(true);
     };
 
     const handleCloseImageDialog = () => {
         setOpenDeleteImageDialog(false);
     };

    const handleDeleteImage = () => {
        setOpenDeleteImageDialog(false);
        return axios.delete(`/api/v1/file_resources/${currentDeleteImage}`, { headers: headers})
	  	.then(response => {
            
            let files_t = images.filter(file => String(file.id) != String(currentDeleteImage));
            setImages(files_t)
            flash_alert("Eliminado!", "El archivo ha sido eliminado correctamente", "success")
	  	})
	    .catch(e => {
	    	flash_alert("Error!", "No se ha podido eliminar el archivo", "danger")

		});
    };



    function handleToggle(customer_product, visit_customer_product){
        setChecked(customer_product.id)
        setSelectedCustomerProduct(customer_product)
        setSelectedVisitCustomerProduct(visit_customer_product)
        visit_customer_product && getProductImages(visit_customer_product)
    }

    function getProductImages(visit_customer_product){
        var url = `/api/v1/file_resources/${visit_customer_product.id}/visit_customer_products`
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
            <List>
                {props.visit.customer_products && props.visit.customer_products.map((customer_product) => {
                    const listId = `list-visit-products-${props.visit.id}-${customer_product.id}`;
                    const labelId = `visit-products-${props.visit.id}-${customer_product.id}`;
                    const visit_customer_product = props.visit.visit_customer_products.find(visit_customer_product => visit_customer_product.customer_product_id ==  customer_product.id)
                    return (
                    <ListItem key={listId} role={undefined} dense button onClick={() => handleToggle(customer_product, visit_customer_product)}>
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
                                        <span className="visit-summary-1">{t('productTableInfo.name')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.product.name}</span>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <span className="visit-summary-1">{t('productTableInfo.tnr')}</span><br/>
                                        <span className="visit-summary-2">{customer_product.product.tnr}</span>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <span className="visit-summary-1">{t('productTableInfo.id')}</span><br/>
                                        <CustomerProductEan key={customer_product.serial_id} serial_id={customer_product.serial_id} b2b_ean={customer_product.b2b_ean}/>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <span className="visit-summary-1">{t('productTableInfo.status')}</span><br/>
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
                <Grid style={{marginTop: "15px"}} container spacing={1}>
                    <Grid item xs={12} sm={4}>
                        <span className="visit-summary-1">{t('expertOpinion')}</span><br/>
                        {selectedVisitCustomerProduct && 
                            <span className="visit-summary-2">{(selectedVisitCustomerProduct.expert_opinion != "" && selectedVisitCustomerProduct.expert_opinion != null) ? selectedVisitCustomerProduct.expert_opinion : t('noInfo')}</span>
                        ||
                            <span className="visit-summary-2">{(selectedCustomerProduct.expert_opinion != "" && selectedCustomerProduct.expert_opinion != null) ? selectedCustomerProduct.expert_opinion : t('noInfo')}</span>
                        }
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <span className="visit-summary-1">{t('activityPerformed')}</span><br/>
                        {selectedVisitCustomerProduct && 
                            <span className="visit-summary-2">{(selectedVisitCustomerProduct.activity_performed != "" && selectedVisitCustomerProduct.activity_performed != null) ? selectedVisitCustomerProduct.activity_performed : t('noInfo')}</span>
                        ||
                            <span className="visit-summary-2">{(selectedCustomerProduct.activity_performed != "" && selectedCustomerProduct.activity_performed != null) ? selectedCustomerProduct.activity_performed : t('noInfo')}</span>
                        }
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <span className="visit-summary-1">{t('technicalDiagnosis')}</span><br/>
                        {selectedVisitCustomerProduct && 
                            <span className="visit-summary-2">{(selectedVisitCustomerProduct.technical_diagnosis != "" && selectedVisitCustomerProduct.technical_diagnosis != null) ? selectedVisitCustomerProduct.technical_diagnosis : t('noInfo')}</span>
                        ||
                            <span className="visit-summary-2">{(selectedCustomerProduct.technical_diagnosis != "" && selectedCustomerProduct.technical_diagnosis != null) ? selectedCustomerProduct.technical_diagnosis : t('noInfo')}</span>
                        }
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <span className="visit-summary-1">{t('warranty')}</span><br/>
                        {selectedVisitCustomerProduct && 
                            <span className="visit-summary-2">{(selectedVisitCustomerProduct.warranty != "" && selectedVisitCustomerProduct.warranty != null) ? selectedVisitCustomerProduct.warranty : t('noInfo')}</span>
                        ||
                            <span className="visit-summary-2">{(selectedCustomerProduct.warranty != "" && selectedCustomerProduct.warranty != null) ? selectedCustomerProduct.warranty : t('noInfo')}</span>
                        }
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <span className="visit-summary-1">{t('instalationDate')}</span><br/>
                        <span className="visit-summary-2">
                            {(selectedCustomerProduct.instalation_date == null ? "No" : date_format_without_time_and_zone(selectedCustomerProduct.instalation_date))}
                            {selectedCustomerProduct.reinstalation_date != null  &&
                                <>
                                    <br/><br/>
                                    {(selectedCustomerProduct.reinstalation_date == null ? "" : date_format_without_time_and_zone(selectedCustomerProduct.reinstalation_date) + t('reinstaled') )}
                                </>
                            }
                        </span>
                    </Grid>
                </Grid>
                <SRLWrapper>
                <Grid container spacing={2}>
                    {images.length > 0 &&
                        <Grid item xs={12}>
                            <p className="service-p">Archivos cargados</p>
                        </Grid>
                    }
                    {images && images.map((image) => {
                        const labelId = `file-list-label-${image.id}`;
                        return (
                            <Grid key={labelId} item xs={6} sm={2}>
                                <Card>
                                    <CardActionArea>
                                            <a href={image.resource_url}>
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
                    })}
                  
                <Dialog open={openDeleteImageDialog} onClose={handleCloseImageDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Eliminar foto</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            ¿Esta seguro que desea eliminar este archivo?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseImageDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={handleDeleteImage} color="primary">
                            Si
                        </Button>
                    </DialogActions>
                </Dialog>
                </Grid>
                </SRLWrapper>
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(VisitProducts)

