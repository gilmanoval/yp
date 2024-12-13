import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal'; // Импорт компонента SuccessModal

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log('Успешный вход:', data);
        localStorage.setItem('token', data.token); // Сохранение токена
        localStorage.setItem('role', data.role);

        setSuccessMessage('Вход выполнен успешно!');
        setSuccessModalOpen(true); // Открытие модального окна успеха
      } else {
        console.error('Ошибка авторизации:', data.error);
        setError(data.error || 'Неверные учетные данные');
        setErrorModalOpen(true); // Открытие модального окна ошибок
      }
    } catch (error) {
      console.error('Ошибка соединения с сервером:', error);
      setError('Ошибка соединения с сервером');
      setErrorModalOpen(true); // Открытие модального окна ошибок
    }
  };

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    if (localStorage.getItem('role') === 'admin') {
      navigate('/admin'); // Перенаправление на страницу администратора
    } else {
      navigate('/'); // Перенаправление на главную страницу
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
          Авторизация
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Электронная почта"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Войти
          </Button>
          <Button variant="text" fullWidth onClick={() => navigate('/register')}>
            Нет аккаунта? Зарегистрируйтесь
          </Button>
        </Box>
      </Paper>

      {/* Вызов компонента ErrorModal */}
      <ErrorModal open={isErrorModalOpen} onClose={handleCloseErrorModal} message={error} />

      {/* Вызов компонента SuccessModal */}
      <SuccessModal
        open={isSuccessModalOpen}
        handleClose={handleCloseSuccessModal}
        successMessage={successMessage}
      />
    </Box>
  );
};

export default Login;
