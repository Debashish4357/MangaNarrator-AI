# Workspace Folder Structure Specification
## MangaNarrator AI: Production-Grade Simplified Project Architecture

| Attribute | Details |
| :--- | :--- |
| **Product Name** | MangaNarrator AI |
| **Document Version** | 1.2.0 |
| **Date** | June 19, 2026 |

---

## 1. Frontend Folder Structure (Next.js App Router)

```
manganarrator-frontend/
├── public/                  # Static assets
└── src/
    ├── app/                 # Page layouts and routers
    │   ├── layout.tsx       # Root layout configuration
    │   ├── page.tsx         # Dashboard landing page (Manga upload & index)
    │   └── manga/
    │       └── [id]/
    │           └── read/
    │               └── page.tsx # Narration player screen (Player + Chat Panel)
    ├── components/          # Reusable UI modules
    │   ├── ui/              # shadcn/ui base elements (button, dialog, input)
    │   │   ├── button.tsx
    │   │   ├── dialog.tsx
    │   │   ├── input.tsx
    │   │   └── progress.tsx
    │   └── features/        # Feature-specific components
    │       ├── upload/
    │       │   └── upload-dropzone.tsx
    │       ├── player/
    │       │   └── player-controls.tsx
    │       └── qa/
    │           └── qa-chat-panel.tsx
    ├── hooks/               # Custom React state hooks
    │   ├── use-audio.ts     # Speech synthesis execution wrapper
    │   └── use-auth.ts      # Authentication hook
    ├── lib/                 # Core utilities
    │   ├── api-client.ts    # Axios config
    │   └── utils.ts         # Generic utility helpers (cn)
    └── types/               # TypeScript schemas
        └── index.ts
```

---

## 2. Backend Folder Structure (NestJS & Prisma)

```
manganarrator-backend/
├── prisma/
│   └── schema.prisma        # Database model definitions
└── src/
    ├── app.module.ts        # Core root Application module registry
    ├── main.ts              # Entry bootstrap script
    ├── common/              # Global shared code
    │   ├── guards/          # Auth guards
    │   └── filters/         # HTTP exception filters
    ├── config/              # Configuration validation setup
    │   └── configuration.ts
    ├── modules/             # Domain feature modules
    │   ├── auth/            # Auth handling (Login, Registration, Token gen)
    │   │   ├── auth.module.ts
    │   │   ├── auth.controller.ts
    │   │   └── auth.service.ts
    │   ├── manga/           # Manga catalog & chapter index module
    │   │   ├── manga.module.ts
    │   │   ├── manga.controller.ts
    │   │   └── manga.service.ts
    │   ├── processor/       # Background parsing pipeline queue & workers
    │   │   ├── processor.module.ts
    │   │   ├── processor.service.ts
    │   │   └── chapter.processor.ts # BullMQ Queue Job consumer worker
    │   └── narration/       # Narration engine, QA, and continuation module
    │       ├── narration.module.ts
    │       ├── narration.controller.ts # start, continue, and question routes
    │       └── narration.service.ts
    └── prisma/              # Prisma client abstraction module
        ├── prisma.module.ts
        └── prisma.service.ts
```

---

## 3. Folder Purpose Explanations
* **`manganarrator-backend/src/modules/processor/`**: Manages background ingestion queue logic. Houses the file-system processors and Gemini vision execution calls.
* **`manganarrator-backend/src/modules/narration/`**: Core API router containing endpoints for:
  * `POST /story/start`
  * `POST /story/continue`
  * `POST /story/question`
* **`manganarrator-frontend/src/hooks/use-audio.ts`**: The client-side Text-to-Speech (TTS) executor utilizing either Web Speech API or simple backend voice synthesizers.
