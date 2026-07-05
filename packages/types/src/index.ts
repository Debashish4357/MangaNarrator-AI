export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Manga {
  id: string;
  title: string;
}

export interface Chapter {
  id: string;
  mangaId: string;
  chapterNumber: number;
  title?: string;
  pdfPath: string;
  status: string;
}

export interface StoryEvent {
  id: string;
  chapterId: string;
  eventOrder: number;
  title: string;
  description: string;
}

export interface Character {
  id: string;
  mangaId: string;
  name: string;
  description?: string;
}

export interface StoryProgress {
  id: string;
  userId: string;
  mangaId: string;
  chapterId: string;
  eventId: string;
}
