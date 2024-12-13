import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const ServiceModal = ({ open, onClose, service }) => {
  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{service.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Описание: {service.description}</Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Продолжительность: {service.duration} мин.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceModal;
