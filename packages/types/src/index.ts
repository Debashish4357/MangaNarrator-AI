export interface MangaDto {
  id: string;
  title: string;
  description?: string;
}

export interface ChapterDto {
  id: string;
  mangaId: string;
  chapterNumber: number;
  title?: string;
  pdfPath: string;
  status: string;
}

export interface StoryEventDto {
  id: string;
  chapterId: string;
  eventOrder: number;
  title: string;
  description: string;
}

export interface CharacterDto {
  id: string;
  mangaId: string;
  name: string;
  description?: string;
}

export interface StoryProgressDto {
  id: string;
  userId: string;
  mangaId: string;
  chapterId: string;
  eventId: string;
}

export interface ChapterStoryEventsPayload {
  chapter: number;
  summary: string;
  characters: string[];
  events: {
    order: number;
    title: string;
    description: string;
  }[];
}
