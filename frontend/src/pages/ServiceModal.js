import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ServiceModal = ({ open, onClose, service, onAddToCart, token }) => {
  if (!service) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        width: 400,
      }}>
        <Typography variant="h6">{service.name}</Typography>
        <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
          {service.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ marginTop: 2 }}>
          {service.price} руб.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <Button onClick={onClose}>Закрыть</Button>

          {/* Показываем кнопку "Добавить в корзину" только если токен существует */}
          {token && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onAddToCart(service)}
            >
              Добавить в корзину
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ServiceModal;
