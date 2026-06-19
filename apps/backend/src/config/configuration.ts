export default () => ({
  port: parseInt(process.env.PORT || "3001", 10),
  database: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/manga_narrator_db?schema=public",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
  },
});
