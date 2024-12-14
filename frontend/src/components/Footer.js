import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "background.paper", py: 2, textAlign: "center" }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2024 Beauty Salon. Все права защищены.
      </Typography>
    </Box>
  );
};

export default Footer;
