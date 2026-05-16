# TRC Project Implementation Guide

This document provides a comprehensive breakdown of the Tigray Resources Center (TRC) codebase, explaining the role and function of each major directory and file.

## 🏗️ System Architecture Overview

The project follows a **Modular Monolith** architecture. Both the frontend and backend are organized into "modules" (e.g., Auth, Resource, User, Home), making the system easy to scale and maintain.

---

## 🔙 Backend Implementation (`/backend`)

The backend is built with **Node.js**, **Express**, **TypeScript**, and **Prisma**.

### 📁 Core Files
- **`src/app.ts`**: The main application file. It sets up the Express server, connects to the database, and registers all API routes.
- **`src/server.ts`**: Entry point that starts the HTTP server.
- **`prisma/schema.prisma`**: Defines the database models (Users, Resources, Comments, etc.) and handles migrations.

### 📁 Auth Module (`/src/modules/auth`)
- **`auth.controller.ts`**: Handles incoming HTTP requests for login, register, and OTP verification.
- **`auth.service.ts`**: Contains the business logic (e.g., password hashing, JWT token generation).
- **`auth.routes.ts`**: Defines the API endpoints for authentication (e.g., `/api/auth/login`).
- **`otp.service.ts`**: Manages the generation and verification of OTPs using **Redis** for temporary storage.

### 📁 Resource Module (`/src/modules/resource`)
- **`resource.controller.ts`**: Handles resource uploads, searches, and downloads.
- **`resource.service.ts`**: Manages the logic for saving resource metadata to PostgreSQL.

---

## 🎨 Frontend Implementation (`/frontend`)

The frontend is built with **Vue 3**, **Vite**, **TypeScript**, and **Pinia**.

### 📁 Core Files
- **`src/main.ts`**: Initializes the Vue app, Pinia stores, and the Router.
- **`src/App.vue`**: The root component that manages high-level layout switching (Main vs Dashboard).
- **`src/router/index.ts`**: Handles all site navigation and "Route Guards" to protect private pages.

### 📁 Layouts (`/src/layouts`)
- **`MainLayout.vue`**: The wrapper for all public pages (About, Contact, etc.), including the global Header and Footer.
- **`DashboardLayout.vue`**: The specialized layout for the Admin and User dashboards.
- **`AuthLayout.vue`**: A clean, centered layout for Login and Registration pages.

### 📁 Home Module (`/src/modules/home`)
- **`pages/LandingPage.vue`**: The flagship page. It implements the premium HERO design, wavy dividers, and real-time stats.
- **`pages/About.vue`**: Detailed page about the organization's mission and vision.
- **`pages/News.vue`**: Blog/News feed for project updates.
- **`home.routes.ts`**: Maps all public-facing pages to their respective URLs.

### 📁 Shared Components (`/src/components`)
- **`layout/AppHeader.vue`**: The navigation bar with adaptive styles (transparent on landing, solid on scroll).
- **`layout/AppFooter.vue`**: The multi-column footer containing all site links and newsletter signups.
- **`ui/`**: Reusable UI components like buttons, inputs, and modals.

---

## ⚙️ Infrastructure & DevOps
- **`backend/.env`**: Stores sensitive credentials (DB URL, SendGrid Key, JWT Secret).
- **`frontend/vite.config.ts`**: Configuration for the build tool and development server.
- **`HERO/`**: A reference folder containing the original design mockup and theme assets used for the production UI alignment.

---

## 🛠️ Key Technologies Used
| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Cache/OTP** | Redis |
| **Emails** | SendGrid |
| **Frontend** | Vue 3 (Composition API), Vite |
| **State Management** | Pinia |
| **Styling** | Vanilla CSS + TailwindCSS |
| **UI Components** | Ant Design Vue |
