const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, User, Service, Booking, Review, AdminLog, Preorder  } = require('./models.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Middleware для проверки токена
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Доступ запрещен. Необходим токен авторизации.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // добавляем информацию о пользователе в запрос
        next(); // передаем управление следующему middleware
    } catch (err) {
        res.status(401).json({ error: 'Недействительный токен.' });
    }
};

// Настройка Nodemailer для Яндекса
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // Используем SSL
    auth: {
        user: process.env.EMAIL_USER, // Ваш email на Яндексе
        pass: process.env.EMAIL_PASSWORD, // Пароль приложения
    },
});
// Регистрация пользователя
app.post('/users/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Хэширование пароля
        const hashedPassword = require('bcrypt').hashSync(password, 10);

        // Генерация уникального кода для подтверждения email
        const confirmationCode = crypto.randomBytes(3).toString('hex'); // Генерируем 6-значный код

        // Отправка письма с кодом подтверждения
        await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Подтверждение регистрации',
            text: `Привет, ${name}! Ваш код подтверждения для завершения регистрации: ${confirmationCode}`,
            html: `<p>Привет, ${name}!</p><p>Ваш код подтверждения для завершения регистрации: <strong>${confirmationCode}</strong></p>`,
        });

        // Сохранение пользователя с кодом подтверждения в базу данных
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            confirmationcode: confirmationCode, // Используем тот же код
            isconfirmed: false, // Пока не подтвержден
        });

        res.status(201).json({ message: 'На вашу почту отправлен код подтверждения.' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});
app.post('/api/orders', async (req, res) => {
    const { phone, services } = req.body;

    // Проверка на наличие данных
    if (!phone || !services || !Array.isArray(services) || services.length === 0) {
        return res.status(400).json({ error: 'Номер телефона и услуги обязательны' });
    }

    try {
        // Создание новой записи в таблице preorders с помощью Sequelize
        const preorder = await Preorder.create({
            phone,
            services: JSON.stringify(services),  // Преобразуем массив в строку JSON
        });

        // Возвращаем результат
        res.status(200).json({
            message: 'Заказ оформлен успешно!',
            order: preorder, // Возвращаем данные о заказе
        });
    } catch (err) {
        console.error('Ошибка при сохранении данных', err);
        res.status(500).json({ error: 'Ошибка при сохранении данных' });
    }
});

app.post('/users/confirm', async (req, res) => {
    const { email, confirmationCode } = req.body; // Обратите внимание на подтверждение правильности именования
    console.log('Данные запроса:', req.body);
    try {
        // Проверяем, есть ли пользователь с таким email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Пользователь не найден' });
        }

        // Выводим в консоль код из базы данных и код, который вводит пользователь
        console.log('Код из базы данных:', user.confirmationcode);
        console.log('Код, введенный пользователем:', confirmationCode);

        // Проверка кода
        if (user.confirmationcode !== confirmationCode) {
            return res.status(400).json({ error: 'Неверный код подтверждения' });
        }

        // Если код верный, подтверждаем почту
        user.isconfirmed = true;
        await user.save();

        res.status(200).json({ message: 'Почта подтверждена!' });
    } catch (error) {
        console.error('Ошибка при подтверждении почты:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

  

// Изменение логики входа: только подтверждённые пользователи
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const { User } = require('./models'); // Импортируем модель User (предполагаем, что она определена)

    try {
        // Ищем пользователя по email
        const user = await User.findOne({ where: { email } });

        // Если пользователь не найден или пароль не совпадает
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
        }

        // Проверяем, подтверждена ли почта
        if (!user.isconfirmed) {
            return res.status(403).json({ error: 'Подтвердите почту для завершения регистрации.' });
        }

        // Создаем JWT токен
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Опционально: установка времени действия токена
        });

        // Отправляем токен и роль пользователя в ответе
        res.json({ token, role: user.role });
    } catch (error) {
        // Если произошла ошибка на сервере
        res.status(500).json({ error: error.message });
    }
});


// Тестовый маршрут
app.get('/', (req, res) => {
    res.send('API работает!');
});

// Получение всех услуг
app.get('/services', async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);  // Отправляем все услуги в ответе
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при загрузке услуг' });
    }
});


app.get('/reviews', async (req, res) => {
    try {
        const reviews = await User.findAll({
            include: {
                model: Review,
                as: 'reviews', // Указываем псевдоним
            }
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при загрузке отзывов' });
    }
});
app.post('/reviews', authenticate, async (req, res) => {
    const { content, rating } = req.body;
    const user_id = req.user.id; // Извлекаем userId из авторизованного пользователя

    // Проверяем длину content
    if (content.length > 100) {
        return res.status(400).json({ error: 'Отзыв не должен превышать 100 символов' });
    }

    try {
        const review = await Review.create({ content, rating, user_id });
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании отзыва' });
    }
});

app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                {
                    model: User,
                    as: 'user', // Указываем ассоциацию для пользователя, сделавшего бронирование
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: Service,
                    as: 'services',
                    attributes: ['id', 'name', 'price'],
                },
                {
                    model: User,
                    as: 'employee', // Указываем ассоциацию для сотрудника, связанного с бронированием
                    attributes: ['id', 'name'],
                },
            ],
        });
        res.json(bookings);
    } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
        res.status(500).json({ error: 'Ошибка при загрузке бронирований' });
    }
});


// Добавить новую запись в таблицу Booking
app.post('/bookings', async (req, res) => {
    const { user_id, service_id, booking_date, status, employee_id } = req.body;
    try {
        const booking = await Booking.create({ user_id, service_id, booking_date, status, employee_id });
        res.status(201).json(booking);
    } catch (error) {
        console.error('Ошибка при добавлении бронирования:', error);
        res.status(500).json({ error: 'Ошибка при добавлении бронирования' });
    }
});

// Обработчик для PUT-запроса
app.put('/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, service_id, booking_date, status, employee_id } = req.body;
  
      const booking = await Booking.findByPk(id);
  
      if (!booking) {
        return res.status(404).send('Бронирование не найдено');
      }
  
      // Обновляем бронирование
      await booking.update({
        user_id,
        service_id,
        booking_date,
        status,
        employee_id
      });
  
      res.json(booking); // Возвращаем обновленное бронирование
    } catch (error) {
      res.status(500).send('Ошибка при обновлении бронирования');
    }
  });
  

// Удалить запись из таблицы Booking
app.delete('/bookings/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }

        await booking.destroy();
        res.status(204).send(); // Успешное удаление, без контента
    } catch (error) {
        console.error('Ошибка при удалении бронирования:', error);
        res.status(500).json({ error: 'Ошибка при удалении бронирования' });
    }
});
// Удаление отзыва
app.delete('/reviews/:id', authenticate, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'Отзыв не найден.' });
        }

        if (review.userId !== req.user.id) {
            return res.status(403).json({ error: 'Вы не можете удалить этот отзыв.' });
        }

        await review.destroy();
        res.status(204).send(); // Успешное удаление
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Запуск сервера
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к базе данных успешно установлено.');
        app.listen(3000, () => {
            console.log('Сервер запущен на http://localhost:3000');
        });
    } catch (error) {
        console.error('Ошибка подключения к базе данных:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer(); // Запускаем сервер только если файл выполняется напрямую
}
module.exports = app;
