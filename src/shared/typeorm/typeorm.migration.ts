import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

//inside your starter code, do this
dotenv.config();

const typeOrmConfig = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  migrationsTableName: 'typeorm_migrations',
  logger: 'file',
  synchronize: false,
});

typeOrmConfig
  .initialize()
  .then(() => {
    console.log('Data source has been initialized');
  })
  .catch((err) => {
    console.log('Error: ', err);
  });

export default typeOrmConfig;
