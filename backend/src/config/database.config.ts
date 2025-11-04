import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Helper function to get environment variable with default
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue as string;
}

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: getEnv('DB_HOST', 'localhost'),
  port: parseInt(getEnv('DB_PORT', '5432'), 10),
  username: getEnv('DB_USERNAME', getEnv('DB_USER', 'postgres')),
  password: getEnv('DB_PASSWORD', 'postgres'),
  database: getEnv('DB_NAME', 'amazon'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: getEnv('NODE_ENV', 'development') !== 'production',
  ssl: getEnv('NODE_ENV', 'development') === 'production' ? { rejectUnauthorized: false } : false,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
};

// For TypeORM CLI
export default databaseConfig;
