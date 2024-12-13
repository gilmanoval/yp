import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Rating,
  Paper,
} from "@mui/material";
import axios from "axios";
import ErrorModal from "../components/ErrorModal"; // Предполагается, что ErrorModal находится в components

const Review = () => {
  const [reviews, setReviews] = useState([]); // Состояние для отзывов
  const [content, setContent] = useState(""); // Состояние для текста отзыва
  const [rating, setRating] = useState(0); // Состояние для рейтинга
  const [error, setError] = useState(""); // Состояние для ошибок
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Состояние для отображения модального окна
  const token = localStorage.getItem("token"); // Получаем токен из localStorage

  // Получение всех отзывов с сервера
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/reviews");
        console.log("Отзыв с сервера:", response.data); // Выводим полученные данные в консоль
        setReviews(response.data);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
        setError("Ошибка загрузки отзывов");
        setIsErrorModalOpen(true);
      }
    };

    fetchReviews();
  }, []);

  // Обработка отправки нового отзыва
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/reviews",
        {
          content: content,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Добавление токена в заголовки для авторизации
          },
        }
      );
      setContent(""); // Очистить поле ввода после отправки отзыва
      setRating(0); // Сбросить рейтинг
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
      setError("Ошибка при отправке отзыва");
      setIsErrorModalOpen(true);
    }
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setError("");
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Отзывы
      </Typography>

      {/* Если пользователь авторизован, показываем форму для добавления отзыва */}
      {token && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>
            Добавить отзыв
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Ваш отзыв"
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setContent(e.target.value);
                }
              }}
              multiline
              rows={4}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 100 }} // Ограничение на уровне атрибута
              helperText={`${content.length}/100`} // Отображение количества символов
            />

            <Rating
              name="rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
            />
            {error && (
              <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Отправить
            </Button>
          </form>
        </Paper>
      )}

      {/* Список всех отзывов */}
      <List>
        {reviews.map((user) =>
          user.reviews.map((review) => (
            <ListItem
              key={review.id}
              alignItems="flex-start"
              sx={{ marginBottom: 2 }}
            >
              <Paper elevation={1} sx={{ padding: 2, width: "100%" }}>
                <Typography variant="body1">{review.content}</Typography>
                <Rating value={review.rating} readOnly sx={{ marginTop: 1 }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ marginTop: 1, display: "block" }}
                >
                  Пользователь: {user.name || "Неизвестный"}
                </Typography>
              </Paper>
            </ListItem>
          ))
        )}
      </List>

      {/* Модальное окно для ошибок */}
      <ErrorModal
        open={isErrorModalOpen}
        onClose={handleCloseErrorModal}
        message={error}
      />
    </Box>
  );
};

export default Review;
