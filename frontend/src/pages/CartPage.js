import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Modal,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState([]); // Состояние для корзины
  const [openModal, setOpenModal] = useState(false); // Состояние для открытия модального окна
  const [openSuccessModal, setOpenSuccessModal] = useState(false); // Состояние для модального окна успешного заказа
  const [phoneNumber, setPhoneNumber] = useState(""); // Состояние для номера телефона
  const [isSubmitting, setIsSubmitting] = useState(false); // Состояние для отслеживания отправки данных
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Состояние для проверки валидности номера телефона

  useEffect(() => {
    // Загружаем корзину из localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  const handleRemoveFromCart = (id) => {
    // Удаление товара из корзины по ID
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Обновляем localStorage
  };

  const getTotalPrice = () => {
    // Подсчёт общей стоимости корзины
    return cart.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  // Регулярное выражение для проверки российского номера телефона
  const phoneRegex = /^(?:\+7|7)[0-9]{10}$/;

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // Проверяем номер телефона по регулярному выражению
    setIsPhoneValid(phoneRegex.test(value));
  };

  const handleOrderSubmit = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        phone: phoneNumber,
        services: cart.map((item) => item.id),
      };
      await axios.post("http://localhost:3000/api/orders", orderData);
      setIsSubmitting(false);
      setOpenModal(false); // Закрыть модальное окно после успешной отправки
      setOpenSuccessModal(true); // Открыть модальное окно успешного заказа
    } catch (error) {
      setIsSubmitting(false);
      alert("Ошибка при оформлении заказа.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Корзина
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="h6" color="textSecondary" textAlign="center">
          Ваша корзина пуста
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {cart.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <Card sx={{ padding: 2 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    marginRight: 16,
                  }}
                />
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body1" sx={{ marginTop: 1 }}>
                    {item.price} руб.
                  </Typography>

                  <Button
                    onClick={() => handleRemoveFromCart(item.id)}
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                  >
                    Удалить
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Общая стоимость */}
      {cart.length > 0 && (
        <Box sx={{ marginTop: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Общая стоимость: {getTotalPrice()} руб.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={() => setOpenModal(true)} // Открыть модальное окно
          >
            Оформить заказ
          </Button>
        </Box>
      )}

      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Link to="/services">
          <Button variant="outlined" color="secondary">
            Продолжить покупки
          </Button>
        </Link>
      </Box>

      {/* Модальное окно для ввода номера телефона */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Оформление заказа
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Пожалуйста, введите ваш номер телефона для согласования даты и
            времени с администратором. Мы свяжемся с вами как можно скорее.
            Телефон салона: 88005553535.
          </Typography>
          <TextField
            label="Номер телефона"
            value={phoneNumber}
            onChange={handlePhoneChange}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!isPhoneValid} // Показываем ошибку, если номер не валиден
            helperText={!isPhoneValid && "Пример - 79501234567"}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOrderSubmit}
            disabled={isSubmitting || !isPhoneValid || !phoneNumber}
            fullWidth
          >
            {isSubmitting ? "Отправка..." : "Подтвердить заказ"}
          </Button>
        </Box>
      </Modal>

      {/* Модальное окно успешного оформления заказа */}
      <Modal open={openSuccessModal} onClose={() => setOpenSuccessModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Заказ оформлен!
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Мы свяжемся с вами для согласования даты и времени. Спасибо за
            покупку!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenSuccessModal(false)} // Закрыть модальное окно
            fullWidth
          >
            Закрыть
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CartPage;
