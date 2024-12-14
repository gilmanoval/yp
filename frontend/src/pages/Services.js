import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid, CardMedia } from '@mui/material';
import ServiceModal from './ServiceModal'; // Импортируем новый компонент

const Services = () => {
  const [services, setServices] = useState([]); // Состояние для хранения данных об услугах
  const [loading, setLoading] = useState(true);  // Состояние для отслеживания загрузки
  const [error, setError] = useState(null); // Состояние для отслеживания ошибок
  const [open, setOpen] = useState(false); // Состояние для открытия/закрытия модального окна
  const [selectedService, setSelectedService] = useState(null); // Состояние для хранения выбранной услуги

  useEffect(() => {
    // Получаем данные с сервера
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/services');
        setServices(response.data);  // Сохраняем полученные данные в состояние
        setLoading(false); // Устанавливаем загрузку в false, когда данные получены
      } catch (err) {
        setError('Ошибка при загрузке услуг');
        setLoading(false);
      }
    };

    fetchServices(); // Вызываем функцию для загрузки данных
  }, []);

  const handleClickOpen = (service) => {
    setSelectedService(service); // Устанавливаем выбранную услугу
    setOpen(true); // Открываем модальное окно
  };

  const handleClose = () => {
    setOpen(false); // Закрываем модальное окно
    setSelectedService(null); // Сбрасываем выбранную услугу
  };

  if (loading) {
    return <Typography variant="h6">Загрузка...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
  Услуги
</Typography>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item key={service.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                maxWidth: 345,
                boxShadow: 3, // Начальная тень
                backgroundColor: '#e0f2ff', // Голубой фон
                '&:hover': {
                  boxShadow: 10, // Тень при наведении
                  transform: 'scale(1.05)', // Увеличение при наведении
                  transition: 'all 0.3s ease-in-out', // Плавный переход
                },
              }}
              onClick={() => handleClickOpen(service)} // Открытие модального окна по клику
            >
              {service.image && (
                <CardMedia
                  component="img"
                  height="300" // Высота картинки, можно регулировать
                  image={service.image}
                  alt={service.name}
                  sx={{
                    objectFit: 'cover', // Чтобы картинка заполняла весь блок
                  }}
                />
              )}
              <CardContent>
                <Typography variant="h6">{service.name}</Typography>
                <Typography variant="h6" sx={{ color: 'black', marginTop: 1 }}>
  {service.price} руб.
</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Вставляем модальное окно */}
      <ServiceModal 
        open={open} 
        onClose={handleClose} 
        service={selectedService} 
      />
    </Box>
  );
};

export default Services;
