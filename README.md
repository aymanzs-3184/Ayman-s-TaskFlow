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
| Containerisation | Docker, Docker Compose |

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
Ayman's-TaskFlow/
├── docker-compose.yml                        # Runs the full stack in Docker
├── .env                                      # Your local environment variables (gitignored)
├── .env.example                              # Template showing required variables
├── psr stack backend/
│   └── api/
│       ├── Dockerfile                        # Multi-stage Spring Boot image
│       ├── src/main/java/com/taskflow/api/
│       │   ├── controller/                   # REST controllers
│       │   ├── service/                      # Business logic
│       │   ├── repository/                   # JPA repositories
│       │   ├── model/                        # JPA entities
│       │   ├── dto/                          # Data transfer objects
│       │   └── security/                     # JWT auth filter and config
│       └── src/main/resources/
│           └── application.properties        # Uses environment variable placeholders
└── psr stack frontend/
    └── tutorial-task-manager/
        ├── Dockerfile                        # Multi-stage React + nginx image
        ├── nginx.conf                        # React Router config for nginx
        └── src/
            ├── api/                          # Axios instance and service files
            ├── components/                   # Reusable UI components
            ├── context/                      # Auth context
            └── pages/                        # Board, Tasks, and Team pages
```

---

## Running with Docker (Recommended)

This is the easiest way to run the full stack. Docker handles the database, backend, and frontend for you.

### Prerequisites

- **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

### 1. Clone the repository

```bash
git clone https://github.com/aymanzs-3184/Ayman-s-TaskFlow.git
cd "Ayman's-TaskFlow"
```

### 2. Create your environment file

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Open `.env` and set your values:

```env
SPRING_DATASOURCE_USERNAME=taskflow_user
SPRING_DATASOURCE_PASSWORD=choose_a_strong_password
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
VITE_API_URL=http://localhost:8080
```

> The JWT secret must be a hex string of at least 64 characters. You can generate one at [codebeautify.org/generate-random-string](https://codebeautify.org/generate-random-string).

### 3. Start the full stack

```bash
docker compose up --build
```

Docker will:
- Pull and start a PostgreSQL 16 container
- Build and start the Spring Boot API container
- Build and start the React frontend container (served by nginx)

The first build takes a few minutes while Maven downloads dependencies and npm installs packages. Subsequent starts are much faster.

### 4. Open the app

| Service | URL |
|---|---|
| Frontend (React) | http://localhost |
| Backend (Spring Boot API) | http://localhost:8080 |

Register an account and start creating tasks.

### Stopping the stack

```bash
# Stop containers but keep data
docker compose down

# Stop containers and delete all data (wipes the database)
docker compose down -v
```

### Rebuilding after code changes

```bash
# Rebuild everything
docker compose up --build

# Rebuild only the backend
docker compose build --no-cache api
docker compose up
```

---

## Running Locally Without Docker

Use this approach if you want to run the app directly during development without building Docker images.

### Prerequisites

- **Java 21** — [adoptium.net](https://adoptium.net)
- **Maven 3.9+** — [maven.apache.org](https://maven.apache.org)
- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **PostgreSQL 16** — [postgresql.org](https://www.postgresql.org)
- **pgAdmin** (optional but recommended) — [pgadmin.org](https://www.pgadmin.org)

### 1. Create the PostgreSQL database

Open pgAdmin or psql and run:

```sql
CREATE USER taskflow_user WITH PASSWORD 'yourpassword';
CREATE DATABASE taskflowdb;
GRANT ALL PRIVILEGES ON DATABASE taskflowdb TO taskflow_user;
GRANT ALL ON SCHEMA public TO taskflow_user;
```

### 2. Configure application.properties

Create `psr stack backend/api/src/main/resources/application-local.properties`:

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taskflowdb
SPRING_DATASOURCE_USERNAME=taskflow_user
SPRING_DATASOURCE_PASSWORD=yourpassword
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
```

Then activate the local profile in IntelliJ: **Run → Edit Configurations → Environment variables** and add:

```
SPRING_PROFILES_ACTIVE=local
```

> This file is gitignored and should never be committed.

### 3. Run the backend

```bash
cd "psr stack backend/api"
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### 4. Set up the frontend

```bash
cd "psr stack frontend/tutorial-task-manager"
npm install
```

Create `psr stack frontend/tutorial-task-manager/.env.development`:

```
VITE_API_URL=http://localhost:8080
```

### 5. Start the frontend

```bash
npm run dev
```

The app is available at `http://localhost:5173`.

---

## Environment Variables Reference

These variables are required in your `.env` file (Docker) or local properties file (manual setup).

| Variable | Description | Example |
|---|---|---|
| `SPRING_DATASOURCE_USERNAME` | PostgreSQL username | `taskflow_user` |
| `SPRING_DATASOURCE_PASSWORD` | PostgreSQL password | `mypassword` |
| `JWT_SECRET` | Hex string used to sign JWT tokens | 64-char hex string |
| `JWT_EXPIRATION` | Token expiry in milliseconds | `86400000` (24 hours) |
| `VITE_API_URL` | API base URL for the frontend | `http://localhost:8080` |

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

**Docker — frontend shows blank page after login**

Check that `VITE_API_URL` in your `.env` file matches the address your browser uses to reach the API. For local Docker it should be `http://localhost:8080`.

**Docker — API container exits immediately**

Check the API logs for the error:
```bash
docker compose logs api
```
The most common cause is a missing or malformed environment variable in `.env`.

---

## Author

Built by Ayman Zuhair Shashavali, a final year Computer Science student at Monash University, as a personal learning project to strengthen full-stack development skills across React, Spring Boot, and PostgreSQL.