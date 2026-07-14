# TaskFlow

TaskFlow is a full-stack task management application I built to reinforce my skills in React, Spring Boot, and PostgreSQL. I developed it as a structured learning project guided by AI tutoring through Claude, working through each layer of the stack from React fundamentals and Tailwind styling through to Spring Security, JWT authentication, and PostgreSQL with JPA. It is a Kanban-style project management tool where users can create tasks, assign them to team members, and track progress across columns with drag and drop support.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS v4, React Router, Axios |
| Backend | Spring Boot 3, Spring Security, JWT Authentication |
| Database | PostgreSQL 16 |
| Drag and Drop | @dnd-kit/core |
| Build Tools | Vite (frontend), Maven (backend) |

---

## Features

- JWT-based authentication with register, login, and logout
- Kanban board with drag and drop between columns
- Create tasks with title, description, priority, and assignee
- My Tasks page showing tasks assigned to the logged-in user
- Team page showing all users with task counts by status
- Status colour coding that updates when cards are moved between columns
- Automatic redirect to login when the session expires

---

## Project Structure

```
psr stack project/
├── psr stack backend/
│   └── api/                         # Spring Boot application
│       ├── src/main/java/com/taskflow/api/
│       │   ├── controller/          # REST controllers
│       │   ├── service/             # Business logic
│       │   ├── repository/          # JPA repositories
│       │   ├── model/               # JPA entities
│       │   ├── dto/                 # Data transfer objects
│       │   └── security/            # JWT auth filter and config
│       └── src/main/resources/
│           └── application.properties
└── psr stack frontend/
    └── tutorial-task-manager/       # React application
        └── src/
            ├── api/                 # Axios instance and service files
            ├── components/          # Reusable UI components
            ├── context/             # Auth context
            └── pages/               # Board, Tasks, and Team pages
```

---

## Prerequisites

Make sure you have the following installed before running the project:

- **Java 21** — [adoptium.net](https://adoptium.net)
- **Maven 3.9+** — [maven.apache.org](https://maven.apache.org)
- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **PostgreSQL 16** — [postgresql.org](https://www.postgresql.org)
- **pgAdmin** (optional but recommended) — [pgadmin.org](https://www.pgadmin.org)

---

## Backend Setup

### 1. Create the PostgreSQL database

Open pgAdmin or psql and run:

```sql
CREATE USER taskflow_user WITH PASSWORD 'yourpassword';
CREATE DATABASE taskflowdb;
GRANT ALL PRIVILEGES ON DATABASE taskflowdb TO taskflow_user;
GRANT ALL ON SCHEMA public TO taskflow_user;
```

### 2. Configure application.properties

Create `psr stack backend/api/src/main/resources/application.properties`:

```properties
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/taskflowdb
spring.datasource.username=taskflow_user
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.open-in-view=false

jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

> Replace `yourpassword` with the password you set in step 1. This file is gitignored and should never be committed.

### 3. Run the backend

```bash
cd "psr stack backend/api"
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`.

### 4. Verify it is running

Open Postman and send:

```
POST http://localhost:8080/api/auth/register
Body (JSON):
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "password123"
}
```

You should receive a JWT token in the response.

---

## Frontend Setup

### 1. Install dependencies

```bash
cd "psr stack frontend/tutorial-task-manager"
npm install
```

### 2. Create the environment file

Create `psr stack frontend/tutorial-task-manager/.env.development`:

```
VITE_API_URL=http://localhost:8080
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Running the Full Application

1. Start PostgreSQL (if not already running)
2. Start the Spring Boot backend with `./mvnw spring-boot:run`
3. Start the React frontend with `npm run dev`
4. Open `http://localhost:5173` in your browser
5. Register an account and start creating tasks

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive a JWT | No |
| GET | `/api/tasks` | Get all tasks (paginated) | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PATCH | `/api/tasks/:id/status` | Update task status | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |
| GET | `/api/tasks/my` | Get tasks assigned to me | Yes |
| GET | `/api/users` | Get all users with task counts | Yes |

---

## Common Issues

**CORS error on PATCH requests**

Make sure `PATCH` is included in the allowed methods in `SecurityConfig.java`:
```java
config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
```

**403 on all endpoints after restarting the server**

The JWT token has expired or been invalidated. Log out by clearing localStorage and log back in to get a fresh token.

**PostgreSQL permission denied for schema public**

Run this in pgAdmin:
```sql
GRANT ALL ON SCHEMA public TO taskflow_user;
```

**Port 8080 already in use**

Another process is using the port. Either stop it or change `server.port` in `application.properties`.

---

## Author

Built by Ayman as a personal learning project to strengthen my full-stack development skills across React, Spring Boot, and PostgreSQL.
