import { Module, Logger } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { JobsModule } from './modules/jobs/jobs.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { NewsModule } from './modules/news/news.module'
import { join } from 'path'

const logger = new Logger('TypeORM')

const CONNECTION_TIMEOUT_MS = 60_000

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const databaseUrl = cfg.get<string>('DATABASE_URL');
        const nodeEnv = cfg.get<string>('NODE_ENV', 'development');
        const isProduction = nodeEnv !== 'development';

        const configPromise = new Promise<any>((resolve, reject) => {
          logger.log('⏳ Attempting database connection...')

          const timeout = setTimeout(() => {
            const err = new Error(
              `Database connection factory timed out after ${CONNECTION_TIMEOUT_MS / 1000}s — ` +
              'the app will not hang indefinitely. Check DATABASE_URL and network reachability.',
            )
            logger.error(`❌ ${err.message}`)
            reject(err)
          }, CONNECTION_TIMEOUT_MS)

          try {
            if (databaseUrl) {
              clearTimeout(timeout)
              logger.log('✅ DATABASE_URL found — resolving TypeORM config (postgres/ssl)')
              resolve({
                type: 'postgres',
                url: databaseUrl,
                // Railway: Cần SSL cho external URL, nội bộ (.internal) đôi khi cũng cần tùy version
                ssl: { rejectUnauthorized: false },
                entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
                synchronize: true,
                logging: !isProduction,
                retryAttempts: 5,
                retryDelay: 3000,
                connectTimeoutMS: 30000,
                extra: {
                  max: 20,
                  connectionTimeoutMillis: 30000,
                  idleTimeoutMillis: 30000,
                  statement_timeout: 30000,
                },
              })
            } else {
              clearTimeout(timeout)
              // Cấu hình fallback cho Local (Docker/Localhost)
              logger.log('⚠️  DATABASE_URL not set — falling back to individual DB_* env vars')
              resolve({
                type: 'postgres',
                host: cfg.get<string>('DB_HOST', 'localhost'),
                port: cfg.get<number>('DB_PORT', 5432),
                username: cfg.get<string>('DB_USERNAME', 'postgres'),
                password: cfg.get<string>('DB_PASSWORD', '123456'),
                database: cfg.get<string>('DB_NAME', 'fly_labour'),
                entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
                synchronize: true,
                logging: true,
                retryAttempts: 5,
                retryDelay: 3000,
                connectTimeoutMS: 30000,
              })
            }
          } catch (err) {
            clearTimeout(timeout)
            logger.error('❌ Unexpected error while building TypeORM config:', err)
            reject(err)
          }
        })

        return configPromise
      },
    }),

    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    CategoriesModule,
    NewsModule,
  ],
})
export class AppModule {}