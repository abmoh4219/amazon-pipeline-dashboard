import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Helper function to get environment variable with default
function getEnv(key: string, defaultValue?: string): string {
  // For Render's database connection
  if (key === 'DATABASE_URL' && process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue as string;
}

// Parse database URL (for Render's DATABASE_URL format)
function parseDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  try {
    const parsedUrl = new URL(dbUrl);
    return {
      host: parsedUrl.hostname,
      port: parseInt(parsedUrl.port, 10),
      username: parsedUrl.username,
      password: parsedUrl.password,
      database: parsedUrl.pathname.replace(/^\//, ''),
      ssl: { rejectUnauthorized: false } // Required for Render's external connections
    };
  } catch (error) {
    console.warn('Failed to parse DATABASE_URL, using individual config');
    return null;
  }
}

const isProduction = process.env.NODE_ENV === 'production';
const parsedUrl = parseDatabaseUrl();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: parsedUrl?.host || getEnv('DB_HOST', 'localhost'),
  port: parsedUrl?.port || parseInt(getEnv('DB_PORT', '5432'), 10),
  username: parsedUrl?.username || getEnv('DB_USERNAME', getEnv('DB_USER', 'postgres')),
  password: parsedUrl?.password || getEnv('DB_PASSWORD', 'postgres'),
  database: parsedUrl?.database || getEnv('DB_NAME', 'amazon'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: !isProduction, // Disable in production
  logging: isProduction ? ['error', 'warn'] : 'all',
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  extra: {
    // Connection pool settings
    max: 10, // Maximum number of connections in the pool
    connectionTimeoutMillis: 5000, // 5 seconds
    idleTimeoutMillis: 30000, // 30 seconds
  },
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: isProduction, // Auto-run migrations in production
};

// For TypeORM CLI
export default databaseConfig;
