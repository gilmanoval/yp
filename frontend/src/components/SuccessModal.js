import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const SuccessModal = ({ open, handleClose, successMessage }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Успех
        </Typography>
        <Typography variant="body1" gutterBottom>
          {successMessage}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          fullWidth
        >
          ОК
        </Button>
      </Box>
    </Modal>
  );
};

export default SuccessModal;
