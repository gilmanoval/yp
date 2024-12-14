import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/ErrorModal";
import SuccessModal from "../components/SuccessModal";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha"; // Импортируем функции для капчи

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const navigate = useNavigate();

  // Загрузка капчи при монтировании компонента
  useEffect(() => {
    loadCaptchaEnginge(6); // Загружаем капчу с 6 символами
  }, []);

  // Обработчик для регистрации
  const handleRegister = async (e) => {
    e.preventDefault();

    // Проверяем введенное значение капчи
    const userCaptchaValue =
      document.getElementById("user_captcha_input").value;
    if (!validateCaptcha(userCaptchaValue)) {
      setError("Пожалуйста, введите правильную капчу");
      setIsErrorModalOpen(true);
      return; // Прерываем выполнение функции, если капча неверная
    }

    // Если капча верная, продолжаем с запросом
    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(
          "Для подтверждения почты, введите код. Код отправлен на вашу почту."
        );
        setIsRegistered(true);
        setIsSuccessModalOpen(true);
      } else {
        setError(data.error);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setError("Ошибка соединения с сервером");
      setIsErrorModalOpen(true);
    }
  };

  // Обработчик для подтверждения кода
  const handleConfirmCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, confirmationCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Почта подтверждена! Теперь можете войти.");
        setIsEmailConfirmed(true);
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setError(data.error);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setError("Ошибка соединения с сервером");
      setIsErrorModalOpen(true);
    }
  };

  // Обработчик для перезагрузки капчи
  const handleCaptchaReload = () => {
    loadCaptchaEnginge(6); // Перезагружаем капчу
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "white",
      }}
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, maxWidth: 400, width: "100%", bgcolor: "#e0f2ff" }}
      >
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          gutterBottom
          sx={{ color: "black", fontWeight: "bold" }}
        >
          Регистрация
        </Typography>
        <Box
          component="form"
          onSubmit={isRegistered ? handleConfirmCode : handleRegister}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Имя"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            disabled={isRegistered || isEmailConfirmed}
            sx={{
              bgcolor: "white",
              input: { color: "black", textAlign: "center" },
              label: { color: "black" },
            }}
          />
          <TextField
            label="Электронная почта"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            disabled={isRegistered || isEmailConfirmed}
            sx={{
              bgcolor: "white",
              input: { color: "black", textAlign: "center" },
              label: { color: "black" },
            }}
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            disabled={isRegistered || isEmailConfirmed}
            sx={{
              bgcolor: "white",
              input: { color: "black", textAlign: "center" },
              label: { color: "black" },
            }}
          />
          {isRegistered && !isEmailConfirmed && (
            <TextField
              label="Код подтверждения"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              fullWidth
              required
              sx={{
                bgcolor: "white",
                input: { color: "black" },
                label: { color: "black" },
              }}
            />
          )}
          {/* Добавляем компонент react-simple-captcha */}
          <div className="col mt-3">
            <LoadCanvasTemplate />
          </div>
          <TextField
            label="Введите капчу"
            type="text"
            id="user_captcha_input"
            fullWidth
            required
            sx={{
              bgcolor: "white",
              input: { color: "black" },
              label: { color: "black" },
            }}
          />
          <Button
            onClick={handleCaptchaReload}
            variant="outlined"
            color="secondary"
            sx={{ marginBottom: 2 }}
          >
            Перезагрузить капчу
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ borderRadius: "20px", color: "black" }}
          >
            {isRegistered ? "Подтвердить почту" : "Зарегистрироваться"}
          </Button>
        </Box>
      </Paper>

      <ErrorModal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={error}
      />
      <SuccessModal
        open={isSuccessModalOpen}
        handleClose={() => setIsSuccessModalOpen(false)}
        successMessage={successMessage}
      />
    </Box>
  );
};

export default Register;
