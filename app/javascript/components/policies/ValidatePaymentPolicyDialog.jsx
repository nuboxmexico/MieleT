import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import { flash_alert } from 'components/App';
import { DropzoneArea } from 'material-ui-dropzone';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
//List
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {csrf, headers, headers_www_form, money_format, date_event_format, date_difference_in_hours, api_token, site_url, date_format_without_time} from "constants/csrf"
import { FileIcon, defaultStyles } from 'react-file-icon';
import mime from "mime-to-extensions";

const DELETE_POLICY = "DELETE_POLICY";
const DELETED_POLICY = "DELETED_POLICY";

function validatePayment(customer_id, policy_id, headers) {
    
    return (dispatch) => {
    	dispatch({type: DELETE_POLICY});
        return axios.delete(`/api/v1/customers/${customer_id}/policies/${policy_id}`, { headers: headers})
	  	.then(response => {
            let element = document.getElementById(`accordeon-policy-${policy_id}`);
            element.parentNode.removeChild(element);
	  		flash_alert("Eliminado!", "Póliza se ha eliminado correctamente", "success")
            dispatch({type: DELETED_POLICY, response});
	  	})
	    .catch(e => {
	    	flash_alert("Error!", "No se ha podido eliminar la póliza", "danger")
	        console.log(e);
		});
	};
};


