# Product Requirements Document (PRD)

## MangaNarrator AI: Simplified Multimodal Manga-to-Audio Experience

| Attribute            | Details                  |
| :------------------- | :----------------------- |
| **Product Name**     | MangaNarrator AI         |
| **Document Version** | 1.2.0                    |
| **Date**             | June 19, 2026            |
| **Status**           | Draft / Ready for Review |
| **Author**           | Antigravity AI           |

---

## 1. Product Vision

MangaNarrator AI is an interactive web platform designed to transform static manga chapters into an immersive, narrated story experience. By leveraging state-of-the-art multimodal AI, the application compiles page-level illustrations and dialogues into an expressive story narrative, allowing users to listen to their favorite manga chapters sequentially and interact with the narrator using text-based questions.

Our core focus is accessibility and convenience, making visual storytelling easily consumable for visually impaired individuals and readers who wish to enjoy manga in a hands-free format.

---

## 2. Problem Statement

Reading manga demands continuous visual attention, which limits multitasking and creates a barrier for visually impaired fans. Standard screen readers fail because:

- Manga layouts read from right-to-left and contain complex dialogue ordering.
- Visual-only background actions, environment context, and facial expressions are key to the plot but are invisible to non-visual players.

MangaNarrator AI solves this by converting raw pages into structured, sequenced story events using Multimodal Vision-Language Models (VLMs) and advanced OCR, generating a unified story script that is read aloud by a single narrator voice.

---

## 3. Story Event Structure (Core Foundation)

Every processed chapter is analyzed and compiled into a single structured JSON timeline layout that serves as the foundation for narration, playback bookmarks, and text Q&A:

```json
{
  "chapter": 1,
  "summary": "Saitama fights a giant crab monster, establishing his goal to become a hero.",
  "characters": ["Saitama", "Crablante"],
  "events": [
    {
      "order": 1,
      "title": "Saitama's Daily Life",
      "description": "Saitama leaves another failed job interview, walking down a quiet city street in a business suit."
    },
    {
      "order": 2,
      "title": "Monster Appears",
      "description": "A giant crab monster named Crablante appears, terrorizing pedestrians."
    }
  ]
}
```

This structure feeds directly into the narration engine and bounds the QA timeline context window, avoiding spoilers by limiting information scans to events matching `order <= currentOrder`.

---

## 4. User Personas

### Persona A: Hiroshi Sato (The Multitasking Enthusiast)

- **Goal:** Wants to upload a chapter PDF, start playing, and listen to the story while driving. He can type questions during pauses if he wants details on a specific scene.

### Persona B: Elena Rostova (The Visually Impaired Fan)

- **Goal:** Needs a clean, accessible layout that provides visual descriptions of characters and actions alongside dialogue, with an AI that answers questions about visual events happening in past chapters.

---

## 5. MVP Scope & Processing Pipeline

The system pipeline is strictly limited to the following architecture flow:

```
PDF Upload
    ↓
PDF → Images
    ↓
Gemini Vision (Page Summaries)
    ↓
Chapter Story Events Compilation
    ↓
PostgreSQL Database Migration
    ↓
Narration Engine (Single Narrator Voice)
    ↓
Question Engine (Context-Aware Text QA)
    ↓
Progress Tracking (Save Bookmarks)
```

---

## 6. Functional Requirements

### 6.1 Manga Upload & Image Extraction (FR-1)

- **Format Support:** PDF files up to 100MB/100 pages.
- **Extraction:** Automatically convert PDF pages to clean PNG images at 150 DPI in a background job.

### 6.2 Page-Level AI Processing & Event Generation (FR-2)

- **VLM Extraction:** For each page image, Gemini 2.5 Flash extracts:
  - Ordered dialogues (respecting right-to-left layout order).
  - A detailed scene summary (visual descriptions of characters, expressions, actions, and settings).
- **Story Compiler:** Sequences page summaries and dialogues into structured, chronological events (storing `order`, `title`, `description`).
- **No Panel Segmentation:** Panel coordinate parsing is out of scope. Gemini performs a unified page-level evaluation.

### 6.3 Narration Player (FR-3)

- Play/pause controls, progress bar, playback speed setting.
- Single Expressive Narrator voice reading the synthesized text containing descriptive cues and dialogues. No multi-voice cast assignment.

### 6.4 Interrupt & Text Q&A (FR-4)

- Manual interrupt button pauses the audio player.
- Text input interface allowing users to type questions (e.g. _"Who is Sasuke fighting?"_).
- Returns context-limited answers without reading future story events.

### 6.5 Resume Playback (FR-5)

- Save position bookmark (chapter ID, event ID) dynamically to database to enable continuation.

---

## 7. Out of Scope

The following features are strictly **Out of Scope** for the MVP:

- **Panel Segmentation:** Bounding box calculations are removed.
- **Multi-Voice Casting:** Differentiated voice actors or age/gender-cloned voices are removed.
- **Character Relationship Graphs:** Active status tracking of relationships (e.g., rivalries, friendships) is deferred.
- **Voice-Activated QA / Voice Interruption:** Voice wake words and speech-to-text input are removed (Text input only).
- **Animation & Video Generation.**
- **Social Systems or native mobile applications.**

---

## 8. Success Metrics

- **Processing Uptime:** Processing page images using Gemini successfully finishes without queue failures in $\ge$ 98.5% of cases.
- **Contextual Correctness:** AI answers to text questions verify correctly against database records without introducing future chapter details.
