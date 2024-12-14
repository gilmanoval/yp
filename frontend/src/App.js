import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Review from './pages/Reviews';
import Services from './pages/Services';
import Admin from './pages/Admin';

const App = () => {
  const token = localStorage.getItem('token'); // Токен, сохранённый после авторизации
  const role = localStorage.getItem('role'); // Роль пользователя (например, 'admin')

  // Выводим данные в консоль для отладки
   

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reviews" element={<Review token={token} />} />
          
          {/* Проверка роли пользователя и перенаправление, если не админ */}
          <Route
            path="/admin"
            element={
              // Убедитесь, что token и userRole существуют и роль - admin
              token && role === 'admin' ? <Admin /> : <Navigate to="/" />
            }
          />

        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
