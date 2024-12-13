const bcrypt = require('bcrypt');
const { User } = require('./models');  // Импорт модели пользователя

const createAdminUser = async () => {
  try {
    // Данные администратора
    const adminEmail = 'admin2@example.com';
    const adminPassword = 'кукусики'; // Исходный пароль администратора
    const adminRole = 'admin';
    const adminName = 'AdminUser'; // Имя администратора, которое нужно передать

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Создание пользователя с хешированным паролем и ролью 'admin'
    const newAdmin = await User.create({
      name: adminName,  // Добавлено имя администратора
      email: adminEmail,
      password: hashedPassword,
      role: adminRole,
    });

    console.log('Администратор создан:', newAdmin);
  } catch (error) {
    console.error('Ошибка при создании администратора:', error.message);
  }
};

// Вызов функции для создания администратора
createAdminUser();
