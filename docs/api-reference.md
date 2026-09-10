# Lanjut Headless Export API Reference

Lanjut provides a headless HTTP API to validate, migrate, and render resumes into pixel-perfect, ATS-compliant formats (**PDF**, **Word .docx**, **Markdown .md**, **Plain Text .txt**, **JSON**, and **YAML**).

---

## 1. Overview

- **Base URL (Local)**: `http://localhost:3000`
- **Server Runtime**: Node.js
- **Authentication**: None (Designed for local AI agents, CLI scripts, and local-first automation)
- **Data Privacy**: All rendering is stateless and processed in-memory. No resume data is stored on any server.

---

## 2. Endpoints

### 2.1. Dedicated PDF Exporter: `POST /api/export/pdf`

Renders and returns a binary PDF stream for the given template and resume data.

* **Method**: `POST`
* **Path**: `/api/export/pdf`
* **Headers**: `Content-Type: application/json`
* **Response**: `200 OK` (`Content-Type: application/pdf`)

#### Request Body Schema

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `template` | `string` | No | `"awal"` | Template style: `"awal"`, `"ketat"`, `"luasa"`, `"tebal"`, `"klasik"`, `"ketik"`. |
| `fileName` | `string` | No | `resume.title` | Base file name for the `Content-Disposition` header. |
| `resume` | `object` | **Yes** | — | The full Resume JSON object. |

---

### 2.2. Multi-Format Exporter: `POST /api/export`

Renders and returns the resume in any supported output format.

* **Method**: `POST`
* **Path**: `/api/export`
* **Headers**: `Content-Type: application/json`

#### Request Body Schema

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `format` | `string` | No | `"pdf"` | Output format: `"pdf"`, `"docx"`, `"md"`, `"txt"`, `"json"`, `"yaml"`. |
| `template` | `string` | No | `"awal"` | Template style (used primarily for PDF styling). |
| `fileName` | `string` | No | `resume.title` | Base file name for `Content-Disposition`. |
| `resume` | `object` | **Yes** | — | The full Resume JSON object. |

#### Supported Formats & MIME Types

| Format | Content-Type | Output |
| :--- | :--- | :--- |
| `pdf` | `application/pdf` | Binary ATS-validated PDF |
| `docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Binary Microsoft Word `.docx` |
| `md` | `text/markdown; charset=utf-8` | GitHub-Flavored Markdown with contact icons & links |
| `txt` | `text/plain; charset=utf-8` | Clean linear plain text |
| `json` | `application/json; charset=utf-8` | Formatted Resume JSON (migrated to latest schema) |
| `yaml` | `application/x-yaml; charset=utf-8` | Formatted Resume YAML |

---

## 3. Template Catalog

| Template ID | Style & Character |
| :--- | :--- |
| `awal` | Clean single-column starter with modern sans-serif typography |
| `ketat` | Compact classic serif with ruled headers and italic dates |
| `luasa` | Airy minimalist layout with generous margins and letterspaced headers |
| `tebal` | Bold modern statement with oversized name and heavy uppercase headings |
| `klasik` | Traditional all-serif CV (centered, formal, academic) |
| `ketik` | Technical typewriter-inspired layout for software engineers |

---

## 4. Code Examples

### 4.1. cURL (Bash)

```bash
# Export PDF with Ketat template
curl -X POST http://localhost:3000/api/export/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "template": "ketat",
    "fileName": "John-Doe-Resume",
    "resume": '"$(cat my-resume.json)"'
  }' \
  --output John-Doe-Resume.pdf
```

```bash
# Export Markdown (.md)
curl -X POST http://localhost:3000/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "format": "md",
    "resume": '"$(cat my-resume.json)"'
  }' \
  --output resume.md
```

---

### 4.2. Python (Automation & AI Pipelines)

```python
import requests
import json

# 1. Load your master or tailored resume JSON
with open("my-resume.json", "r") as f:
    resume_data = json.load(f)

# 2. Call the export API
response = requests.post(
    "http://localhost:3000/api/export",
    json={
        "format": "pdf",        # "pdf", "docx", "md", "txt"
        "template": "awal",     # "awal", "ketat", "luasa", "tebal", "klasik", "ketik"
        "fileName": "Stripe-Senior-Frontend",
        "resume": resume_data
    }
)

# 3. Save the binary or text response
if response.status_code == 200:
    with open("Stripe-Senior-Frontend.pdf", "wb") as f:
        f.write(response.content)
    print("✓ PDF exported successfully!")
