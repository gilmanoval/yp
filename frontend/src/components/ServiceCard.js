import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const ServiceCard = ({ name, description, price }) => {
    return (
        <Card sx={{ maxWidth: 345, margin: 'auto', mb: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                    <strong>Цена:</strong> {price} ₽
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Подробнее</Button>
            </CardActions>
        </Card>
    );
};

export default ServiceCard;
