# HomeCrew — Professional Hands in your Services 🛠️🏡

> **Built with pride by Team ShadowX Coders for the National Hackathon (Domain: Social Impact).**  
> *A hyperlocal platform connecting households with trusted blue-collar workers (plumbers, electricians, cleaners, painters, cooks, carpenters, etc.) within 30 minutes.*

---

## 🌟 Executive Summary & Social Impact Mission

In India's informal labor economy, blue-collar tradespeople often face severe financial exploitation, with commercial gig apps taking **25% to 35% commissions** per gig. Simultaneously, homeowners face opaque pricing, long wait times (4 to 24 hours), and anxiety regarding home security.

**HomeCrew** fundamentally transforms this paradigm:
1. **100% Direct Worker Pay:** Workers set their own base rates and negotiate freely. Zero middleman commission cuts.
2. **⚡ 30-Minute Hyperlocal Connection Guarantee:** Using MongoDB **2dsphere** geospatial indexing, customers match with professionals operating in a ~25 km/h transit radius (typically within 3–5 km).
3. **Audited Trust & Dignity:** Background and government ID verification (Aadhaar/PAN) reviewed via our verification desk.
4. **Active Emergency SOS Safety Alarm:** Real-time panic button during active jobs that immediately broadcasts GPS coordinates and active booking details to local safety squads and emergency contacts (112 / 1091).
5. **Multilingual Inclusivity:** Tri-lingual support (**English, हिन्दी, मराठी**) removing literacy barriers for informal workers.

---

## 🎨 Brand Identity & Visual System

- **Dark Green (`#0B5D43`):** Dignity, trust, security, stability.
- **Golden Yellow (`#F9B000`):** Warmth, supportive hands, prompt craftsmanship, excellence.
- **Off-White (`#FAFBF8`):** Cleanliness, accessibility, clarity.
- **Headings Font:** `Poppins` (Bold, energetic, modern).
- **Body Font:** `Inter` (Legible, crisp, accessible across all devices).

### Logo & Animations
- **Animated SVG Intro Splash:** House outline draws itself via SVG stroke animation, two pro worker icons pop in, a golden yellow hand swoops up to cradle the home, "HomeCrew" slides up letter-by-letter, and the tagline fades in.
- **Interactive Navbar Hover:** The supportive golden hand lifts slightly while the attic window emits a warm golden glow.
- **Pulsing House Spinner:** Custom SVG loading spinner instead of generic circular spinners.

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, React Router v6, Lucide Icons, Canvas Confetti |
| **Maps & Geospatial** | Leaflet, React-Leaflet, OpenStreetMap (100% free, no API keys needed) |
| **Backend** | Node.js, Express.js (REST API), Socket.io (Bi-directional real-time communication) |
| **Database** | MongoDB (Mongoose) with `2dsphere` geospatial indices, `mongodb-memory-server` automatic fallback |
| **Security & Middleware** | JWT (JSON Web Tokens), bcryptjs, Helmet, CORS, Express-Rate-Limit, Multer |
| **Process Orchestration**| Concurrently (One-command unified startup) |

---

## 📁 Repository Structure

