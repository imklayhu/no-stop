import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { BaiduMapService } from './services/baidu-map.service';
import { ScoringService } from './services/scoring.service';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [BaiduMapService, ScoringService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
