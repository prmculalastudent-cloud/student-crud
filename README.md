# Student Management System (Full-Stack CRUD)

A full-stack Student CRUD application featuring a **Spring Boot** REST API backend with **PostgreSQL** persistence and a **Vite + React (JavaScript) + Tailwind CSS** frontend, fully prepared for deployment on **Render.com**.

---

## Project Structure

```text
├── render.yaml          # Render Blueprint specification (Backend, Frontend & Database)
├── student/             # Spring Boot REST API Backend
│   ├── Dockerfile       # Multi-stage Docker build for Java 21
│   ├── .dockerignore
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/culala/student/
│           │   ├── Student.java               # Entity
│           │   ├── StudentRepository.java     # JPA Repository
│           │   ├── StudentController.java     # REST Controller (@CrossOrigin enabled)
│           │   └── StudentApplication.java    # Application Entry
│           └── resources/application.properties # Dynamic datasource for Render & Local
│
└── student-frontend/    # Vite + React + Tailwind CSS Frontend
    ├── index.html
    ├── vite.config.js   # Vite server & API proxy (/api -> :8080)
    ├── package.json
    └── src/
        ├── services/studentService.js         # API client with VITE_API_BASE_URL support
        ├── components/
        │   ├── Navbar.jsx                     # Top branding & status
        │   ├── StudentForm.jsx                # Inline Add/Edit Form
        │   ├── StudentTable.jsx               # Table with search & inline delete
        │   └── Toast.jsx                      # Alert notifications
        ├── App.jsx                            # Core application state
        └── main.jsx
```

---

## API Endpoints (`/culala/students`)

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/culala/students` | Get all student records |
| **GET** | `/culala/students/{id}` | Get student by ID |
| **POST** | `/culala/students` | Create a new student |
| **PUT** | `/culala/students/{id}` | Update an existing student |
| **DELETE** | `/culala/students/{id}` | Delete a student |

### Student Entity Fields
* `id` (Integer)
* `firstname` (String)
* `lastname` (String)
* `course` (String)
* `section` (String)

---

## Local Development

### 1. Backend Setup
1. Ensure PostgreSQL is running with database `db_user`.
2. Navigate to `student/`:
   ```bash
   cd student
   ./mvnw spring-boot:run
   ```
3. Backend runs at `http://localhost:8080`.

### 2. Frontend Setup
1. Navigate to `student-frontend/`:
   ```bash
   cd student-frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.

---

## Deployment to Render.com (Blueprint)

This repository includes a [`render.yaml`](./render.yaml) file to automatically provision:
1. **Managed PostgreSQL Database**: `student-db` (db name: `db_student`)
2. **Spring Boot Backend**: `student-backend` (built using `student/Dockerfile`)
3. **Static Frontend**: `student-frontend` (built using `student-frontend/dist`)

### Steps to Deploy:
1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository: `https://github.com/prmculalastudent-cloud/student-crud`.
4. Render will detect `render.yaml` and display all 3 resources to provision.
5. Click **Apply** to deploy the database, backend, and frontend.
