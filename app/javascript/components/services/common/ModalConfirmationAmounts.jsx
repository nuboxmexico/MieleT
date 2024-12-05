import React from 'react';
import axios from 'axios';
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  Box
} from '@material-ui/core';

export default function ModalConfirmationAmounts({ newTotalAmount, showModal, setShowModal, saveNewAmounts }) {
  function handleClose(e) {
    e.preventDefault();
    setShowModal(false)
  }

  function handleValidateAmount() {
    saveNewAmounts('Montos validados correctamente')
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
          <Box style={{ textAlign: 'center' }}>
            <DialogTitle className="payment-dialog-title" id="alert-dialog-title">
              {`¿Está seguro que desea validar monto de ${newTotalAmount} para que sea facturado?`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Box >
                  <span style={{ fontSize: '18px', fontWeight: 300, color: '#333' }}>
                    Esta acción no se puede deshacer.
                  </span>
                </Box>
              </DialogContentText>
            </DialogContent>
          </Box>
          <DialogActions style={{ justifyContent: "center" }} >
            <Button size="large" variant="outlined" onClick={handleClose} color="primary">
              Volver atrás
            </Button>
            <Button size="large" variant="contained" onClick={handleValidateAmount} color="primary" autoFocus>
              Validar monto
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </React.Fragment>
  );
}
