import React from 'react';
import {flash_alert} from 'components/App';
import axios from 'axios';
import {headers} from '../../constants/csrf';
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  Box
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function ModalConfirmation({selectedVisits, showModal, setShowModal}) {
  const {t} = useTranslation();
  function handleClose(e) {
    e.preventDefault();
    setShowModal(false)
  }
  const visitIds = Object.values(selectedVisits).map(visits => {
    return visits.map(visit => visit.id)
  }).flat()

  function updateMassiveVisits() {
    const body = {visit_ids: visitIds}

    return axios.post(`/api/v1/visits/invoiced_visits`, body, {headers: headers})
      .then(response => {
        flash_alert(t('customer.newService.flashAlert.success'), t('customer.newService.flashAlert.updateSuccess'), "success")
        setShowModal(false)
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      })
      .catch(e => {
        console.log(e);
      });
  }

  return (
    <React.Fragment>
      <Box p={2}>
        <Dialog
          open={showModal}
          fullWidth={true}
          maxWidth={"sm"}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box style={{textAlign: 'center'}}>
            <DialogTitle className="payment-dialog-title" id="alert-dialog-title">
              {`${t('finance.confirmModal.billMessage')} ${visitIds.length}`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Box sx={{fontSize: 2, fontWeight: 300}}>
                  <h6>
                    {t('finance.confirmModal.alertMessage')}
                  </h6>
                </Box>
              </DialogContentText>
            </DialogContent>
          </Box>
          <DialogActions style={{justifyContent: "center"}} >
            <Button size="large" variant="outlined" onClick={handleClose} color="primary">
              {t('finance.confirmModal.cancel')}
            </Button>
            <Button size="large" variant="contained" onClick={updateMassiveVisits} color="primary" autoFocus>
              {t('finance.confirmModal.accept')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </React.Fragment>
  );
}
