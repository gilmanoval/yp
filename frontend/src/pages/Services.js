import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ServiceModal from './ServiceModal'; // Импортируем новый компонент

const Services = () => {
  const [services, setServices] = useState([]); // Состояние для хранения данных об услугах
  const [loading, setLoading] = useState(true);  // Состояние для отслеживания загрузки
  const [error, setError] = useState(null); // Состояние для отслеживания ошибок
  const [open, setOpen] = useState(false); // Состояние для открытия/закрытия модального окна
  const [selectedService, setSelectedService] = useState(null); // Состояние для хранения выбранной услуги
  const [cart, setCart] = useState([]); // Состояние для корзины
  const [token, setToken] = useState(null); // Состояние для хранения токена

  // Загружаем корзину из localStorage при монтировании компонента
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')); // Загружаем данные из localStorage
    if (savedCart) {
      setCart(savedCart); // Если корзина есть, загружаем ее
    }

    const savedToken = localStorage.getItem('token'); // Проверка токена в localStorage
    if (savedToken) {
      setToken(savedToken); // Если токен есть, сохраняем его в состояние
    }
  }, []);

  useEffect(() => {
    // Сохраняем корзину в localStorage каждый раз, когда она изменяется
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

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

  const handleAddToCart = (service) => {
    // Добавляем услугу в корзину, если её ещё нет
    setCart((prevCart) => {
      // Проверяем, есть ли услуга в корзине
      const existingService = prevCart.find((item) => item.id === service.id);
      if (existingService) {
        // Если услуга уже есть, не добавляем её снова
        return prevCart;
      }

      const updatedCart = [...prevCart, service]; // Добавляем услугу в корзину
      return updatedCart;
    });
    setOpen(false); // Закрываем модальное окно
  };

  const getCartServices = () => {
    // Получаем все услуги из корзины
    return cart;
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
        onAddToCart={handleAddToCart}
        token={token}  // Передаем токен
        // Передаем функцию добавления в корзину
      />

      {/* Отображение кнопки для корзины только если есть токен */}
      {token && (
        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          <Link to="/cart">
            <Button variant="contained" color="primary">
              Перейти в корзину ({getCartServices().length})
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default Services;
