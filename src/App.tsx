import React, { useState, useEffect } from 'react';
import BasketballCourt from './components/BasketballCourt';
import StatsDisplay from './components/StatsDisplay';
import ShotHistory from './components/ShotHistory';
import ModeSelector from './components/ModeSelector';
import { Shot, calculateStats } from './types';
import './App.css';

function App() {
  const [mode, setMode] = useState<'student' | 'mentor' | null>(() => {
    const saved = localStorage.getItem('appMode');
    return saved as 'student' | 'mentor' | null;
  });

  const [shots, setShots] = useState<Shot[]>(() => {
    const saved = localStorage.getItem('basketballShots');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'court' | 'stats' | 'history'>('court');

  // Save mode to localStorage
  useEffect(() => {
    if (mode) {
      localStorage.setItem('appMode', mode);
    }
  }, [mode]);

  // Save shots to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('basketballShots', JSON.stringify(shots));
  }, [shots]);

  const handleModeSelect = (selectedMode: 'student' | 'mentor') => {
    setMode(selectedMode);
    setShots([]); // Clear history when selecting mode
  };

  const handleShotRecorded = (shot: Shot) => {
    setShots([...shots, shot]);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all shots? This cannot be undone.')) {
      setShots([]);
    }
  };

  if (!mode) {
    return <ModeSelector onModeSelect={handleModeSelect} />;
  }

  const stats = calculateStats(shots);

  // Mentor dashboard - different layout
  if (mode === 'mentor') {
    return (
      <div className="app mentor-mode">
        <header className="app-header">
          <h1>👨‍🏫 Basketball Shot Tracker - Mentor Dashboard</h1>
          <p>Monitor student shooting performance</p>
          <button 
            className="mode-switch-btn"
            onClick={() => {
              setMode(null);
              setShots([]);
            }}
          >
            Switch Mode
          </button>
        </header>

        <div className="nav-tabs">
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Stats
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📝 History
          </button>
        </div>

        <main className="app-content">
          {activeTab === 'stats' && <StatsDisplay stats={stats} />}
          {activeTab === 'history' && (
            <ShotHistory shots={shots} onClear={handleClear} />
          )}
        </main>

        <footer className="app-footer">
          <p>📈 Tip: Review student stats and shot history to provide feedback</p>
        </footer>
      </div>
    );
  }

  // Student mode - regular interface
  return (
    <div className="app student-mode">
      <header className="app-header">
        <h1>🏀 Basketball Shot Tracker</h1>
        <p>Track your shooting performance with a visual heatmap</p>
        <button 
          className="mode-switch-btn"
          onClick={() => {
            setMode(null);
            setShots([]);
          }}
        >
          Switch Mode
        </button>
      </header>

      <div className="nav-tabs">
        <button
          className={`tab ${activeTab === 'court' ? 'active' : ''}`}
          onClick={() => setActiveTab('court')}
        >
          🏀 Court
        </button>
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📝 History
        </button>
      </div>

      <main className="app-content">
        {activeTab === 'court' && (
          <BasketballCourt onShotRecorded={handleShotRecorded} shots={shots} />
        )}
        {activeTab === 'stats' && <StatsDisplay stats={stats} />}
        {activeTab === 'history' && (
          <ShotHistory shots={shots} onClear={handleClear} />
        )}
      </main>

      <footer className="app-footer">
        <p>💡 Tip: Click on different zones to record shots. Green = Hot, Red = Cold</p>
      </footer>
    </div>
  );
}

export default App;
