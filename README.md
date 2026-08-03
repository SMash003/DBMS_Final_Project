# Central Crime Registry (CCR)

### 🚔 Database Management Systems (DBMS) Final Project

## Developed by **TEAM 3NF**

The **Central Crime Registry (CCR)** is a RESTful Criminal Record Management System developed as a Database Management Systems (DBMS) Final Project. It provides a centralized platform for law enforcement agencies to manage criminal records, investigations, police stations, officers, evidence, arrests, victims, witnesses, court proceedings, and sentencing.

---

# 📌 Repository

**GitHub Repository**

https://github.com/SMash003/DBMS_Final_Project

---

# 📖 Project Overview

Central Crime Registry (CCR) is designed to replace traditional paper-based criminal record management with a secure, centralized digital system. The application allows police departments to efficiently record, update, and retrieve criminal information while maintaining data integrity through a relational database.

The backend follows RESTful architecture and is built using **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL (Neon Database)**.

---

# ✨ Features

- Secure User Authentication using JWT
- Police Station Management
- Police Officer Management
- Criminal Record Management
- Crime Management
- Case Management
- Criminal-Case Relationship Management
- Evidence Tracking
- Arrest Management
- Victim Management
- Witness Management
- Court Case Management
- Sentence Management
- RESTful API Architecture
- PostgreSQL Database Integration
- Prisma ORM

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL
- Prisma ORM
- Neon Database

## Authentication

- JWT (JSON Web Token)
- bcrypt

## Development Tools

- Git
- GitHub
- Postman
- Prisma Studio
- VS Code

---

# 🗄 Database Entities

- User
- Station
- Officer
- Criminal
- Crime
- Case
- CriminalCase
- Evidence
- Arrest
- Victim
- Witness
- CourtCase
- Sentence

---

# 🔗 Database Relationships

- One Station → Many Officers
- One Station → Many Cases
- One Case → Many Criminals
- One Crime → Many Criminal Cases
- One Criminal → Many Cases
- One Case → Many Evidence Records
- One Case → Many Arrest Records
- One Case → Many Victims
- One Case → Many Witnesses
- One Case → Many Court Cases
- One Court Case → Many Sentences

---

# 📂 Project Structure

```
Central-Crime-Registry/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/SMash003/DBMS_Final_Project.git

cd DBMS_Final_Project
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file.

```env
DATABASE_URL="your_database_url"

JWT_SECRET="your_secret_key"

PORT=5000
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Database Migration

```bash
npx prisma migrate dev
```

## Seed Sample Data (Optional)

```bash
npm run seed
```

## Start the Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 📡 API Modules

| Module | Description |
|----------|-------------|
| Authentication | User Login & Authorization |
| Station | Police Station CRUD |
| Officer | Officer CRUD |
| Criminal | Criminal CRUD |
| Crime | Crime CRUD |
| Case | Case CRUD |
| CriminalCase | Criminal & Case Mapping |
| Evidence | Evidence Management |
| Arrest | Arrest Management |
| Victim | Victim Management |
| Witness | Witness Management |
| CourtCase | Court Proceedings |
| Sentence | Sentence Records |

---

# 🔐 Authentication

The application uses **JWT Authentication**.

Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 🗃 Database

Database: **PostgreSQL (Neon)**

ORM: **Prisma**

Useful Commands

```bash
npx prisma generate
```

```bash
npx prisma studio
```

```bash
npx prisma migrate dev
```

```bash
npx prisma migrate reset
```

---

# 🚀 Future Improvements

- Crime Analytics Dashboard
- Interactive Charts
- PDF Report Generation
- Evidence Image Upload
- Criminal Photo Management
- Advanced Search & Filtering
- Audit Logs
- Email Notifications
- Swagger/OpenAPI Documentation
- Role-Based Access Control Improvements

---


# 🤝 Contributing

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Developed By

## TEAM 3NF

**Central Crime Registry (CCR)**

Database Management Systems (DBMS) Final Project

Department of Computer Science & Engineering

International Islamic University Chittagong (IIUC)

GitHub Repository

https://github.com/SMash003/DBMS_Final_Project

---

# 📄 License

This project was developed by **TEAM 3NF** as part of the Database Management Systems (DBMS) course at the International Islamic University Chittagong (IIUC).

© 2026 TEAM 3NF. All rights reserved.
