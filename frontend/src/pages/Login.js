import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';

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

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        setSuccessMessage('Вход выполнен успешно!');
        setSuccessModalOpen(true);
      } else {
        setError(data.error || 'Неверные учетные данные');
        setErrorModalOpen(true);
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
      setErrorModalOpen(true);
    }
  };

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    if (localStorage.getItem('role') === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'white',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%', bgcolor: '#e0f2ff' }}>
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          gutterBottom
          sx={{ color: 'black', fontWeight: 'bold' }}
        >
          Авторизация
        </Typography>
        <TextField
          label="Электронная почта"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={{ bgcolor: 'white', input: { color: 'black' }, label: { color: 'black' }, mb: 2 }}
        />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{ bgcolor: 'white', input: { color: 'black' }, label: { color: 'black' }, mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ borderRadius: '20px', mb: 1, color: 'black' }}
        >
          Войти
        </Button>
        <Button
          variant="text"
          fullWidth
          onClick={() => navigate('/register')}
          sx={{ color: 'black' }}
        >
          Нет аккаунта? Зарегистрируйтесь
        </Button>
      </Paper>

      <ErrorModal open={isErrorModalOpen} onClose={handleCloseErrorModal} message={error} />
      <SuccessModal
        open={isSuccessModalOpen}
        handleClose={handleCloseSuccessModal}
        successMessage={successMessage}
      />
    </Box>
  );
};

export default Login;
