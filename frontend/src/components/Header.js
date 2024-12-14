import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Перенаправляем на страницу логина
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src="/images.png" // Замените на путь к вашему логотипу
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Typography variant="h6">Beauty Salon</Typography>
        </Box>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Главная
          </Button>
          <Button color="inherit" component={Link} to="/services">
            Услуги
          </Button>
          {/* Показываем кнопку "Админ" только если роль пользователя - admin */}
          {role === "admin" && (
            <Button color="inherit" component={Link} to="/admin">
              Админ
            </Button>
          )}
          <Button color="inherit" component={Link} to="/reviews">
            Отзывы
          </Button>

          {/* Показать кнопку "Войти", если пользователь не авторизован */}
          {!token ? (
            <Button color="inherit" component={Link} to="/login">
              Войти
            </Button>
          ) : (
            // Показать кнопку выхода, если токен есть
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
