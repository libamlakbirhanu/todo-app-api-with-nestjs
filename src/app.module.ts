import { Module } from '@nestjs/common';
import { TaskModule } from './modules/task.module';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { DatabaseModule } from './modules/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TaskModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
})
export class AppModule {}
