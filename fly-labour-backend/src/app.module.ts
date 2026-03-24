import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { JobsModule } from './modules/jobs/jobs.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { NewsModule } from './modules/news/news.module'

@Module({
  imports: [
    // Load .env tự động
    ConfigModule.forRoot({ isGlobal: true }),

    // Kết nối PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: cfg.get<number>('DB_PORT', 5432),
        username: cfg.get('DB_USERNAME', 'postgres'),
        password: cfg.get('DB_PASSWORD', '123456'),
        database: cfg.get('DB_NAME', 'fly_labour'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // synchronize: true tự tạo bảng khi dev (tắt khi production!)
        synchronize: cfg.get('NODE_ENV') !== 'production',
        logging: cfg.get('NODE_ENV') === 'development',
      }),
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
