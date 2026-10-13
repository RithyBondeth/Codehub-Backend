<div align="center">

# Codehub — Backend

**The backend API for Codehub, a freelance portfolio platform with courses, articles, comments, and messaging.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## Overview

Codehub Backend powers Codehub, a freelance portfolio website. It manages the site's content (services, technologies, works, vision, courses, and articles) and its community features (users, comments, and messages), with local and social authentication.

## Features

- **Authentication:** sign-up, sign-in, and forgot and reset password by email, plus social login with Google, GitHub, and Facebook.
- **Portfolio content:** services, technologies, works (projects), and vision statements.
- **Learning content:** courses and articles, with filtering.
- **Community:** comments and contact messages.
- **User management:** filtering, counts, and role-based guards.
- **File uploads** served as static files.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL, TypeORM |
| Authentication | Passport (JWT, Google, GitHub, Facebook), bcrypt |
| Email | Nodemailer |
| Uploads | Multer, `@nestjs/serve-static` |

## Getting Started

### Prerequisites

- Node.js and npm
- A PostgreSQL database

### Installation

```bash
git clone https://github.com/RithyBondeth/Codehub-Backend.git
cd Codehub-Backend
npm install
npm run start:dev
```

The API is served under `/api`.

### Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL`, `DATABASE_PORT`, `SYNCHRONIZE` | PostgreSQL connection |
| `JWT_SECRET`, `JWT_EXPIRE_IN` | Token signing |
| `EMAIL_USER`, `EMAIL_PASSWORD` | Password-reset email |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Google login |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL` | GitHub login |
| `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, `FACEBOOK_CALLBACK_URL` | Facebook login |
| `PORT` | Server port |

## Project Structure

```text
Codehub-Backend/
└── src/
    ├── auth/                  # Local and social auth, guards, strategies
    ├── user/
    ├── service/  technology/  work/  vision/
    ├── course/  article/  comment/  message/
    ├── uploadfile/            # File uploads
    ├── entities/              # TypeORM entities
    └── config/                # Database and JWT configuration
```

## Related Repositories

- [Codehub-Frontend](https://github.com/RithyBondeth/Codehub-Frontend): the React portfolio website

## Author

**Rithy Bondeth** — Full Stack Developer & AI Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-0A0A0A?style=for-the-badge&logo=vercel&logoColor=white)](https://bondeth.dev)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RithyBondeth)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rithy-bondeth-484073282/)
