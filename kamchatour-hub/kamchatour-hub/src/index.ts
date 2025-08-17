import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDatabase } from '../database/config';
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware безопасности
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API маршруты
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Главная страница
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Kamchatour Hub Backend API',
    version: '1.0.0',
    description: 'Революционная платформа экотуризма на Камчатке',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      docs: '/api/docs'
    }
  });
});

// Обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Ошибка сервера:', err);
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Что-то пошло не так'
  });
});

// 404 для несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/refresh',
      'POST /api/auth/logout'
    ]
  });
});

// Инициализация и запуск сервера
async function startServer() {
  try {
    console.log('🚀 Запуск Kamchatour Hub Backend...');
    
    // Инициализация базы данных
    await initializeDatabase();
    
    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен на порту ${PORT}`);
      console.log(`🌐 API доступен по адресу: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 Документация: http://localhost:${PORT}/`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Получен сигнал SIGTERM, завершение работы...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Получен сигнал SIGINT, завершение работы...');
  process.exit(0);
});

startServer();
