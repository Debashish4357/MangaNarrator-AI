# REST API Design Specification
## MangaNarrator AI: Core MVP Endpoints

| Attribute | Details |
| :--- | :--- |
| **Product Name** | MangaNarrator AI |
| **Document Version** | 1.2.0 |
| **Date** | June 19, 2026 |
| **Protocol** | HTTP/1.1 REST (JSON) |

---

## 1. Core Endpoints Overview

The application features five core endpoints to handle ingestion, analysis, narration, and question answering.

```
1. POST /api/manga/upload    --> Upload manga PDF files
2. POST /api/chapter/process  --> Trigger conversion & Gemini analysis
3. POST /api/story/start      --> Begin chapter narration & fetch first event
4. POST /api/story/continue   --> Fetch next event & update save offset
5. POST /api/story/question   --> Ask questions about historical chapter events
```

---

## 2. API Detail Specifications

### 2.1 Ingest PDF Chapters
* **Route:** `/api/manga/upload`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Request Body:**
  * `mangaTitle`: String (Required, name of manga)
  * `chapterNumber`: Number (Required)
  * `file`: File (Required, PDF only, max size 100MB)
* **Error Cases:**
  * `400 Bad Request`: Missing field or non-PDF file.
* **Example Request:**
  ```http
  POST /api/manga/upload HTTP/1.1
  Host: localhost:3000
  Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

  ------WebKitFormBoundary
  Content-Disposition: form-data; name="mangaTitle"

  One Punch Man
  ------WebKitFormBoundary
  Content-Disposition: form-data; name="chapterNumber"

  1
  ------WebKitFormBoundary
  Content-Disposition: form-data; name="file"; filename="opm_ch1.pdf"
  Content-Type: application/pdf

  [Raw PDF Data]
  ------WebKitFormBoundary--
  ```
* **Example Response (201 Created):**
  ```json
  {
    "success": true,
    "mangaId": "7d9b9c88-e9f7-4c8d-bcf8-fa47ea876a01",
    "chapterId": "2f6c8d11-c918-47ad-ba8d-bf8d4076ea01",
    "status": "PENDING"
  }
  ```

---

### 2.2 Process Chapter
* **Route:** `/api/chapter/process`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "chapterId": "2f6c8d11-c918-47ad-ba8d-bf8d4076ea01"
  }
  ```
* **Validation Rules:**
  * `chapterId`: UUID (Required)
* **Error Cases:**
  * `404 Not Found`: Chapter ID doesn't exist.
* **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "chapterId": "2f6c8d11-c918-47ad-ba8d-bf8d4076ea01",
    "status": "PROCESSING",
    "message": "Page conversion and Gemini processing job has been queued."
  }
  ```

---

### 2.3 Start Story Narration
* **Route:** `/api/story/start`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "chapterId": "2f6c8d11-c918-47ad-ba8d-bf8d4076ea01"
  }
  ```
* **Validation Rules:**
  * `chapterId`: UUID (Required)
* **Error Cases:**
  * `404 Not Found`: Chapter doesn't exist or is not fully processed yet.
* **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "chapterNumber": 1,
    "currentEvent": {
      "id": "c13b2e55-401d-4076-ba0d-be942ea76b02",
      "order": 1,
      "description": "Saitama leaves another failed job interview, walking down a quiet city street in a business suit."
    }
  }
  ```

---

### 2.4 Continue Story Narration
* **Route:** `/api/story/continue`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "chapterId": "2f6c8d11-c918-47ad-ba8d-bf8d4076ea01",
    "currentOrder": 1
  }
  ```
* **Validation Rules:**
  * `chapterId`: UUID (Required)
  * `currentOrder`: Integer (Required, updates the reading progress offset)
* **Error Cases:**
  * `404 Not Found`: Next event not found (reached end of chapter).
* **Example Response (200 OK):**
  ```json
  {
    "success": true,
    "nextEvent": {
      "id": "e63d4fa2-20c2-48df-ad06-bfde4fa9f029",
      "order": 2,
      "description": "A giant crab monster named Crablante appears, terrorizing pedestrians."
    }
  }
  ```

---

### 2.5 Ask Narrative Context Question
* **Route:** `/api/story/question`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "chapterId": "2f6c8d11-c918-47ad-ba8d-bf8d4076ea01",
    "currentOrder": 2,
    "question": "Why is the crab monster attacking?"
  }
  ```
* **Validation Rules:**
  * `chapterId`: UUID (Required)
  * `currentOrder`: Integer (Required, filters history up to this event order)
  * `question`: String (Required, non-empty)
* **Example Response (200 OK):**
  ```json
  {
    "answer": "Crablante mentions he transformed into a crab monster after eating too much crab, and is now seeking revenge on a chin-cleft kid who drew on him with a marker."
  }
  ```
