# PlantCare AI 🌿

PlantCare AI is a comprehensive botanical management platform designed for modern plant enthusiasts. It combines IoT-like tracking (watering schedules), AI diagnostics (Gemini API), and real-time analytics to ensure your indoor garden thrives.

## 🚀 Features

- **JWT Authentication**: Secure register/login with protected dashboards.
- **Smart Dashboard**: Real-time stats, plant search, and health filtering.
- **Plant CRUD**: Full management including image uploads and care notes.
- **AI Plant Doctor**: Analyze leaf diseases using Google's Gemini 1.5 Flash.
- **Watering Engine**: Automatic calculation of next watering dates and overdue alerts.
- **Weather Integration**: Dynamic care suggestions based on local climate data.
- **Email Reminders**: Automated notifications via Nodemailer.
- **Visual Analytics**: Interactive health distribution and activity charts.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Chart.js, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.
- **AI**: Google Gemini Pro API.
- **Others**: Axios, Multer (File Uploads), Nodemailer.

---

## 📁 Project Structure

```text
/
├── client/          # Vite + React (Frontend)
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── context/     # Auth State
│   │   ├── pages/       # Route Views
│   │   └── App.jsx
├── server/          # Node + Express (Backend)
│   ├── config/      # DB Connection
│   ├── controllers/ # Logic
│   ├── models/      # Mongoose Schemas
│   ├── routes/      # API Routes
│   ├── utils/       # AI, Weather, Email utils
│   └── server.js
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Gemini API Key (from Google AI Studio)
- OpenWeatherMap API Key

### Backend Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_key
   OPENWEATHER_API_KEY=your_weather_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```
4. `npm run dev`

### Frontend Setup
1. `cd client`
2. `npm install`
3. `npm run dev` (Access at `http://localhost:5173`)

---

## 🌐 Deployment Steps

### Frontend (Vercel)
1. Push `client` code to GitHub.
2. In Vercel, import the repository.
3. Fix Root Directory to `client`.
4. Set Build Command: `npm run build`.
5. Set Output Directory: `dist`.

### Backend (Render)
1. Push `server` code to GitHub.
2. In Render, create a new "Web Service".
3. Set the Build Command: `npm install`.
4. Set the Start Command: `node server.js`.
5. Add all `.env` variables in the "Environment" tab.

---

## ✅ Production Checklist
- [ ] Use `helmet` for security headers.
- [ ] Set `NODE_ENV` to `production`.
- [ ] Use a professional storage solution (Cloudinary/S3) for images instead of local `./uploads`.
- [ ] Enable Rate Limiting for API routes.
- [ ] Setup MongoDB indexes for faster searches.
