import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Получаем токен и роль пользователя
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  useEffect(() => {
    fetchBookings();
  }, []);



  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Не удалось загрузить данные');
      setLoading(false);
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleSave = async () => {
    try {
      // Проверяем, если выбранное бронирование уже существует, обновляем его
      if (selectedBooking.id) {
        // Убедитесь, что данные правильно передаются на сервер
        const updatedBooking = {
          user_id: selectedBooking.user_id,
          service_id: selectedBooking.service_id,
          booking_date: selectedBooking.booking_date,
          status: selectedBooking.status,
          employee_id: selectedBooking.employee_id
        };
  
        await axios.put(`http://localhost:3000/bookings/${selectedBooking.id}`, updatedBooking, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
      } else {
        // Если бронирования нет, создаем новое
        const response = await axios.post('http://localhost:3000/bookings', selectedBooking, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings([...bookings, response.data]);
      }
  
      fetchBookings(); // Обновляем список бронирований после сохранения
      handleDialogClose(); // Закрываем диалог
    } catch (err) {
      alert('Ошибка при сохранении');
      console.error(err);
    }
  };
  
  const handleFieldChange = (field, value) => {
    setSelectedBooking({ ...selectedBooking, [field]: value });
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление бронированиями
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedBooking({ user_id: '', service_id: '', booking_date: '', status: '', employee_id: '' });
          setDialogOpen(true);
        }}
      >
        Добавить бронирование
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Service ID</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.user_id}</TableCell>
                <TableCell>{booking.service_id}</TableCell>
                <TableCell>{booking.booking_date}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>{booking.employee_id}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(booking)}
                    sx={{ marginRight: 1 }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedBooking?.id ? 'Редактировать бронирование' : 'Добавить бронирование'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User ID"
                value={selectedBooking?.user_id || ''}
                onChange={(e) => handleFieldChange('user_id', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service ID"
                value={selectedBooking?.service_id || ''}
                onChange={(e) => handleFieldChange('service_id', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Booking Date"
                type="datetime-local"
                value={selectedBooking?.booking_date || ''}
                onChange={(e) => handleFieldChange('booking_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Status"
                value={selectedBooking?.status || ''}
                onChange={(e) => handleFieldChange('status', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employee ID"
                value={selectedBooking?.employee_id || ''}
                onChange={(e) => handleFieldChange('employee_id', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleSave} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
