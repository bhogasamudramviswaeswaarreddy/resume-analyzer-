import React, { useState } from 'react';
import ResumeUploader from './components/ResumeUploader';
import PastResumesTable from './components/PastResumesTable/PastResumesTable';

function App() {
  const [activeTab, setActiveTab] = useState('analyze');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
        <button
          onClick={() => setActiveTab('analyze')}
          style={{
            padding: '10px 24px',
            marginRight: 8,
            background: activeTab === 'analyze' ? '#3498db' : '#f4f4f4',
            color: activeTab === 'analyze' ? '#fff' : '#333',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Live Resume Analysis
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 24px',
            background: activeTab === 'history' ? '#3498db' : '#f4f4f4',
            color: activeTab === 'history' ? '#fff' : '#333',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          History
        </button>
      </div>
      {activeTab === 'analyze' && <ResumeUploader />}
      {activeTab === 'history' && <PastResumesTable />}
    </div>
  );
}

export default App;