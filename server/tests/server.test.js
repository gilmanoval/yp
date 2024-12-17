const { sequelize, User, Preorder } = require('../models'); // Импортируем sequelize из ваших моделей
const request = require('supertest');
const app = require('../server');
let server;

beforeAll(async () => {
    // Запускаем сервер
    server = app.listen(4000, () => console.log('Test server running on port 4000'));
    // Подключаемся к базе данных и выполняем миграции
    await sequelize.authenticate();
});

afterAll(async () => {
    // Закрываем сервер и соединение с базой
    await server.close();
    await sequelize.close();
});

describe('POST /users/register', () => {
    let testEmail = 'john.doe@example.com'; // Тестовый email

    it('should register a user and send confirmation email', async () => {
        const response = await request(app)
            .post('/users/register')
            .send({
                name: 'John Doe',
                email: testEmail,
                password: 'password123',
                role: 'user',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('На вашу почту отправлен код подтверждения.');
    });

    afterEach(async () => {
        // Удаляем пользователя из базы данных после теста
        await User.destroy({ where: { email: testEmail } });
    });
});


describe('POST /users/login', () => {
    it('should log in with correct email and password', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({
                email: 'gilmanovalilya3004@gmail.com',
                password: 'StrongPassword123',
            });

        expect(response.status).toBe(200); // Статус успешного входа
        expect(response.body).toHaveProperty('token'); // Токен должен быть в ответе
        expect(response.body).toHaveProperty('role', 'user'); // Роль пользователя должна быть "user"
    });

    it('should fail login with incorrect password', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({
                email: 'gilmanovalilya3004@gmail.com',
                password: 'WrongPassword',
            });

        expect(response.status).toBe(401); // Статус для неверных данных
        expect(response.body.error).toBe('Неверные учетные данные');
    });

    it('should fail login for unconfirmed user', async () => {
        // Используем существующий неподтверждённый аккаунт
        const response = await request(app)
            .post('/users/login')
            .send({
                email: 'test@example.ru', // Неподтверждённый email
                password: '1234', // Пароль существующего аккаунта
            });

        expect(response.status).toBe(403); // Статус для неподтверждённого пользователя
        expect(response.body.error).toBe('Подтвердите почту для завершения регистрации.');
    });
});

describe('POST /users/confirm', () => {
    it('should confirm the email when the confirmation code is correct', async () => {
        const response = await request(app)
            .post('/users/confirm')
            .send({
                email: 'gilmanovalilya3004@yandex.com',
                confirmationCode: '204916', // Верный код подтверждения
            });

        expect(response.status).toBe(200); // Проверяем успешный статус
        expect(response.body.message).toBe('Почта подтверждена!'); // Проверяем сообщение

        // Проверяем, что пользователь подтвержден
        const user = await User.findOne({ where: { email: 'gilmanovalilya3004@yandex.com' } });
        expect(user.isconfirmed).toBe(true); // Почта должна быть подтверждена
    });

    it('should return an error if the user is not found', async () => {
        const response = await request(app)
            .post('/users/confirm')
            .send({
                email: 'nonexistent@example.com', // Не существующий email
                confirmationCode: '123abc',
            });

        expect(response.status).toBe(400); // Ожидаем статус 400
        expect(response.body.error).toBe('Пользователь не найден'); // Сообщение об ошибке
    });

    it('should return an error if the confirmation code is incorrect', async () => {
        const response = await request(app)
            .post('/users/confirm')
            .send({
                email: 'gilmanovalilya3004@gmail.com',
                confirmationCode: 'wrongcode', // Неверный код
            });

        expect(response.status).toBe(400); // Ожидаем статус 400
        expect(response.body.error).toBe('Неверный код подтверждения'); // Сообщение об ошибке
    });
});



describe('GET /services', () => {
    it('should return a list of services', async () => {
        const response = await request(app).get('/services');

        expect(response.status).toBe(200); // Проверяем, что статус ответа 200
        expect(response.body).toBeInstanceOf(Array); // Ответ должен быть массивом
        expect(response.body.length).toBeGreaterThan(0); // Массив не должен быть пустым

        // Проверяем структуру одного элемента
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('description');
    });
});


describe('POST /api/orders', () => {
    it('should create an order with valid phone and services', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                phone: '72347567890',
                services: [7, 8],
            });

        expect(response.status).toBe(200); // Проверка успешного ответа
        expect(response.body.message).toBe('Заказ оформлен успешно!'); // Проверка сообщения
        expect(response.body.order).toHaveProperty('phone', '72347567890'); // Проверка наличия телефона в заказе
        expect(response.body.order).toHaveProperty('services'); // Проверка наличия услуги в заказе
        expect(Array.isArray(JSON.parse(response.body.order.services))).toBe(true); // Проверка, что услуги преобразованы обратно в массив
    });

    it('should return an error if phone or services are missing', async () => {
        // Отправляем запрос без телефона
        let response = await request(app)
            .post('/api/orders')
            .send({
                services: [7, 8],
            });
        expect(response.status).toBe(400); // Ожидаем ошибку 400
        expect(response.body.error).toBe('Номер телефона и услуги обязательны'); // Ожидаем сообщение об ошибке

        // Отправляем запрос без услуг
        response = await request(app)
            .post('/api/orders')
            .send({
                phone: '72347567890',
            });
        expect(response.status).toBe(400); // Ожидаем ошибку 400
        expect(response.body.error).toBe('Номер телефона и услуги обязательны'); // Ожидаем сообщение об ошибке
    });

    it('should return an error if services is not an array or is empty', async () => {
        // Отправляем запрос с некорректными данными для services
        let response = await request(app)
            .post('/api/orders')
            .send({
                phone: '+1234567890',
                services: 'service1', // services не является массивом
            });
        expect(response.status).toBe(400); // Ожидаем ошибку 400
        expect(response.body.error).toBe('Номер телефона и услуги обязательны'); // Ожидаем сообщение об ошибке

        // Отправляем запрос с пустым массивом для services
        response = await request(app)
            .post('/api/orders')
            .send({
                phone: '+1234567890',
                services: [], // Пустой массив услуг
            });
        expect(response.status).toBe(400); // Ожидаем ошибку 400
        expect(response.body.error).toBe('Номер телефона и услуги обязательны'); // Ожидаем сообщение об ошибке
    });

    it('should handle server errors gracefully', async () => {
        // Искусственно вызовем ошибку сервера (например, если модель Preorder не доступна)
        jest.spyOn(Preorder, 'create').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/api/orders')
            .send({
                phone: '+1234567890',
                services: ['service1', 'service2'],
            });

        expect(response.status).toBe(500); // Ожидаем ошибку 500
        expect(response.body.error).toBe('Ошибка при сохранении данных'); // Ожидаем сообщение об ошибке
    });
});
/*
// Применяйте mockAuthenticate вместо реальной функции authenticate
app.post('/reviews', mockAuthenticate, async (req, res) => {
    const { content, rating } = req.body;
    const user_id = req.user.id;

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

describe('POST /bookings', () => {
    it('should create a booking', async () => {
        const response = await request(app)
            .post('/bookings')
            .send({
                user_id: 1,
                service_id: 1,
                booking_date: '2024-12-16',
                status: 'pending',
                employee_id: 2,
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });
});
*/
