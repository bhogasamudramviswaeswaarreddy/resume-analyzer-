import React from 'react';
import './ResumeDetails.css';

const ResumeDetails = ({ analysis }) => {
  if (!analysis) return null;

  // Helper to get badge class based on rating
  const getRatingBadgeClass = (rating) => {
    if (rating === null || rating === undefined) return '';
    if (rating >= 8) return 'rating-badge';
    if (rating >= 5) return 'rating-badge low';
    return 'rating-badge very-low';
  };

  return (
    <div className="resume-details-container">
      {/* Personal Info */}
      <section className="resume-card">
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {analysis.name || 'N/A'}</p>
        <p><strong>Email:</strong> {analysis.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {analysis.phone || 'N/A'}</p>
        <p><strong>LinkedIn:</strong> {analysis.linkedin_url || 'N/A'}</p>
        <p><strong>Portfolio:</strong> {analysis.portfolio_url || 'N/A'}</p>
      </section>

      {/* Summary */}
      <section className="resume-card">
        <h3>Summary</h3>
        <p>{analysis.summary || 'N/A'}</p>
      </section>

      {/* Work Experience */}
      <section className="resume-card">
        <h3>Work Experience</h3>
        {Array.isArray(analysis.work_experience) && analysis.work_experience.length > 0 ? (
          analysis.work_experience.map((exp, idx) => (
            <div key={idx} className="resume-subcard">
              <p><strong>Role:</strong> {exp.role}</p>
              <p><strong>Company:</strong> {exp.company}</p>
              <p><strong>Duration:</strong> {exp.duration}</p>
              <p><strong>Description:</strong></p>
              <ul>
                {exp.description && exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
              </ul>
            </div>
          ))
        ) : <p>N/A</p>}
      </section>

      {/* Education */}
      <section className="resume-card">
        <h3>Education</h3>
        {Array.isArray(analysis.education) && analysis.education.length > 0 ? (
          analysis.education.map((edu, idx) => (
            <div key={idx} className="resume-subcard">
              <p><strong>Degree:</strong> {edu.degree}</p>
              <p><strong>Institution:</strong> {edu.institution}</p>
              <p><strong>Graduation Year:</strong> {edu.graduation_year}</p>
            </div>
          ))
        ) : <p>N/A</p>}
      </section>

      {/* Projects */}
      <section className="resume-card">
        <h3>Projects</h3>
        {Array.isArray(analysis.projects) && analysis.projects.length > 0 ? (
          analysis.projects.map((proj, idx) => (
            <div key={idx} className="resume-subcard">
              <p><strong>Title:</strong> {proj.title}</p>
              <p><strong>Description:</strong> {proj.description}</p>
              <p><strong>Technologies:</strong> {proj.technologies && proj.technologies.join(', ')}</p>
              <p><strong>Duration:</strong> {proj.duration}</p>
            </div>
          ))
        ) : <p>N/A</p>}
      </section>

      {/* Certifications */}
      <section className="resume-card">
        <h3>Certifications</h3>
        {Array.isArray(analysis.certifications) && analysis.certifications.length > 0 ? (
          analysis.certifications.map((cert, idx) => (
            <div key={idx} className="resume-subcard">
              <p><strong>Name:</strong> {cert.name}</p>
              <p><strong>Issuer:</strong> {cert.issuer}</p>
              <p><strong>Year:</strong> {cert.year}</p>
            </div>
          ))
        ) : <p>N/A</p>}
      </section>

      {/* Skills */}
      <section className="resume-card">
        <h3>Technical Skills</h3>
        <p>{Array.isArray(analysis.technical_skills) && analysis.technical_skills.length > 0 ? analysis.technical_skills.join(', ') : 'N/A'}</p>
        <h3>Soft Skills</h3>
        <p>{Array.isArray(analysis.soft_skills) && analysis.soft_skills.length > 0 ? analysis.soft_skills.join(', ') : 'N/A'}</p>
      </section>

      {/* AI Feedback */}
      <section className="resume-card ai-feedback">
        <h3>AI Feedback</h3>
        <p>
          <strong>Resume Rating:</strong>
          <span className={getRatingBadgeClass(Number(analysis.resume_rating))}>
            {analysis.resume_rating || 'N/A'}/10
          </span>
        </p>
        <p><strong>Improvement Areas:</strong> {analysis.improvement_areas || 'N/A'}</p>
        <p><strong>Upskill Suggestions:</strong> {Array.isArray(analysis.upskill_suggestions) && analysis.upskill_suggestions.length > 0 ? analysis.upskill_suggestions.join(', ') : 'N/A'}</p>
      </section>
    </div>
  );
};

export default ResumeDetails;
