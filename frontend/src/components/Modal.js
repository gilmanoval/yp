import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ModalWindow = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Модальное окно
        </Typography>
        <Typography id="modal-description" sx={{ mb: 2 }}>
          {children}
        </Typography>
        <Button onClick={onClose} variant="contained">
          Закрыть
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalWindow;
