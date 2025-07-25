import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PastResumesTable.css';
import ResumeDetails from '../ResumeDetails/ResumeDetails';

const PastResumesTable = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    // Fetch all resumes from backend
    const fetchResumes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/resumes');
        setResumes(res.data);
      } catch (err) {
        alert('Failed to fetch resumes');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleShowDetails = async (id) => {
    setModalLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/resumes/${id}`);
      setSelectedResume(res.data);
    } catch (err) {
      alert('Failed to fetch resume details');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="past-resumes-table-container">
      <h2>Past Resume Analyses</h2>
      {loading ? (
        <p>Loading...</p>
      ) : resumes.length === 0 ? (
        <p style={{textAlign: 'center', color: '#888', marginTop: 32}}>
          No resumes found. Upload a resume to get started!
        </p>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table className="past-resumes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>File Name</th>
                <th>Name</th>
                <th>Email</th>
                <th>Uploaded At</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td>{resume.id}</td>
                  <td>{resume.file_name}</td>
                  <td>{resume.name}</td>
                  <td>{resume.email}</td>
                  <td>{new Date(resume.uploaded_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleShowDetails(resume.id)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for full analysis */}
      {selectedResume && (
        <div className="modal-overlay" onClick={() => setSelectedResume(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Resume Analysis Details</h3>
            {modalLoading ? (
              <div>
                <div className="spinner" />
                <p style={{textAlign: 'center'}}>Loading...</p>
              </div>
            ) : (
              <ResumeDetails analysis={selectedResume} />
            )}
            <button onClick={() => setSelectedResume(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastResumesTable;
