import { Pool, PoolConfig } from 'pg';

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

export const dbPool = createDatabasePool();

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

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 Инициализация базы данных...');
    
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      throw new Error('Не удалось установить соединение с базой данных');
    }
    
    console.log('✅ База данных инициализирована');
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error);
    throw error;
  }
}