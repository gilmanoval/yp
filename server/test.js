const nodemailer = require('nodemailer');

// Настройка транспорта для Яндекса
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru', // SMTP-сервер Яндекса
    port: 465, // Порт для SSL
    secure: true, // SSL
    auth: {
        user: 'gilmanovalilya3004@yandex.ru', // Ваш email на Яндексе
        pass: 'yqbceqnvuzzdnsrg', // Пароль приложения или основной пароль
    },
});

// Функция отправки письма
const sendMail = async () => {
    try {
        const info = await transporter.sendMail({
            from: '"Ваше имя" <gilmanovalilya3004@yandex.ru>', // Отправитель
            to: 'annalives31@gmail.com', // Кому
            subject: 'Тестовое письмо от Яндекс', // Тема
            text: 'Привет! Это тестовое письмо, отправленное через Яндекс.', // Текст
            html: '<b>Привет!</b> Это тестовое письмо, отправленное через Яндекс.', // HTML-версия
        });

        console.log('Письмо отправлено:', info.messageId);
    } catch (error) {
        console.error('Ошибка отправки:', error);
    }
};

sendMail();