```
HomeCrew/
├── package.json               # Monorepo root with unified dev/install scripts
├── .env.example               # Environment variables template
├── README.md                  # Comprehensive project documentation
├── server/                    # Node.js + Express + Socket.io Backend
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── server.js              # Express app, Helmet, CORS, Socket.io server
│   ├── config/
│   │   └── db.js              # MongoDB connection with MongoMemoryServer fallback
│   ├── models/
│   │   ├── User.js            # Customer/Worker/Admin schema + 2dsphere index
│   │   ├── WorkerProfile.js   # Skills, rates, rating, 2dsphere location
│   │   ├── Job.js             # Job requests, status timeline, final price
│   │   ├── Offer.js           # Live negotiation threads & counter offers
│   │   ├── Review.js          # Star ratings, comments, badge tags
│   │   └── Notification.js    # In-app notifications
│   ├── routes/
│   │   ├── authRoutes.js      # Phone OTP (mock "123456" in dev)
│   │   ├── userRoutes.js      # Profile update & location coordinates
│   │   ├── workerRoutes.js    # Geo-query with $near & 30-min ETA computation
│   │   ├── jobRoutes.js       # Create & status progression
│   │   ├── offerRoutes.js     # Live negotiation offers & counter amounts
│   │   ├── reviewRoutes.js    # Rating submission & aggregate calculations
│   │   └── adminRoutes.js     # Verification queue, user/job inspection
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect & role authorization
│   │   └── uploadMiddleware.js# Multer local storage for ID verification docs
│   ├── utils/
│   │   └── distanceEta.js     # Haversine distance & ~25 km/h ETA algorithm
│   ├── sockets/
│   │   └── socketHandler.js   # Real-time rooms, live GPS dispatch, SOS alert
│   ├── seeds/
│   │   ├── seedData.js        # 15 Mumbai workers, 5 customers, 4 jobs
│   │   └── seed.js            # Database seeding execution script
│   └── uploads/
│       └── documents/         # Local storage folder for uploaded worker IDs
└── client/                    # React + Vite Frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    ├── public/
    │   ├── favicon.svg        # House with glowing window and golden hand
    │   ├── logo.svg           # Fallback static vector logo
    │   └── shadowx-logo.svg   # Team ShadowX Coders hackathon badge
    └── src/
        ├── App.jsx            # Routing, Splash orchestrator, Providers
        ├── main.jsx
        ├── index.css          # Tailwind & Leaflet styling
        ├── context/
        │   ├── AuthContext.jsx       # Auth session & 1-click demo login
        │   ├── SocketContext.jsx     # Live Socket.io connection & SOS dispatch
        │   └── LanguageContext.jsx   # Tri-lingual i18n (English/Hindi/Marathi)
        ├── components/
        │   ├── Navbar.jsx            # Dark green, animated logo, i18n, demo picker
        │   ├── Footer.jsx            # Team ShadowX Coders credit & emergency lines
        │   ├── Logo.jsx              # Recreated inline Framer Motion SVG
        │   ├── SplashScreen.jsx      # 2.5s SVG house drawing & letter animation
        │   ├── LoadingSpinner.jsx    # Pulsing house icon
        │   ├── SOSButton.jsx         # Floating emergency alarm with synthesizer
        │   ├── LeafletMap.jsx        # Interactive OpenStreetMap with custom pins
        │   └── WorkerCard.jsx        # Worker card with ETA, skills, rating
        ├── pages/
        │   ├── Home.jsx              # Landing hero, search, 4 steps, categories
        │   ├── LoginSignup.jsx       # Phone OTP + Role picker (Customer/Worker)
        │   ├── CustomerDashboard.jsx # Post urgent task, active & past bookings
        │   ├── FindWorkers.jsx       # Filter by trade, radius, rating, price
        │   ├── WorkerProfile.jsx     # Public worker portfolio, reviews & booking
        │   ├── Negotiation.jsx       # Real-time chat offer thread & price lock
        │   ├── WorkerDashboard.jsx   # Availability toggle, incoming jobs, ID upload
        │   ├── JobTracking.jsx       # 5-step status timeline + moving GPS tracking
        │   ├── ReviewPage.jsx        # 1-5 star review & feedback tag submission
        │   ├── AdminPanel.jsx        # Worker ID approval, user audit, platform jobs
        │   ├── About.jsx             # Social impact mission & problem/solution
        │   └── NotFound.jsx          # Custom 404 page
        └── utils/
            ├── api.js                # Axios instance with auto-auth Bearer header
            └── translations.js       # Complete English, Hindi, and Marathi dictionaries
```

---

## ⚡ Quick Start Guide (Run with 1 Command)

### Prerequisites
- **Node.js** (v18.x or newer recommended)
- **npm** (v9.x or newer)

