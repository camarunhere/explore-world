# 🌍 ExploreWorld

**A community-driven web platform for discovering hidden travel destinations through user-generated content.**

ExploreWorld connects curious travellers with authentic, off-the-beaten-path destinations that mainstream platforms ignore. Every destination is submitted and reviewed by real travellers — no algorithms, no paid promotions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)
- [Authentication](#authentication)
- [Demo Credentials](#demo-credentials)
- [Design System](#design-system)

---

## Overview

ExploreWorld was built to address a core imbalance in modern tourism: major platforms push popular destinations while hundreds of culturally rich, economically underdeveloped locations remain invisible. This platform gives those places a voice through community storytelling.

The platform supports:
- Browsing and filtering 30+ curated hidden destinations across 6 continents
- Submitting new destinations with full trip details and travel stories
- Rating and reviewing destinations with authentic feedback
- Saving favourite destinations to a personal profile
- Community-driven visibility — ratings determine prominence, not ad spend

---

## Features

### Discovery
- **Search** destinations by name, country, region, activity, or tag
- **Filter** by continent, activity type, difficulty level, and maximum budget
- **Sort** by rating, popularity, date added, or cost
- **Active filter chips** with one-click removal
- URL-synced filters — share any search result as a direct link

### Destination Detail
- Full image gallery with thumbnail switcher
- Rich travel narrative with summary and full story
- Trip logistics: cost, duration, best season, accessibility, accommodation
- Interactive OpenStreetMap location embed
- Community stats: views, saves, reviews, average rating
- Clickable tags linking to related destinations

### Reviews
- Interactive star rating input with hover preview
- Full review form: title, story, visit date
- Helpful vote system on each review
- Per-destination average rating recalculated on each new review

### User Accounts
- JWT-based authentication (register / login / logout)
- Protected routes — redirects to login with return destination
- Profile page with activity stats, preferences, and all written reviews
- Profile editing (name, bio)
- Password visibility toggle and strength meter on registration

### Destination Submission
- 4-step guided form: Location → Trip Details → Story → Review & Submit
- Progress bar with step indicators
- Per-step validation with inline field errors
- Submission goes into a Pending review queue

### Design
- Dark theme with emerald green accent throughout
- Animated hero with floating particles and gradient text
- Glass-morphism navbar (transparent → frosted glass on scroll)
- Animated stat counters on the home page
- Skeleton loading states and smooth page transitions
- Fully responsive — desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Vite 5 |
| **Backend** | Node.js, Express.js |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Storage** | File-based JSON (simulates a database — no setup required) |
| **Styling** | Custom CSS with CSS custom properties (no framework) |
| **Fonts** | Playfair Display (headings) + Inter (body) via Google Fonts |
| **Images** | Unsplash (direct URLs, no API key needed) |
| **Maps** | OpenStreetMap iframe embed (no API key needed) |
| **Avatars** | UI Avatars API (auto-generated from name) |

---

## Project Structure

```
Explore_World/
├── package.json                  # Root — runs both servers with concurrently
│
├── backend/
│   ├── server.js                 # Express app, CORS, route mounting
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js               # JWT protect middleware
│   ├── routes/
│   │   ├── auth.js               # /api/auth — register, login, me, profile
│   │   ├── destinations.js       # /api/destinations — CRUD + search/filter
│   │   └── reviews.js            # /api/reviews — create, list, helpful vote
│   └── data/
│       ├── destinations.json     # 30 destination records (D001–D030)
│       ├── users.json            # User accounts with hashed passwords
│       └── reviews.json          # Sample reviews
│
└── frontend/
    ├── index.html                # Google Fonts, emoji favicon
    ├── vite.config.js            # Port 5173, /api proxy → localhost:5000
    ├── package.json
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Router, AuthProvider, layout, all routes
        ├── index.css             # Full design system — variables, components
        ├── context/
        │   └── AuthContext.jsx   # Global auth state, login/logout/updateUser
        ├── utils/
        │   └── api.js            # All fetch calls, auto Bearer token injection
        ├── components/
        │   ├── Navbar.jsx / .css
        │   ├── Footer.jsx / .css
        │   └── DestinationCard.jsx / .css
        └── pages/
            ├── Home.jsx / Home.css
            ├── Destinations.jsx / Destinations.css
            ├── DestinationDetail.jsx / DestinationDetail.css
            ├── Login.jsx
            ├── Register.jsx
            ├── Auth.css          # Shared styles for Login + Register
            ├── Profile.jsx / Profile.css
            ├── Submit.jsx / Submit.css
            └── About.jsx / About.css
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

**1. Clone or download the project**

```bash
cd Explore_World
```

**2. Install all dependencies** (root + backend + frontend)

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

**3. Start both servers**

```bash
npm run dev
```

This runs both the backend API (port 5000) and the frontend dev server (port 5173) simultaneously.

| Server | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

> The Vite dev server proxies all `/api/*` requests to the Express backend, so no CORS issues during development.

### Running servers individually

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

---

## API Reference

All API routes are prefixed with `/api`.

### Authentication — `/api/auth`

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Create a new account |
| `POST` | `/login` | No | Sign in, returns JWT |
| `GET` | `/me` | Yes | Get current user profile |
| `PUT` | `/profile` | Yes | Update name / bio |

**Register / Login request body:**
```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourpassword"
}
```

**Response (both):**
```json
{
  "token": "<jwt>",
  "user": { "user_id": "...", "name": "...", "email": "..." }
}
```

---

### Destinations — `/api/destinations`

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | No | List destinations with optional filters |
| `GET` | `/featured` | No | Top-rated destinations (rating ≥ 4.6) |
| `GET` | `/stats` | No | Platform-wide statistics |
| `GET` | `/:id` | No | Single destination (increments view count) |
| `POST` | `/` | Yes | Submit a new destination |
| `POST` | `/:id/save` | Yes | Save a destination (increments saves) |

**GET `/` query parameters:**

| Param | Example | Description |
|---|---|---|
| `search` | `waterfall` | Full-text search across title, country, region, tags |
| `continent` | `Asia` | Filter by continent |
| `activity_type` | `Hiking & Trekking` | Filter by activity |
| `difficulty_level` | `Moderate` | Filter by difficulty |
| `max_cost` | `500` | Maximum estimated cost (USD) |
| `sort` | `rating` | `rating`, `popular`, `newest`, `cost_asc`, `cost_desc` |

---

### Reviews — `/api/reviews`

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/destination/:id` | No | All reviews for a destination |
| `GET` | `/user/:userId` | No | All reviews by a user |
| `POST` | `/` | Yes | Submit a new review |
| `POST` | `/:id/helpful` | No | Mark a review as helpful |

**POST `/` request body:**
```json
{
  "destination_id": "D001",
  "rating": 5,
  "title": "Absolutely breathtaking",
  "content": "Full review text...",
  "visit_date": "2024-10"
}
```

---

## Pages & Routes

| Route | Page | Protected |
|---|---|---|
| `/` | Home — hero, featured destinations, continents, activities | No |
| `/destinations` | Browse all destinations with search and filters | No |
| `/destinations/:id` | Full destination detail — gallery, story, reviews, map | No |
| `/login` | Sign in | No |
| `/register` | Create account | No |
| `/profile` | User profile — overview, reviews, settings | Yes |
| `/submit` | Submit a new destination (4-step form) | Yes |
| `/about` | About the platform — mission, team, values | No |

---

## Authentication

Authentication uses **JWT tokens** stored in `localStorage` under the key `ew_token`.

- On app load, `AuthContext` reads the stored token and calls `/api/auth/me` to restore the session
- Protected pages redirect unauthenticated users to `/login` with the intended destination stored in router state
- After login, users are redirected back to the page they were trying to access
- The `api.js` utility automatically attaches the `Authorization: Bearer <token>` header to all authenticated requests

---

## Demo Credentials

The database is pre-seeded with the following accounts for testing:

| Name | Email | Password |
|---|---|---|
| Sofia Marchetti | sofia@exploreworld.com | traveller123 |
| James Okafor | james@exploreworld.com | explorer456 |
| Demo User | demo@exploreworld.com | demo1234 |

> On the Login page, click **"Fill Demo Credentials"** to auto-populate the demo account.

---

## Design System

All design tokens are defined as CSS custom properties in `frontend/src/index.css`.

### Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#070b14` | Page background |
| `--bg-secondary` | `#0c1220` | Section backgrounds, navbar |
| `--bg-card` | `#111827` | Card backgrounds |
| `--bg-surface` | `#1a2332` | Input backgrounds, chips |
| `--accent-emerald` | `#10b981` | Primary accent — CTAs, highlights |
| `--accent-rose` | `#f43f5e` | Destructive actions |
| `--text-primary` | `#f8fafc` | Headings |
| `--text-secondary` | `#94a3b8` | Body text |
| `--text-muted` | `#475569` | Labels, hints |

### Typography

- **Headings:** Playfair Display (serif) — loaded via Google Fonts
- **Body:** Inter (sans-serif) — loaded via Google Fonts

### Component Classes

| Class | Description |
|---|---|
| `.btn .btn-primary` | Emerald filled button |
| `.btn .btn-secondary` | Subtle filled button |
| `.btn .btn-outline` | Transparent with border |
| `.btn-lg / .btn-sm` | Size modifiers |
| `.badge .badge-hidden-gem` | Animated pulse badge |
| `.badge-difficulty-*` | Colour-coded difficulty badges |
| `.pill` | Filter pill (continent, activity) |
| `.form-input` | Unified input / select / textarea style |
| `.section-tag` | Small uppercase category label |
| `.animate-fadeInUp` | Entrance animation |
| `.stagger-children` | Staggers child `animate-fadeInUp` elements |

---

## Data Model

Each destination record contains:

```
destination_id, post_title, submitter_name, country, region, continent,
activity_type, difficulty_level, best_time_to_visit, avg_trip_duration_days,
estimated_cost_usd, avg_rating, total_reviews, total_saves, total_views,
latitude, longitude, description_summary, full_description,
accessibility, accommodation_type, nearest_major_city,
distance_from_major_city_km, is_hidden_gem, environmental_sensitivity,
tags[], image, gallery[]
```

All data is stored in `backend/data/*.json` files. Writes (new destinations, reviews, saves, view increments) are persisted to disk in real time.

---

*Built as part of a research project on community-driven tourism platforms using user-generated content.*
