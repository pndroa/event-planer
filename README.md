# 📅 Event Planner

This is a web-based event planning tool built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [Supabase](https://supabase.com/), and TypeScript.

The application can be run either locally or fully containerized via Docker.

---

## ✅ Local Setup (without Docker)

### Requirements

- Node.js (v18 or later recommended)
- npm or yarn
- Supabase or any PostgreSQL-compatible database
- A `.env` file with required environment variables  
  (see `.env.template` for reference)

### Installation

```bash
git clone https://github.com/pndroa/event-planer
cd event-planer/
npm install
npx prisma generate
```

### Running the App

```bash
npm run dev        # Development mode with hot reload
npm run build      # Build for production
npm start          # Start in production mode
```

### Admin Commands (Prisma)

- `npx prisma generate` – regenerate Prisma client
- `npx prisma migrate dev` – run development migrations
- `npx prisma migrate deploy` – apply production migrations
- `npx prisma studio` – open browser-based DB UI

---

## 🐳 Docker Setup

### Requirements

- Docker
- Docker Compose
- A valid `.env` file at the root of the project

### Notes

- Prisma requires OpenSSL to be installed inside the Docker image.  
  This is already handled in the `Dockerfile` with:

  ```Dockerfile
  RUN apt-get update && apt-get install -y openssl
  ```

- The app uses Supabase’s **IPv4-compatible session pooler** for database access _inside Docker_:

  ```
  postgresql://postgres.<project-id>:<password>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require
  ```

- **Outside of Docker**, the **IPv6-only session endpoint** must be used:
  ```
  postgresql://postgres:<password>@<project-id>:5432/postgres
  ```

### Usage

```bash
docker-compose up --build
```

To run Prisma commands inside the container:

```bash
docker-compose exec web npx prisma generate
docker-compose exec web npx prisma migrate deploy
docker-compose exec web npx prisma studio
```

To stop and clean up:

```bash
docker-compose down --volumes --remove-orphans
```

---

## 📁 Project Structure

- `.env.template` – placeholder for required secrets
- `Dockerfile` – production-ready with OpenSSL
- `docker-compose.yml` – container orchestration
- `prisma/` – schema and migration definitions
- `pages/`, `components/` – Next.js app source
- `README.md` – this file

---

📬 **Questions or feedback?**  
Feel free to open an issue or reach out.
