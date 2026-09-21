# FitTrack

Personal Health, Nutrition and Fitness Tracker — a complete MERN stack web application built for a college Web Programming Laboratory (WPL) final project.

**Theme:** [SDG 3 – Good Health and Well-Being](https://sdgs.un.org/goals/goal3)

## Project Overview

FitTrack helps users:

- Create an account and maintain a personal health profile
- Estimate daily calorie and protein targets
- Search foods and log meals
- Track workouts and exercises
- Log water, sleep and weight
- View a daily dashboard and historical progress charts

The three main pillars are:

1. **Nutrition & Protein Tracking**
2. **Workout & Exercise Tracking**
3. **Health Dashboard & Progress**

## Features

- JWT authentication with bcrypt password hashing
- Protected dashboard routes
- Food database with search, category filters and custom foods
- Food logging with meal grouping and dynamic nutrition scaling
- Exercise library with workout builder (sets/reps/weight or duration/distance)
- Health habit logging (water, sleep, weight)
- Dashboard summaries with progress indicators
- Progress charts (Chart.js) for 7 days / 30 days / 3 months
- Responsive UI with Bootstrap 5 + custom health/fitness styling
- Seed scripts for foods and exercises
- Centralized API error handling and loading/empty/error states

## MERN Architecture

```
React (Vite)  →  Axios REST calls  →  Express API  →  Mongoose  →  MongoDB
```

- **MongoDB** stores users, foods, food logs, exercises, workouts and health logs
- **Express** exposes REST endpoints and applies JWT middleware
- **React** renders the UI and manages auth state with Context
- **Node.js** runs the backend runtime

## Technologies Used

### Frontend

- React, Vite, JavaScript, HTML5, CSS3
- Bootstrap 5, Bootstrap Icons
- React Router, Axios
- Chart.js / react-chartjs-2

### Backend

- Node.js, Express.js
- MongoDB, Mongoose
- JWT, bcryptjs
- express-validator, cors, dotenv

## Folder Structure

```
fittrack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (or a MongoDB Atlas connection string)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Neel0505/Good-Health-and-Well-being.git
cd Good-Health-and-Well-being

# 2. Install root + server + client dependencies
npm run install:all

# 3. Configure environment
copy .env.example server\.env
# On macOS/Linux: cp .env.example server/.env
# Edit server/.env if needed
```

## Environment Variables

Create `server/.env` from `.env.example`:

```
MONGO_URI=mongodb://127.0.0.1:27017/fittrack
JWT_SECRET=your_jwt_secret_change_this
PORT=5000
CLIENT_URL=http://localhost:5173
```

Never commit real secrets.

## MongoDB Setup

1. Install and start MongoDB Community Server, **or**
2. Use MongoDB Atlas and put the connection string in `MONGO_URI`

Default local database name: `fittrack`

## Database Seeding

Seed common foods and exercises:

```bash
npm run seed
```

## Running Backend

```bash
npm run server
```

API runs at `http://localhost:5000`

Health check: `GET http://localhost:5000/api/health-check`

## Running Frontend

```bash
npm run client
```

App runs at `http://localhost:5173`

## Run Both Together

```bash
npm run dev
```

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users/profile`
- `PUT /api/users/profile`

### Foods

- `GET /api/foods`
- `GET /api/foods/:id`
- `POST /api/foods/custom`
- `DELETE /api/foods/:id`

### Food Logs

- `GET /api/food-logs/today`
- `GET /api/food-logs`
- `POST /api/food-logs`
- `PUT /api/food-logs/:id`
- `DELETE /api/food-logs/:id`

### Exercises

- `GET /api/exercises`
- `GET /api/exercises/:id`

### Workouts

- `GET /api/workouts`
- `GET /api/workouts/:id`
- `POST /api/workouts`
- `DELETE /api/workouts/:id`

### Health

- `GET /api/health`
- `POST /api/health`
- `PUT /api/health/:id`
- `DELETE /api/health/:id`

### Dashboard & Progress

- `GET /api/dashboard`
- `GET /api/progress?range=7d|30d|90d`

Protected routes require:

```
Authorization: Bearer <JWT>
```

## Nutrition Calculation Notes

- **BMR:** Mifflin-St Jeor equation
- **TDEE:** BMR × activity multiplier
- **Calorie target:** TDEE adjusted by fitness goal
- **Protein target:** approximate fitness-oriented g/kg estimate

Food log scaling example:

`Chicken Breast` at 165 kcal / 31 g protein per 100 g  
Quantity `150 g` → calories `247.5`, protein `46.5`

## Screenshots

Add screenshots here after running the app:

- Landing page
- Dashboard
- Nutrition page
- Workouts page
- Progress charts

## Future Scope

- Meal templates / saved favorite foods
- Workout plan templates
- Mobile app companion
- Export weekly reports as PDF
- Social / accountability features

## Limitations

- Nutritional values are approximate educational estimates
- Targets are not medical advice
- No clinician review or diagnosis features
- Progress charts only show data the user has actually logged

## SDG 3 – Good Health and Well-Being

FitTrack supports SDG 3 by helping users build awareness around nutrition, physical activity, hydration, sleep and body-weight trends. It is an educational tracking tool meant to encourage healthier everyday habits — not a substitute for professional medical care.

## Disclaimer

Nutritional and fitness calculations are estimates intended for general tracking and educational purposes. Individual needs may vary.

## License

Academic / educational project use.