*(Note: If a local MongoDB daemon or MongoDB Atlas URI is provided in `.env`, the app will connect to it. If not, the server will automatically launch an embedded **in-memory MongoDB instance** so you can run the entire platform immediately with zero setup!)*

### Step 1: Clone and Enter the Directory
```bash
cd HomeCrew
```

### Step 2: Install All Dependencies (Root, Server, Client)
```bash
npm run install:all
```
*(Or install each folder: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

### Step 3: Run Seed Script (Optional - Server also auto-seeds on initial boot)
```bash
npm run seed
```

### Step 4: Start the Entire Application (Frontend + Backend)
```bash
npm run dev
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔑 Demo Login Credentials (1-Click Evaluation)

In dev mode, the SMS OTP is universally mocked to **`123456`**. You can also use the **"Demo Roles"** button in the top navigation bar for 1-click instant login:

| Persona | Role | Phone | Location / Specialization |
|---|---|---|---|
| **Rahul Sharma** | Customer | `9820011223` | Bandra West (Has active & past bookings) |
| **Pooja Kulkarni** | Customer | `9820011224` | Powai, Hiranandani |
| **Ramesh Patil** | Pro Worker | `9820099881` | Plumber (4.9 ★, ₹350/hr, Verified) |
| **Amit Verma** | Pro Worker | `9820099882` | Electrician (4.8 ★, ₹400/hr, Verified) |
| **Sunita Kamble** | Pro Worker | `9820099883` | Cook & Maid (5.0 ★, ₹300/hr, Dadar) |
| **Kavita Jadhav** | Pro Worker | `9820099887` | Deep Cleaning (4.9 ★, ₹380/hr, Ghatkopar) |
| **Sunil Tiwari** | Pro Worker | `9820099892` | Painter (Pending ID Verification) |
| **Platform Admin** | Admin | `9999999999` | Verification desk & platform oversight |

*Dev OTP:* **`123456`**

---

## 📡 API Reference Overview

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/send-otp`: Generates mock OTP (`123456` in dev) for phone number.
- `POST /api/auth/verify-otp`: Validates OTP and creates/returns JWT token with role.
- `GET /api/auth/demo-users`: Returns list of pre-configured hackathon demo accounts.

### 👷 Workers (`/api/workers`)
- `GET /api/workers`: Geospatial query using `$near` with filters (`service`, `maxDistance`, `rating`, `maxRate`, `verified`, `available`). Computes ETA via Haversine distance formula assuming ~25 km/h.
- `GET /api/workers/:id`: Fetches complete worker portfolio, stats, and customer reviews.
- `PUT /api/workers/availability`: Toggles online/offline work status.
- `PUT /api/workers/profile`: Updates hourly rate, bio, and skill categories.
- `POST /api/workers/verification`: Uploads government ID document via **Multer** to local disk storage.

### 📋 Jobs & Tasks (`/api/jobs`)
- `POST /api/jobs`: Posts an urgent or scheduled task with coordinates and initial budget.
- `GET /api/jobs/my`: Retrieves jobs for logged-in customer or active pro worker.
- `GET /api/jobs/:id`: Detailed job view.
- `PATCH /api/jobs/:id/status`: Advances job timeline (`requested` &rarr; `accepted` &rarr; `on_the_way` &rarr; `in_progress` &rarr; `completed` &rarr; `cancelled`).

### 💬 Live Negotiation & Offers (`/api/offers` & `/api/jobs/:id/offers`)
- `POST /api/jobs/:id/offers`: Submits initial offer or counter proposal.
- `GET /api/jobs/:id/offers`: Retrieves full negotiation history thread.
- `PATCH /api/offers/:id`: Accepts (locks price), counters, or declines offer.

### ⭐ Reviews (`/api/reviews`)
- `POST /api/reviews`: Submits 1–5 star rating, feedback tags, and updates worker aggregate score.
- `GET /api/workers/:id/reviews`: Retrieves all reviews for a worker.

### 🛡️ Admin (`/api/admin`)
- `GET /api/admin/pending-workers`: Lists workers awaiting ID document verification.
- `PATCH /api/admin/workers/:id/verify`: Approves (`verified`) or rejects (`rejected`) a worker.
- `GET /api/admin/stats`: Overview dashboard metrics.
- `GET /api/admin/users`: Audit of all registered users.
- `GET /api/admin/jobs`: Audit of all platform jobs.

---

## ⚡ Real-Time Socket.io Events

| Event Name | Direction | Payload & Purpose |
|---|---|---|
| `join-job` | Client &rarr; Server | Joins private room `job_${jobId}` for live tracking/negotiation |
| `leave-job` | Client &rarr; Server | Leaves job room |
| `new-job` | Server &rarr; Workers | Broadcasts newly requested job to all nearby active workers |
| `new-offer` | Server &rarr; Room | Emits new price proposal to customer and worker |
| `offer-updated` | Server &rarr; Room | Broadcasts accepted / countered / declined status |
| `job-status-changed` | Server &rarr; All | Real-time status update (`on_the_way`, `completed`, etc.) |
| `worker-location` | Worker &rarr; Server &rarr; Room | Dispatches moving GPS coordinates during transit |
| `sos-alert` | Client &rarr; Server | Triggers urgent panic alert with GPS coordinates and sound alarm |

---

## 🚀 Deployment Guide

### 1. Database: MongoDB Atlas
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user with password and allow IP access (`0.0.0.0/0`).
3. Copy the connection string:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/homecrew?retryWrites=true&w=majority
   ```
4. Once deployed, run the seed script:
   ```bash
   npm run seed
   ```

### 2. Backend: Render (Web Service)
1. Sign up on [render.com](https://render.com).
2. Connect your GitHub repository.
3. Configure the Web Service:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `PORT`: `5000`
     - `NODE_ENV`: `production`
     - `MONGODB_URI`: `your_atlas_connection_string`
     - `JWT_SECRET`: `your_random_strong_secret`
     - `CLIENT_URL`: `https://your-frontend-app.vercel.app`
     - `USE_IN_MEMORY_DB`: `false`

### 3. Frontend: Vercel
1. Sign up on [vercel.com](https://vercel.com).
2. Import your repository and select the **`client`** directory as root.
3. Configure settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:** If needed, create `VITE_API_URL` pointing to your Render backend URL.

---

## 🧪 Testing Instructions

1. **Verify Home / Landing:** Open [http://localhost:5173](http://localhost:5173) and observe the 2.5s SVG house drawing intro animation. Test language toggle (English, Hindi, Marathi).
2. **Find Workers & Map:** Click "Find Workers". Adjust radius slider, trade filter, and ratings. Observe the OpenStreetMap pins and the `< 30 MIN` guarantee tags.
3. **Live Negotiation Flow:**
   - Log in as Customer (e.g. Rahul Sharma `9820011223`).
   - Post a job or book a plumber (e.g. Ramesh Patil `9820099881`).
   - Open a second private window and log in as Ramesh Patil.
   - Propose a counter-rate from one window; observe the instant real-time chat bubble update in the other window via Socket.io.
   - Accept the offer: observe confetti celebration and price locking.
4. **Live GPS Job Tracking:**
   - Switch status to "On The Way".
   - Watch the green pro pin move along the route towards the customer's home pin with updated ETA countdown.
5. **SOS Emergency Test:**
   - Click the floating red "SOS Safety" button.
   - Tap "Trigger Emergency SOS Now": hear the audible alert tone and see the emergency dispatch confirmation.
6. **Worker ID Document Upload & Admin Approval:**
   - Log into Worker Dashboard &rarr; upload an ID document.
   - Switch to Admin account (`9999999999`) &rarr; open Verification Queue &rarr; click "Approve". Observe worker badge update to "Verified Pro".

---

## 👥 Hackathon Team Recognition

**Team ShadowX Coders**  
*Domain:* **Social Impact**  
*Project:* **HomeCrew — Hyperlocal Hands in your Services**  
*Date:* **October 2026**