function ValidatePaymentPolicyDialog(props){
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [paymentFiles, setPaymentFiles] = useState(props.policy.payment_resources);
    // Delete image dialog
    const [openDeleteImageDialog, setOpenDeleteImageDialog] = React.useState(false);
    const [currentDeleteImage, setCurrentDeleteImage] = React.useState("");
 
    const useStyles = makeStyles(theme => createStyles({
		previewChip: {
		minWidth: 160,
		maxWidth: 210
        },
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
	
    const classes = useStyles();
    

	function handleClickOpen(e){
		e.preventDefault();
		setOpen(true);
	}

	function handleClose(e){
		e.preventDefault();
		setOpen(false);
	}

	async function handleValidate(e){
		e.preventDefault();
		
        var body = new FormData();
        body.set('policy_id', props.policy_id);
        console.log(files)
        files.forEach((file) => {
            body.append('payment_files[]', JSON.stringify(file));
        });

        return axios.post(`/api/v1/customers/${props.customer_id}/policies/${props.policy_id}/validate_payment`, body, { headers: headers_www_form})
            .then(response => {
                console.log(response)
                setOpen(false);
                setFiles([]); 
                if(response.data.payment_resources.length > 0){
                    setPaymentFiles(response.data.payment_resources)
                    let newpolicy_array = props.policies
                    let newpolicy = newpolicy_array.findIndex((el) => el.id === response.data.id);
                    newpolicy_array[newpolicy] = response.data;
                    props.setPolicies(newpolicy_array)
                    flash_alert("", "Pago validado satisfactoriamente" , "success")
                }else{
                    flash_alert("Error", "No se han podido cargar los archivos.", "danger")
                }
            })
        .catch(e => {
            setOpen(false);
            if(e.response.data){
                console.log(e.response.data);
                for (var key in e.response.data) {
                    flash_alert("Error", e.response.data[key], "danger")
                }
            }
        });
	}

    async function onServiceChangeFiles(e){
        if(e.length > 0){
            const dT = [];
            e.forEach(async function(item){
                
                await getBase64(item)
                    .then((encFile) => {
                        dT.push(encFile)
                        setFiles(dT)
                    }).catch(error => console.log("error"));
           
            });
            
        }
    };
    
    function getBase64(file){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({
                uri_64: reader.result,
                name: file.name,
                mime: file.type,
            });
            reader.onerror = error => reject(error);
      });
    }

       
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
                let payment_files_t = paymentFiles.filter(file => String(file.id) != String(currentDeleteImage));
                setPaymentFiles(payment_files_t);
                
                flash_alert("Eliminado!", "El archivo ha sido eliminado correctamente", "success")
            })
            .catch(e => {
                console.log(e)
                flash_alert("Error!", "No se ha podido eliminar el archivo", "danger")

            });
    };
     
    function handleMessage(message,type){
        if(type == "error"){
            flash_alert("", "El archivo supera los 10 MB de límite o no cumple con el formato esperado" , "error")
       }
    } 
	return (
		<React.Fragment>
		  <Link href="#" id={"tcustomers_products_"+props.customer_id} className="mdl-navigation__link brand-primary-link customers-pay-policy-link" onClick={handleClickOpen}><i className="material-icons">money</i> Validar pago</Link>
		  <Dialog
		    open={open}
		    onClose={handleClose}
            fullWidth={true}
        	maxWidth={"lg"}
		    aria-labelledby="alert-dialog-title"
		    aria-describedby="alert-dialog-description"
		  >
		    <DialogTitle id="alert-dialog-title" className="policy-validate-payment-title">Validar pago</DialogTitle>
		    <DialogContent>
		      <DialogContentText id="alert-dialog-description">
		        Póliza N° {props.customer_id}-{props.policy_id}?
		      </DialogContentText>

              <Grid item xs={12} className="service-price-table-container">
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} >
                                    <p className="service-subtitle">Respaldos</p>
                                    <Grid item xs={12}>
                                        <DropzoneArea
                                            name={"services_files"}
                                            dropzoneText={"Arrastre su archivo aqui, o haga click para seleccionarlo"}
                                            onChange={onServiceChangeFiles}
                                            showPreviews={true}
                                            showPreviewsInDropzone={false}
                                            useChipsForPreview
                                            previewGridProps={{container: { spacing: 1, direction: 'row' }}}
                                            previewChipProps={{classes: { root: classes.previewChip } }}
                                            previewText="Archivos seleccionados"
                                            filesLimit={10}
                                            showAlerts={false}
                                            maxFileSize={10000000}
                                            alertSnackbarProps={{anchorOrigin: { vertical: 'top', horizontal: 'right' }}}
                                            onAlert={handleMessage}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <p className="service-subtitle">Archivos subidos</p>
                                    <List dense>
                                        {paymentFiles && paymentFiles.map((policiyFile) => {
                                            return (
                                                <ListItem key={"policiyFile"+policiyFile.id} button>
                                                    <ListItemAvatar className="service-payment-icon">
                                                        <FileIcon
                                                                size={2}
                                                                extension={mime.extension(policiyFile.mime)}
                                                                {...defaultStyles[mime.extension(policiyFile.mime)]}
                                                            />  
                                                    </ListItemAvatar>
                                                    <a className="new-service-link" href={policiyFile.resource_url} target="_blank">
                                                        <Button size="small" color="primary">
                                                            {policiyFile.name}
                                                        </Button>
                                                    </a>
                                                    <ListItemSecondaryAction>
                                                        <Button size="small" color="primary" onClick={() => handleClickOpenImageDialog(policiyFile.id)}>
                                                            <i className="material-icons">delete</i>
                                                        </Button>
                                                    </ListItemSecondaryAction>
                                                </ListItem>            
                                            );
                                        })}
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>

		    </DialogContent>
		    <DialogActions>
		      <Button onClick={handleClose} variant="outlined" color="primary">
		        Cerrar
		      </Button>
		      <Button onClick={handleValidate} variant="contained" color="primary" autoFocus>
                Validar pago
		      </Button>
		    </DialogActions>
		  </Dialog>

          <Dialog open={openDeleteImageDialog} onClose={handleCloseImageDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Eliminar archivo</DialogTitle>
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
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
  customers: state => state.customers
});
const mapDispatchToProps = {validatePayment};

export default connect(structuredSelector, mapDispatchToProps)(ValidatePaymentPolicyDialog)
