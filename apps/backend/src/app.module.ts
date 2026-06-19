import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import configuration from "./config/configuration";

// Feature modules
import { MangaModule } from "./modules/manga/manga.module";
import { ChapterModule } from "./modules/chapter/chapter.module";
import { StoryModule } from "./modules/story/story.module";
import { CharacterModule } from "./modules/character/character.module";
import { ProgressModule } from "./modules/progress/progress.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    MangaModule,
    ChapterModule,
    StoryModule,
    CharacterModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
