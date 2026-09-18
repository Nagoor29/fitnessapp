# 🏋️ AI-Powered Personal Fitness Assistant (FitPulse AI)

A full-stack, production-grade fitness web application featuring **User Authentication (JWT + Refresh Cookies)**, **Athlete Profiles & Biometrics**, **Exercise Reference Library**, **Workout Session Logging & Volume Analytics**, **Interactive Recharts Visualizations**, and an **Adaptive AI Coach** powered by **Anthropic Claude**.

---

## 🏗️ Architecture & Monorepo Structure

```
fitness-app/
├── client/                     # React Single Page Application (Vite + Recharts)
│   ├── src/
│   │   ├── api/                # Axios instance & automatic 401 token refresh interceptors
│   │   ├── components/         # Navbar, Notification toasts, Modals
│   │   ├── context/            # AuthContext & FitnessContext
│   │   ├── pages/              # Login, Register, Onboarding, Dashboard, Workouts, AiCoach, Exercises, Profile
│   │   ├── routes/             # ProtectedRoute wrapper
│   │   ├── App.jsx             # Route definitions & onboarding guards
│   │   ├── main.jsx            # React root with Providers
│   │   └── index.css           # Dark athletic glassmorphism design system
│   ├── .env                    # Client environment configuration
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js Express REST API (MongoDB Atlas)
│   ├── src/
│   │   ├── config/             # db.js (Mongoose connection with retry & DNS resolution)
│   │   ├── controllers/        # auth, profile, exercise, workout, ai controllers
│   │   ├── middleware/         # authMiddleware (JWT protect), errorHandler
│   │   ├── models/             # User, UserProfile, Exercise, WorkoutSession, AiSuggestion
│   │   ├── routes/             # auth, profile, exercise, workout, ai routes
│   │   ├── utils/              # seedExercises.js, generateTokens.js, validators.js
│   │   └── server.js           # Express app entrypoint
│   ├── .env                    # Server environment configuration
│   ├── .env.example
│   ├── package.json
│   └── test-phase2.js          # Automated Phase 2 integration test suite
├── package.json                # Root workspaces scripts
└── README.md
```

---

## 🌟 Features Implemented (Phase 1 & Phase 2)

### 🔐 Phase 1: Authentication & Session Security
- **JWT Dual-Token Pattern**: Short-lived Access Token in React memory + Long-lived Refresh Token in `httpOnly` secure cookie.
- **Silent 401 Interceptor**: Transparently refreshes expired access tokens without interrupting the user.
- **Bcrypt Hashing**: 12 salt rounds; passwords excluded by default from queries (`select: false`).
- **Rate Limiting & Security Headers**: Sensitive auth endpoints protected against brute-force attacks via `express-rate-limit` & `helmet`.

### ⚡ Phase 2: Core Fitness Data & AI Integration
- **Athlete Onboarding**: First-time login prompts user for training goals, experience level, physical stats, and training days per week.
- **Exercise Library (Seeded)**: 34+ curated exercises across Strength, Cardio, Mobility, and HIIT with target muscle groups, equipment tags, and technique instructions.
- **Workout Logging (CRUD)**: Create, view, filter, and delete workout sessions with multi-set tracking (sets, reps, weight in kg, duration, notes).
- **Progress Telemetry (Recharts)**:
  - Active Streak counter (🔥 days).
  - Total volume (kg lifted) and all-time session count.
  - Weekly workout frequency bar chart.
  - Progressive overload volume area chart over time.
- **FitPulse AI Coach**:
  - Generates periodized, structured workout plans tailored to user profile, experience level, and recent 14-day training volume.
  - Powered by **Anthropic Claude API** (`claude-3-5-sonnet-20241022`) with strict JSON schema enforcement and an intelligent rule-based synthesis fallback engine.
  - **"Accept & Log to My Workouts"**: Converts AI suggestions into verified `WorkoutSession`s with `source: 'ai_generated'`.
- **Data Isolation**: Strict user-level access control preventing cross-user data exposure.

---

## 🛠️ Environment Configuration

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (Atlas or Local)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fitness_assistant?retryWrites=true&w=majority

# JWT Secrets
JWT_ACCESS_SECRET=super_secret_jwt_access_key_fitness_app_2026_dev_!@#
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_fitness_app_2026_dev_$%^
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Anthropic Claude API Key (Optional in local dev, fallback synthesis activates if empty)
ANTHROPIC_API_KEY=
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Seed Exercise Reference Library
```bash
cd server
npm run seed
```

### 3. Start Development Servers
```bash
# From root directory (starts both backend on port 5000 and frontend on port 5173)
npm run dev
```

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & issue tokens | No |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens | No |
| `POST` | `/api/auth/refresh` | Refresh access token from cookie | No (Cookie) |
| `POST` | `/api/auth/logout` | Revoke session & clear cookie | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | **Yes** |

### Profile (`/api/profile`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/profile` | Get current athlete profile | **Yes** |
| `PUT` | `/api/profile` | Create or update athlete profile | **Yes** |

### Exercises (`/api/exercises`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/exercises` | List exercises with category/muscle filters | **Yes** |
| `GET` | `/api/exercises/:id` | Get single exercise detail | **Yes** |

### Workouts (`/api/workouts`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/workouts` | Log a new workout session | **Yes** |
| `GET` | `/api/workouts` | List user workouts (supports date range) | **Yes** |
| `GET` | `/api/workouts/stats` | Aggregated stats for dashboard charts | **Yes** |
| `GET` | `/api/workouts/:id` | Get single workout session | **Yes** |
| `PUT` | `/api/workouts/:id` | Update workout session | **Yes** |
| `DELETE` | `/api/workouts/:id` | Delete workout session | **Yes** |

### AI Coach (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/ai/suggest-workout` | Generate structured AI workout routine | **Yes** (Rate Limited) |
| `POST` | `/api/ai/suggestions/:id/accept` | Convert AI suggestion into logged WorkoutSession | **Yes** |
| `GET` | `/api/ai/suggestions` | View user's AI suggestions history | **Yes** |

---

## 🧪 Running Automated Tests

```bash
# Phase 1 Auth Integration Suite
node server/test-auth-atlas.js

# Phase 2 Core Data + AI Integration Suite
node server/test-phase2.js
```
