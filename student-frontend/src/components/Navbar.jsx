import React, { useState } from 'react';
import { getApiBase, getCustomApiUrl, setCustomApiUrl, studentService } from '../services/studentService.js';

export default function Navbar({ studentCount, onRefresh, loading }) {
  const [showConfig, setShowConfig] = useState(false);
  const [inputUrl, setInputUrl] = useState(getCustomApiUrl() || getApiBase());
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const currentEndpoint = getApiBase();

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await studentService.testConnection(inputUrl);
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setCustomApiUrl(inputUrl);
    setShowConfig(false);
    onRefresh();
  };

  const handleReset = () => {
    setCustomApiUrl('');
    setInputUrl(getApiBase());
    setShowConfig(false);
    onRefresh();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Student Management</h1>
            <p className="text-xs text-slate-500">Spring Boot REST API &bull; Vite React Frontend</p>
          </div>
        </div>

        {/* Status, Endpoint Pill & Controls */}
        <div className="flex items-center gap-3">
          {/* Endpoint display / settings toggle */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Click to configure API Base URL"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden md:inline font-mono text-[11px] max-w-[220px] truncate">
              {currentEndpoint}
            </span>
            <span className="md:hidden">API Config</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="hidden sm:block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
            Total Students: <span className="text-indigo-600 font-bold">{studentCount}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh student records"
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg
              className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-600' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* API Configuration Popdown */}
      {showConfig && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">API Endpoint Configuration</h3>
                <p className="text-xs text-slate-500">
                  Configure the backend REST API URL (Render backend or localhost).
                </p>
              </div>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                ⚡ Note: Render free tier services go to sleep when inactive; first request takes ~45–60s to wake.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://your-backend.onrender.com/culala/students"
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleTest}
                disabled={isTesting}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Save &amp; Reload
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Reset Default
              </button>
            </div>

            {testResult && (
              <div
                className={`text-xs p-2 rounded-lg font-mono ${
                  testResult.ok
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {testResult.ok
                  ? `✔ Connected successfully (Status ${testResult.status}) at ${testResult.url}`
                  : `✖ Connection failed: ${testResult.error || 'Check server status or CORS'}`}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