else:
    print(f"Error ({response.status_code}):", response.json())
```

---

### 4.3. TypeScript / Node.js

```typescript
import fs from "node:fs";

async function exportResume(jsonPath: string, format: string, template: string) {
  const resume = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const res = await fetch("http://localhost:3000/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ format, template, resume }),
  });

  if (!res.ok) {
    throw new Error(`Export failed: ${await res.text()}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`output.${format}`, buffer);
  console.log(`✓ Saved output.${format}`);
}

exportResume("./my-resume.json", "pdf", "ketat");
```

---

## 5. Resume JSON Data Schema

Below is the minimal valid schema structure expected by the API.

```json
{
  "schemaVersion": 6,
  "title": "Senior Frontend Engineer",
  "templateId": "awal",
  "language": "en",
  "showIcons": true,
  "sectionSpacing": 0,
  "letterSpacing": 0,
  "header": {
    "fields": {
      "firstName": { "kind": "plain", "value": "John" },
      "lastName": { "kind": "plain", "value": "Doe" },
      "jobTitle": { "kind": "plain", "value": "Senior Frontend Engineer" },
      "email": { "kind": "plain", "value": "john.doe@example.com" },
      "phone": { "kind": "plain", "value": "+1 555 010 1234" },
      "website": { "kind": "plain", "value": "johndoe.dev" },
      "linkedin": { "kind": "plain", "value": "linkedin.com/in/johndoe" },
      "github": { "kind": "plain", "value": "github.com/johndoe" },
      "link": { "kind": "plain", "value": "" },
      "city": { "kind": "plain", "value": "San Francisco" },
      "province": { "kind": "plain", "value": "California" },
      "country": { "kind": "plain", "value": "United States" }
    }
  },
  "sections": [
    {
      "id": "summary-sec",
      "type": "summary",
      "title": "Summary",
      "entries": [
        {
          "id": "sum-1",
          "fields": {
            "body": {
              "kind": "richtext",
              "value": {
                "type": "doc",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      { "type": "text", "text": "Senior frontend engineer with " },
                      { "type": "text", "text": "8+ years", "marks": [{ "type": "bold" }] },
                      { "type": "text", "text": " of production experience..." }
                    ]
                  }
                ]
              }
            }
          }
        }
      ]
    },
    {
      "id": "exp-sec",
      "type": "experience",
      "title": "Experience",
      "entries": [
        {
          "id": "exp-1",
          "fields": {
            "title": { "kind": "plain", "value": "Senior Frontend Engineer" },
            "company": { "kind": "plain", "value": "Acme Corp" },
            "location": { "kind": "plain", "value": "San Francisco, CA" },
            "website": { "kind": "plain", "value": "acme.example.com" },
            "startDate": { "kind": "plain", "value": "Mar 2022" },
            "endDate": { "kind": "plain", "value": "Present" },
            "description": {
              "kind": "richtext",
              "value": {
                "type": "doc",
                "content": [
                  {
                    "type": "bulletList",
                    "content": [
                      {
                        "type": "listItem",
                        "content": [
                          {
                            "type": "paragraph",
                            "content": [
                              { "type": "text", "text": "Led migration of design system, cutting UI defects by " },
                              { "type": "text", "text": "40%", "marks": [{ "type": "bold" }] },
                              { "type": "text", "text": "." }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      ]
    },
    {
      "id": "skills-sec",
      "type": "skills",
      "title": "Skills",
      "columns": 2,
      "showProficiency": true,
      "entries": [
        {
          "id": "sk-1",
          "fields": {
            "name": { "kind": "plain", "value": "TypeScript" },
            "level": { "kind": "plain", "value": "Expert" }
          }
        },
        {
          "id": "sk-2",
          "fields": {
            "name": { "kind": "plain", "value": "React & Next.js" },
            "level": { "kind": "plain", "value": "Expert" }
          }
        }
      ]
    }
  ]
}
```

---

## 6. Error Handling

When a request cannot be processed, the API responds with standard HTTP status codes and a JSON error payload:

| Status Code | Description | Example Response |
| :--- | :--- | :--- |
| `400 Bad Request` | Missing or invalid `resume` body object | `{"error": "Invalid request payload: 'resume' object is required."}` |
| `422 Unprocessable Entity` | Schema parsing or migration error | `{"error": "Failed to export resume", "message": "..."}` |
| `500 Internal Server Error` | Unexpected render failure | `{"error": "Failed to export resume", "message": "..."}` |

