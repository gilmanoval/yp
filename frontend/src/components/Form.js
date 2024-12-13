import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const Form = ({ fields, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((field, index) => (
                <TextField
                    key={index}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    required={field.required}
                    variant="outlined"
                />
            ))}
            <Button variant="contained" color="primary" type="submit">
                Отправить
            </Button>
        </Box>
    );
};

export default Form;
