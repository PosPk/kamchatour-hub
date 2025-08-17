import { Pool, PoolConfig } from 'pg';

// Конфигурация базы данных
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

// Конфигурация по умолчанию
export const defaultDatabaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'kamchatour_hub',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production',
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000')
};

// Создание пула соединений
export function createDatabasePool(config: DatabaseConfig = defaultDatabaseConfig): Pool {
  const poolConfig: PoolConfig = {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
    max: config.max,
    idleTimeoutMillis: config.idleTimeoutMillis,
    connectionTimeoutMillis: config.connectionTimeoutMillis
  };

  return new Pool(poolConfig);
}

// Глобальный пул соединений
export const dbPool = createDatabasePool();

// Проверка соединения с базой данных
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = await dbPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log('✅ Соединение с базой данных установлено:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Ошибка соединения с базой данных:', error);
    return false;
  }
}

// Закрытие пула соединений
export async function closeDatabasePool(): Promise<void> {
  try {
    await dbPool.end();
    console.log('✅ Пул соединений с базой данных закрыт');
  } catch (error) {
    console.error('❌ Ошибка при закрытии пула соединений:', error);
  }
}

// Получение клиента из пула
export async function getDatabaseClient() {
  return await dbPool.connect();
}

// Выполнение запроса с автоматическим освобождением клиента
export async function executeQuery<T = any>(
  query: string, 
  params?: any[]
): Promise<T[]> {
  const client = await getDatabaseClient();
  
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// Выполнение транзакции
export async function executeTransaction<T>(
  queries: Array<{ query: string; params?: any[] }>
): Promise<T[]> {
  const client = await getDatabaseClient();
  
  try {
    await client.query('BEGIN');
    
    const results: T[] = [];
    for (const { query, params } of queries) {
      const result = await client.query(query, params);
      results.push(result.rows[0]);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Миграции базы данных
export async function runMigrations(): Promise<void> {
  try {
    console.log('🔄 Запуск миграций базы данных...');
    
    // Создание таблицы миграций, если её нет
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Получение списка выполненных миграций
    const executedMigrations = await executeQuery<{ name: string }>(
      'SELECT name FROM migrations ORDER BY id'
    );
    
    const executedNames = executedMigrations.map(m => m.name);
    
    // Список всех миграций
    const migrations = [
      {
        name: '001_initial_schema',
        query: `
          -- Базовая схема уже создана через schema.sql
          -- Здесь можно добавить дополнительные изменения
        `
      }
    ];
    
    // Выполнение новых миграций
    for (const migration of migrations) {
      if (!executedNames.includes(migration.name)) {
        console.log(`📋 Выполнение миграции: ${migration.name}`);
        
        if (migration.query.trim()) {
          await executeQuery(migration.query);
        }
        
        await executeQuery(
          'INSERT INTO migrations (name) VALUES ($1)',
          [migration.name]
        );
        
        console.log(`✅ Миграция ${migration.name} выполнена`);
      }
    }
    
    console.log('✅ Все миграции выполнены');
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграций:', error);
    throw error;
  }
}

// Инициализация базы данных
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 Инициализация базы данных...');
    
    // Проверка соединения
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      throw new Error('Не удалось установить соединение с базой данных');
    }
    
    // Запуск миграций
    await runMigrations();
    
    console.log('✅ База данных инициализирована');
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error);
    throw error;
  }
}

// Экспорт по умолчанию
export default {
  createDatabasePool,
  testDatabaseConnection,
  closeDatabasePool,
  getDatabaseClient,
  executeQuery,
  executeTransaction,
  runMigrations,
  initializeDatabase,
  dbPool
};