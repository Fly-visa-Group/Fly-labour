import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'

const logger = new Logger('Bootstrap')

async function bootstrap() {
  let app: NestExpressApplication

  try {
    app = await NestFactory.create<NestExpressApplication>(AppModule)
  } catch (err) {
    console.error('❌ Failed to initialize application (database connection error):', err)
    process.exit(1)
  }

  // CORS — cho phép frontend localhost (dev) và production domains
  const frontendUrl = process.env.FRONTEND_URL
  if (!frontendUrl) logger.warn('FRONTEND_URL not set — production CORS may be too permissive')

  const allowedOrigins = [
    // Dev
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    // Mobile dev (Expo)
    'http://localhost:8081',
    'http://localhost:8082',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:8082',
    // Production
    'https://flylabour.up.railway.app',
    'https://flyimmigration.vn',
    'https://www.flyimmigration.vn',
    frontendUrl,
  ].filter(Boolean) as string[]

  app!.enableCors({
    origin: (origin, callback) => {
      // Mobile app (React Native) không gửi Origin header → cho qua
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`Origin ${origin} not allowed`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  })

  // Tự động validate DTO
  app!.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }))

  // Serve ảnh upload tĩnh tại /uploads/...
  app!.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' })

  // Swagger API docs tại /api
  const config = new DocumentBuilder()
    .setTitle('🦅 Fly Labour API')
    .setDescription('API tuyển dụng lao động quốc tế — Úc · Canada · New Zealand')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build()
  SwaggerModule.setup('api', app!, SwaggerModule.createDocument(app!, config))

  app!.getHttpAdapter().get('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  const port = process.env.PORT || 3000
  await app!.listen(port, '0.0.0.0')

  console.log('\n🦅 ================================')
  console.log(`🚀 Backend:  http://localhost:${port}`)
  console.log(`📖 API Docs: http://localhost:${port}/api`)
  console.log(`🖼️  Uploads:  http://localhost:${port}/uploads`)
  console.log('🦅 ================================\n')
}
bootstrap()
