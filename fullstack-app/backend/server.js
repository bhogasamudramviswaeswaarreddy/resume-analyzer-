require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('./db');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function analyzeResumeWithGemini(resumeText) {
  const prompt = `
    You are an expert technical recruiter and career coach. Analyze the following resume text and extract the information into a valid JSON object. The JSON object must conform to the following structure, and all fields must be populated. If a section is missing, return null or an empty array as appropriate. Do not include any text or markdown formatting before or after the JSON object.

    Resume Text:
    """
    ${resumeText}
    """

    JSON Structure:
    {
      "name": "string | null",
      "email": "string | null",
      "phone": "string | null",
      "linkedin_url": "string | null",
      "portfolio_url": "string | null",
      "summary": "string | null",
      "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
      "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
      "technical_skills": ["string"],
      "soft_skills": ["string"],
      "projects": [{ "title": "string", "description": "string", "technologies": ["string"], "duration": "string" }],
      "certifications": [{ "name": "string", "issuer": "string", "year": "string" }],
      "resume_rating": "number (1-10)",
      "improvement_areas": "string",
      "upskill_suggestions": ["string"]
    }
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  // Remove markdown code fencing if present
  text = text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

const app = express();
const PORT = 5000;

// Enable CORS for frontend-backend communication
app.use(cors());

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// POST /upload route to accept PDF file, extract text, and analyze with Gemini
app.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or file is not a PDF.' });
  }
  try {
    const data = await pdfParse(req.file.buffer);
    const analysis = await analyzeResumeWithGemini(data.text);
    // Save analysis to the database
    const {
      name, email, phone, linkedin_url, portfolio_url, summary,
      work_experience, education, technical_skills, soft_skills,
      projects, certifications, resume_rating, improvement_areas, upskill_suggestions
    } = analysis;
    await pool.query(
      `INSERT INTO resumes (
        file_name, name, email, phone, linkedin_url, portfolio_url, summary,
        work_experience, education, technical_skills, soft_skills, projects, certifications,
        resume_rating, improvement_areas, upskill_suggestions
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      )`,
      [
        req.file.originalname, name, email, phone, linkedin_url, portfolio_url, summary,
        JSON.stringify(work_experience), JSON.stringify(education), JSON.stringify(technical_skills),
        JSON.stringify(soft_skills), JSON.stringify(projects), JSON.stringify(certifications),
        resume_rating, improvement_areas, JSON.stringify(upskill_suggestions)
      ]
    );
    res.json({
      message: 'File uploaded, text extracted, and analyzed successfully!',
      filename: req.file.originalname,
      analysis, // This is the structured JSON from Gemini
    });
  } catch (error) {
    console.error('Gemini error:', error);
    let message = 'Failed to analyze resume.';
    if (error.status === 429) {
      message = 'You have exceeded your Gemini API quota. Please wait and try again later.';
    } else if (error.status === 503) {
      message = 'Gemini API is currently overloaded. Please try again in a few minutes.';
    }
    res.status(500).json({ message, error: error.message });
  }
});

app.get('/resumes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, file_name, name, email, uploaded_at FROM resumes ORDER BY uploaded_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Failed to fetch resumes.' });
  }
});

app.get('/resumes/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resume not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Failed to fetch resume.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Resume Analyzer Backend is running!');
});