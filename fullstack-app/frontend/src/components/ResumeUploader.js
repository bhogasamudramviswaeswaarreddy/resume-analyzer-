import React, { useState } from 'react';
import axios from 'axios';
import './ResumeUploader.css';
import ResumeDetails from './ResumeDetails/ResumeDetails';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setAnalysis(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a PDF file.');
      setAnalysis(null);
      return;
    }
    const formData = new FormData();
    formData.append('resume', file);
    setLoading(true);
    setMessage('');
    setAnalysis(null);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setAnalysis(res.data.analysis || null);
    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Upload failed. Please try again.'
      );
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-uploader-container">
      <h2 className="resume-uploader-title">Resume Analyzer</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <label htmlFor="resume-upload" className="resume-upload-label">
          {file ? file.name : 'Click or drag a PDF file here to upload'}
          <input
            id="resume-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="resume-upload-input"
          />
        </label>
        <button
          type="submit"
          className="resume-upload-btn"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16 }}>
          <div className="resume-spinner" />
          <span style={{ color: '#888', marginTop: 8 }}>Analyzing your resume...</span>
        </div>
      )}
      {message && (
        <p className={`resume-message${message.toLowerCase().includes('success') ? ' success' : ''}`}>
          {message}
        </p>
      )}
      {analysis && <ResumeDetails analysis={analysis} />}
    </div>
  );
};

export default ResumeUploader;