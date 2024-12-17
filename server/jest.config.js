module.exports = {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Используем babel-jest для трансформации файлов
    },
    testEnvironment: 'node', // Указываем окружение для тестов (можно заменить на jsdom, если нужны DOM-элементы)
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // Указываем поддерживаемые расширения файлов
  };
  