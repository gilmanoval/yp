import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../components/ErrorModal'; // Импорт ErrorModal
import SuccessModal from '../components/SuccessModal'; // Импорт SuccessModal

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Для сообщения об ошибке
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Управление модальным окном ошибок
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Управление модальным окном успеха
  const [successMessage, setSuccessMessage] = useState(''); // Сообщение об успехе
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Регистрация успешна:', data);
        setSuccessMessage('Регистрация прошла успешно!'); // Установка сообщения
        setIsSuccessModalOpen(true); // Открытие модального окна успеха
      } else {
        console.error('Ошибка регистрации:', data.error);
        setError(data.error);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Ошибка соединения с сервером:', error);
      setError('Ошибка соединения с сервером');
      setIsErrorModalOpen(true);
    }
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/login'); // Перенаправление на страницу входа
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
          Регистрация
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Имя"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
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
            Зарегистрироваться
          </Button>
          <Button variant="text" fullWidth onClick={() => navigate('/login')}>
            Уже есть аккаунт? Войдите
          </Button>
        </Box>
      </Paper>

      {/* Вызов компонента ErrorModal */}
      <ErrorModal
        open={isErrorModalOpen}
        onClose={handleCloseErrorModal}
        message={error}
      />

      {/* Вызов компонента SuccessModal */}
      <SuccessModal
        open={isSuccessModalOpen}
        handleClose={handleCloseSuccessModal}
        successMessage={successMessage}
      />
    </Box>
  );
};

export default Register;
