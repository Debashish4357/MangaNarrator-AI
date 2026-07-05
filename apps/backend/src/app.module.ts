import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

import { HealthModule } from './modules/health/health.module';
import { MangaModule } from './modules/manga/manga.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { StoryModule } from './modules/story/story.module';
import { CharacterModule } from './modules/character/character.module';
import { ProgressModule } from './modules/progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MangaNarrator', {
              colors: true,
              appName: true,
            }),
          ),
        }),
      ],
    }),
    HealthModule,
    MangaModule,
    ChapterModule,
    StoryModule,
    CharacterModule,
    ProgressModule,
  ],
})
export class AppModule {}
