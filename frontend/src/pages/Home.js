import React from 'react';
import { Box, Typography, Button, Grid, Paper, Card, CardContent, CardMedia } from '@mui/material';
import MyLocationMap from '../components/Map'; // Импорт компонента карты

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        gap: 4,
        bgcolor: 'background.default',
      }}
    >
      {/* Заголовок */}
      <Typography variant="h3" component="h1" gutterBottom>
        Добро пожаловать в наш Салон Красоты
      </Typography>

      {/* Описание салона */}
      <Typography variant="body1" textAlign="center" maxWidth="800px">
        Мы предлагаем широкий выбор услуг для ухода за собой: профессиональные стрижки, маникюр, расслабляющий массаж, уход за кожей лица и многое другое.
        Наша команда мастеров поможет вам выглядеть идеально и чувствовать себя уверенно!
      </Typography>

      {/* Преимущества салона */}
      <Box sx={{ width: '100%', maxWidth: 1200, marginTop: 4 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Почему выбирают нас?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Преимущество 1 */}
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Профессиональные мастера
              </Typography>
              <Typography variant="body2">
                Мы работаем с лучшими специалистами, которые используют новейшие методы и высококачественные материалы.
              </Typography>
            </Paper>
          </Grid>
          {/* Преимущество 2 */}
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Уютная атмосфера
              </Typography>
              <Typography variant="body2">
                Наш салон создан для того, чтобы вы могли расслабиться и насладиться атмосферой заботы о себе.
              </Typography>
            </Paper>
          </Grid>
          {/* Преимущество 3 */}
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Лучшие материалы
              </Typography>
              <Typography variant="body2">
                Мы используем только проверенные и безопасные косметические средства.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Местоположение */}
      <Box sx={{ width: '100%', maxWidth: 1200, marginTop: 6 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Наше местоположение
        </Typography>
        <MyLocationMap />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1">
            Адрес: Москва, ул. Примерная, дом 10
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
