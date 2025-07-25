# Resume Analyzer

A full-stack web application that allows users to upload resumes (PDF), receive automated AI-driven analysis, and view historical analyses. Built with React, Node.js/Express, PostgreSQL, and Google Gemini LLM.

---

## 🚀 Features
- **Live Resume Analysis:** Upload a PDF resume and receive structured extraction (personal info, skills, experience, etc.) and AI-powered feedback (rating, improvement areas, upskill suggestions).
- **Historical Viewer:** View all previously analyzed resumes in a searchable table. Click "Details" to see the full analysis for any resume.
- **Database Storage:** All analyses are saved in PostgreSQL for future reference.
- **Modern UI:** Clean, responsive, and user-friendly interface with cards/sections, color-coded feedback, and loading spinners.

---

## 🛠️ Technology Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **AI/LLM:** Google Gemini API via @google/generative-ai
- **PDF Parsing:** pdf-parse
- **Other:** Multer (file uploads), Axios (HTTP requests), CORS, dotenv

---

## 📁 Folder Structure
```
resume_analyzer/
  fullstack-app/
    backend/           # Node.js/Express backend
      db/              # Database connection
      server.js        # Main server file
      ...
    frontend/          # React frontend
      src/components/  # React components
      ...
  sample_data/         # Example PDF resumes for testing
  screenshots/         # UI screenshots for submission
```

---

## ⚡ Setup Instructions

### 1. **Clone the Repository**
```sh
git clone <your-repo-url>
cd resume_analyzer/fullstack-app
```

### 2. **Database Setup (PostgreSQL)**
- Install PostgreSQL (v16.x recommended)
- Create the database and table:
  1. Open SQL Shell (psql):
  2. Run:
     ```sql
     CREATE DATABASE resume_analyzer;
     \c resume_analyzer
     CREATE TABLE resumes (
         id SERIAL PRIMARY KEY,
         file_name VARCHAR(255) NOT NULL,
         uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         name VARCHAR(255),
         email VARCHAR(255),
         phone VARCHAR(50),
         linkedin_url VARCHAR(255),
         portfolio_url VARCHAR(255),
         summary TEXT,
         work_experience JSONB,
         education JSONB,
         technical_skills JSONB,
         soft_skills JSONB,
         projects JSONB,
         certifications JSONB,
         resume_rating NUMERIC,
         improvement_areas TEXT,
         upskill_suggestions JSONB
     );
     ```

### 3. **Backend Setup**
```sh
cd backend
npm install
```
- Create a `.env` file in `backend/`:
  ```
  DB_USER=postgres
  DB_HOST=localhost
  DB_DATABASE=resume_analyzer
  DB_PASSWORD=your_postgres_password
  DB_PORT=5432
  GOOGLE_API_KEY=your_gemini_api_key
  ```
- Start the backend:
  ```sh
  node server.js
  # or
  npm start
  ```

### 4. **Frontend Setup**
```sh
cd ../frontend
npm install
npm start
```
- The app will open at [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Usage
- **Live Resume Analysis:** Upload a PDF resume, view structured analysis and feedback.
- **History Tab:** View all past analyses, click "Details" for full info.

---

## 📂 Sample Data
- Place test PDF resumes in the `sample_data/` folder for demonstration/testing.

---

## 🖼️ Screenshots
- Place screenshots of all major UI pages in the `screenshots/` folder:
  - Live Resume Analysis tab
  - History tab
  - Details modal

---

## ✅ Submission Checklist
- [ ] All code in a public GitHub repo
- [ ] `sample_data/` folder with test PDFs
- [ ] `screenshots/` folder with UI images
- [ ] Comprehensive `README.md` with setup instructions
- [ ] All features work as described

---

## 📝 License
This project is for educational/demo purposes.