const { DataTypes } = require('sequelize');
const sequelize = require('./database');


const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { // Добавьте явное определение user_id
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    service_id: { // Добавьте явное определение user_id
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    booking_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  },
  {
    tableName: 'bookings',
    timestamps: false,
  }
);

const User = sequelize.define(
  'User',
  {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      role: {
          type: DataTypes.STRING,
          defaultValue: 'user',
      },
      confirmationcode: {
          type: DataTypes.STRING(6), // Строка фиксированной длины (например, 6 символов для кода)
          allowNull: true, // Может быть пустым, пока код не будет сгенерирован
      },
      isconfirmed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false, // По умолчанию не подтверждено
      },
  },
  {
      tableName: 'users', // Имя таблицы
      timestamps: false, // Отключить временные метки
  }
);

// Модель отзыва
const Review = sequelize.define(
    'Review', 
    {
    content: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    },
    {
        tableName: 'reviews', // Имя таблицы
        timestamps: false, // Отключить временные метки
    });

    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true, // image может быть пустым, если не загружено фото
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true, // продолжительность в минутах
        }
    }, {
        tableName: 'services', // Имя таблицы в базе данных
        timestamps: false, // Отключить временные метки
    });
    

// Модель логов администратора
const AdminLog = sequelize.define('AdminLog', {
    action: { type: DataTypes.TEXT, allowNull: false },
    action_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});



// Связь между пользователем и отзывом
User.hasMany(Review, {
    foreignKey: 'user_id', // Укажите внешний ключ
    as: 'reviews', // Псевдоним для ассоциации
});

Review.belongsTo(User, {
    foreignKey: 'user_id', 
    as: 'user',
});




// Связи между пользователем и бронированием
User.hasMany(Booking, {
  foreignKey: 'user_id', // Пользователь, сделавший бронирование
  as: 'bookings',        // Псевдоним для ассоциации
});
Booking.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Связь между сотрудником и бронированием
User.hasMany(Booking, {
  foreignKey: 'employee_id', // Сотрудник, связанный с бронированием
  as: 'employeeBookings',    // Псевдоним для ассоциации
});
Booking.belongsTo(User, {
  foreignKey: 'employee_id',
  as: 'employee',
});

// Модель Service
Service.hasMany(Booking, {
  foreignKey: 'service_id', // или другой ключ
  as: 'bookings',           // Псевдоним для ассоциации
});

Booking.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'services',  // Псевдоним для ассоциации
});

module.exports = { sequelize, User, Service, Booking, Review, AdminLog };
