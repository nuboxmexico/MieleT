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

export default function ModalConfirmation({selectedVisits, showModal, setShowModal, dateRange}) {
  const {t} = useTranslation();
  function handleClose(e) {
    e.preventDefault();
    setShowModal(false)
  }

  function handleAccept(e) {
    e.preventDefault();
    window.open("/api/v1/services_report_excel.xlsx?start=" + dateRange.startDate + ";finish=" + dateRange.endDate, "_blank")
    setShowModal(false)
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
              {t('finance.confirmModal.downloadMessage')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Box >
                  <span style={{ fontSize: '18px', fontWeight: 300, color: '#333' }}>
                  {t('finance.confirmModal.continueMessage')}
                  </span>
                </Box>
              </DialogContentText>
            </DialogContent>
          </Box>
          <DialogActions style={{justifyContent: "center"}} >
            <Button size="large" variant="outlined" onClick={handleClose} color="primary">
              {t('finance.confirmModal.cancel')}
            </Button>
            <Button onClick={handleAccept} target='_blank'  size="large" variant="contained" color="primary" autoFocus>
              {t('finance.confirmModal.accept')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </React.Fragment>
  );
}
