# Development Roadmap & Implementation Plan
## MangaNarrator AI: Simplified Step-by-Step Milestones

| Attribute | Details |
| :--- | :--- |
| **Product Name** | MangaNarrator AI |
| **Target Audience** | Intermediate Full-Stack Developers |
| **Monorepo Style** | Independent Frontend (Next.js) & Backend (NestJS) |
| **Estimated Total Time**| ~3 - 4 Weeks (approx. 100 - 120 hours) |

---

## Simplified 5-Phase MVP Roadmap

```
[Phase 1: Ingestion & Analysis]
        ↓
[Phase 2: Story Graph Compilation]
        ↓
[Phase 3: Narration Engine]
        ↓
[Phase 4: Text-Based Q&A]
        ↓
[Phase 5: Continue Story (Progress Sync)]
```

---

## Phase Breakdown & Milestones

### Phase 1: Ingestion & Analysis (PDF Upload & Page extraction)
* **Goal:** Initialize workspace, build the PDF upload flow, convert pages to PNG, and invoke Gemini 2.5 Flash for page-level analysis.
* **Tasks:**
  * Initialize Next.js App Router (Tailwind CSS, shadcn/ui) and NestJS (Prisma ORM, PostgreSQL).
  * Build uploader widget and write backend file uploader (`POST /api/manga/upload`).
  * Process PDFs in a background worker (BullMQ) to extract pages as 150 DPI PNGs.
  * Integrate Gemini 2.5 Flash SDK and construct page-level prompts to retrieve ordered dialogues and detailed scene summaries (no panel segmentation).
* **Deliverables:**
  * Uploaded and processed PDF directories with visual page files.
  * Successful database metadata entries for Manga and Chapters.
* **Estimated Time:** 25 Hours.

---

### Phase 2: Story Graph Compilation (Events & Relationships)
* **Goal:** Parse Gemini payloads into sequential story events and link character/relationship entities.
* **Tasks:**
  * Define Prisma Models matching the Story Event Graph structure (`StoryEvent`, `Character`, `CharacterRelationship`, `CharacterMention`).
  * Parse Gemini analysis responses, map characters, and create bidirectional relationships.
  * Compile and write sequential, sorted `StoryEvent` records into PostgreSQL.
* **Deliverables:**
  * Populated database tables storing sequential story timelines and linked entities.
  * Status checker API endpoints.
* **Estimated Time:** 20 Hours.

---

### Phase 3: Narration Engine
* **Goal:** Render narrative prose and stream single-narrator TTS to the user.
* **Tasks:**
  * REST API: `POST /api/story/start` and `POST /api/story/continue` serving event data.
  * Integrate Text-to-Speech (using browser Web Speech API or simple ElevenLabs backend adapter).
  * Construct Client UI featuring Play, Pause, Speed controls, and active dialogue text boxes.
* **Deliverables:**
  * Working audio narration player reading description text and dialouge back to the user.
* **Estimated Time:** 20 Hours.

---

### Phase 4: Text-Based Q&A (Story Memory)
* **Goal:** Enable user interruptions to ask questions regarding the story without spoiling future events.
* **Tasks:**
  * Floating Chat panel interface beside the main audio narrator controls.
  * REST API: `POST /api/story/question` taking `currentEventId` and the query.
  * Construct context compiler filtering out all events after `currentEventId` to keep QA strictly spoil-free.
  * Execute Gemini QA prompts and stream answers back.
* **Deliverables:**
  * Working text-input chat widget returning context-accurate, spoiler-free replies.
* **Estimated Time:** 20 Hours.

---

### Phase 5: Continue Story (Progress Sync)
* **Goal:** Keep cross-device bookmark position data synchronized.
* **Tasks:**
  * REST API: `GET /api/progress` and `POST /api/progress/save` storing event offsets and audio seconds.
  * Add throttled client progress hooks saving offsets to the API.
  * Build resume controls on the user dashboard.
* **Deliverables:**
  * Automatic synchronization, letting readers close the player and resume seamlessly.
* **Estimated Time:** 15 Hours.
